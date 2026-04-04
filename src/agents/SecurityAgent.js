import { Agent } from '../core/Agent.js';

/**
 * SecurityAgent — Expert in application security, data protection, and compliance.
 *
 * Handles: security architecture, authentication, encryption, OWASP compliance,
 * penetration testing strategy, data privacy, incident response.
 */
export class SecurityAgent extends Agent {
  constructor() {
    super({
      name: 'Security Expert',
      role: 'Security & Data Protection Expert',
      expertise: [
        'application security (OWASP Top 10)',
        'authentication & authorization',
        'encryption & data protection',
        'API security',
        'mobile app security',
        'GDPR / CCPA compliance',
        'penetration testing',
        'incident response planning',
        'secure development lifecycle',
        'infrastructure security',
      ],
      capabilities: [
        'security_audit',
        'design_auth_system',
        'create_security_policy',
        'threat_modeling',
        'compliance_check',
        'incident_response_plan',
      ],
    });
  }

  async executeTask(task) {
    const handlers = {
      security_audit: () => this.performSecurityAudit(task),
      design_auth: () => this.designAuthSystem(task),
      threat_model: () => this.createThreatModel(task),
      default: () => this.generalSecurityTask(task),
    };
    const handler = handlers[task.type] || handlers.default;
    return handler();
  }

  performSecurityAudit(task) {
    return {
      agent: this.name,
      task: task.title,
      auditChecklist: {
        authentication: [
          'JWT tokens with short expiry (15 min access, 7 day refresh)',
          'Bcrypt password hashing with cost factor 12+',
          'Rate limiting on login attempts (5/min per IP, 10/min per account)',
          'Multi-factor authentication (SMS + authenticator app)',
          'Session invalidation on password change',
          'Secure cookie attributes (HttpOnly, Secure, SameSite=Strict)',
        ],
        dataProtection: [
          'Encrypt PII at rest (AES-256)',
          'TLS 1.3 for all data in transit',
          'Database field-level encryption for SSN, license numbers',
          'Secure file upload validation (type, size, malware scan)',
          'Data retention policy with automatic purging',
          'Right to deletion (GDPR/CCPA compliance)',
        ],
        apiSecurity: [
          'Input validation on all endpoints (Zod/Joi schemas)',
          'SQL injection prevention (parameterized queries via ORM)',
          'XSS prevention (Content Security Policy headers)',
          'CSRF protection (double-submit cookie pattern)',
          'Rate limiting per endpoint and user tier',
          'API key rotation mechanism',
          'Request size limits (1MB default, 10MB for uploads)',
        ],
        infrastructure: [
          'WAF (Web Application Firewall) in front of all services',
          'DDoS protection (Cloudflare or AWS Shield)',
          'Container scanning for vulnerabilities',
          'Secrets management (never in code — use env vars or vault)',
          'Automated dependency vulnerability scanning (Dependabot/Snyk)',
          'Logging all auth events and sensitive operations',
        ],
        mobileSecurity: [
          'Certificate pinning for API communication',
          'Secure local storage (Keychain/Keystore)',
          'Biometric authentication option',
          'Root/jailbreak detection',
          'Code obfuscation for release builds',
          'No sensitive data in app logs',
        ],
      },
      priorityCritical: [
        'NEVER store plain-text passwords',
        'NEVER log sensitive data (passwords, tokens, SSN)',
        'NEVER expose stack traces in production errors',
        'ALWAYS validate and sanitize user input',
        'ALWAYS use HTTPS — no exceptions',
      ],
      recommendations: [
        'Implement security headers: HSTS, CSP, X-Frame-Options, X-Content-Type-Options',
        'Set up automated security scanning in CI/CD pipeline',
        'Create a bug bounty program after launch',
        'Conduct quarterly penetration tests',
        'Driver data is especially sensitive — treat it like financial data',
      ],
    };
  }

  designAuthSystem(task) {
    return {
      agent: this.name,
      task: task.title,
      authArchitecture: {
        registration: {
          flow: 'Email/Phone -> Verify -> Set password -> Profile setup -> Document verification',
          verification: 'Phone via SMS OTP, Email via magic link',
          driverVerification: 'License photo upload -> AI validation -> Manual review for edge cases',
        },
        login: {
          methods: ['Email + password', 'Phone + OTP', 'Google OAuth', 'Apple Sign-In'],
          mfa: 'Optional but encouraged — authenticator app preferred over SMS',
          sessions: 'JWT access token (15 min) + refresh token (7 days, rotating)',
        },
        authorization: {
          model: 'RBAC (Role-Based Access Control)',
          roles: ['driver', 'rider', 'fleet_manager', 'admin', 'super_admin'],
          permissions: 'Granular per-resource permissions stored in database',
        },
      },
    };
  }

  createThreatModel(task) {
    return {
      agent: this.name,
      task: task.title,
      threats: [
        { threat: 'Account takeover', severity: 'Critical', mitigation: 'MFA, anomaly detection, device fingerprinting' },
        { threat: 'Fake driver registration', severity: 'High', mitigation: 'Document verification, background check integration' },
        { threat: 'Location data exposure', severity: 'High', mitigation: 'Encrypt location data, minimize retention, user consent' },
        { threat: 'Payment fraud', severity: 'Critical', mitigation: 'Stripe fraud detection, transaction monitoring, velocity checks' },
        { threat: 'API abuse/scraping', severity: 'Medium', mitigation: 'Rate limiting, API keys, bot detection' },
        { threat: 'Data breach', severity: 'Critical', mitigation: 'Encryption at rest, access controls, audit logging, incident response plan' },
        { threat: 'Man-in-the-middle', severity: 'High', mitigation: 'TLS 1.3, certificate pinning, HSTS' },
        { threat: 'Insider threat', severity: 'Medium', mitigation: 'Principle of least privilege, audit logs, access reviews' },
      ],
    };
  }

  generalSecurityTask(task) {
    return {
      agent: this.name,
      task: task.title,
      output: `Security analysis complete for: ${task.title}`,
      recommendations: ['Security is not a feature — it is a requirement at every layer'],
    };
  }
}
