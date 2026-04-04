/**
 * Security Module — Public API
 * ==============================
 * Single entry point for all security functionality.
 */

export { encryptField, decryptField, encryptFields, decryptFields, generateMasterKey, createBlindIndex } from './encryption.js';
export { TokenVault } from './tokenization.js';
export { CreditApplicationHandler } from './creditApplication.js';
export { validateCreditApplication, sanitizeObject } from './validation.js';
export { AuditLogger } from './auditLog.js';
export { DataRetentionManager } from './dataRetention.js';
export { complianceConfig, runComplianceCheck } from './compliance.js';
export {
  securityHeaders,
  rateLimiter,
  requestSizeLimiter,
  sanitizeBody,
  csrfProtection,
  requestLogger,
  requireHTTPS,
  fullSecurityStack,
} from './middleware.js';
