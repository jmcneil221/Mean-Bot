/**
 * Security Middleware Stack
 * ==========================
 * Drop-in middleware for Express/Fastify to protect credit application routes.
 *
 * Layers:
 * 1. Security headers (HSTS, CSP, X-Frame-Options, etc.)
 * 2. Rate limiting (prevents brute force on application endpoints)
 * 3. Request size limiting (prevents DoS via large payloads)
 * 4. CSRF protection
 * 5. Input sanitization
 * 6. IP logging
 */

import { sanitizeObject } from './validation.js';

/**
 * Security headers — tells browsers to enforce protections.
 */
export function securityHeaders() {
  return (req, res, next) => {
    // Force HTTPS
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    // Prevent MIME sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Control referrer information
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Prevent XSS (legacy browsers)
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Content Security Policy
    res.setHeader('Content-Security-Policy', [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '));
    // Permissions policy
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), payment=(self)');
    // Remove server fingerprint
    res.removeHeader('X-Powered-By');

    next();
  };
}

/**
 * Rate limiter — in-memory, per-IP.
 * In production, use Redis-backed rate limiting.
 */
export function rateLimiter({ windowMs = 60000, maxRequests = 10, message = 'Too many requests' } = {}) {
  const requests = new Map();

  // Clean up expired entries periodically
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of requests) {
      if (now - data.windowStart > windowMs) {
        requests.delete(ip);
      }
    }
  }, windowMs).unref();

  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, windowStart: now });
      return next();
    }

    const data = requests.get(ip);

    if (now - data.windowStart > windowMs) {
      data.count = 1;
      data.windowStart = now;
      return next();
    }

    data.count++;

    if (data.count > maxRequests) {
      res.status(429).json({
        error: message,
        retryAfter: Math.ceil((data.windowStart + windowMs - now) / 1000),
      });
      return;
    }

    next();
  };
}

/**
 * Request size limiter — prevents oversized payloads.
 */
export function requestSizeLimiter({ maxBytes = 1048576 } = {}) {
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    if (contentLength > maxBytes) {
      res.status(413).json({
        error: `Request body too large. Maximum: ${Math.round(maxBytes / 1024)}KB`,
      });
      return;
    }
    next();
  };
}

/**
 * Sanitize all request body fields to prevent injection.
 */
export function sanitizeBody() {
  return (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }
    next();
  };
}

/**
 * CSRF protection using double-submit cookie pattern.
 */
export function csrfProtection() {
  return (req, res, next) => {
    // Skip for GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    const headerToken = req.headers['x-csrf-token'];
    const cookieToken = parseCookie(req.headers.cookie || '')['csrf-token'];

    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
      res.status(403).json({ error: 'CSRF token mismatch' });
      return;
    }

    next();
  };
}

/**
 * Log all requests to credit application endpoints.
 */
export function requestLogger(auditLogger) {
  return (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      if (req.path.includes('/credit-application') || req.path.includes('/application')) {
        auditLogger.log({
          action: 'API_REQUEST',
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration: Date.now() - start,
          ip: req.ip || req.connection?.remoteAddress,
          userAgent: req.headers['user-agent'],
          accessedBy: req.user?.id || 'anonymous',
        });
      }
    });

    next();
  };
}

/**
 * Require HTTPS — redirect or block HTTP requests.
 */
export function requireHTTPS() {
  return (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https' && req.protocol !== 'https') {
      if (process.env.NODE_ENV === 'production') {
        res.status(403).json({ error: 'HTTPS required' });
        return;
      }
    }
    next();
  };
}

/**
 * Apply all security middleware to a route.
 */
export function fullSecurityStack(auditLogger) {
  return [
    requireHTTPS(),
    securityHeaders(),
    rateLimiter({ windowMs: 60000, maxRequests: 5, message: 'Too many credit application attempts. Try again later.' }),
    requestSizeLimiter({ maxBytes: 512000 }), // 500KB max for applications
    sanitizeBody(),
    requestLogger(auditLogger),
  ];
}

// Utility
function parseCookie(cookieStr) {
  const cookies = {};
  cookieStr.split(';').forEach(pair => {
    const [key, value] = pair.trim().split('=');
    if (key) cookies[key] = decodeURIComponent(value || '');
  });
  return cookies;
}
