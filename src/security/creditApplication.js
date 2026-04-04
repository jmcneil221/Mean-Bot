/**
 * Secure Credit Application Handler
 * ====================================
 * Processes credit applications with full PII protection.
 * Validates, sanitizes, tokenizes, and encrypts all sensitive fields.
 *
 * Data flow:
 *   User submits form → Validate → Sanitize → Tokenize SSN/sensitive fields
 *   → Encrypt remaining PII → Store (tokens in main DB, real data in vault)
 *   → Audit log → Return confirmation
 *
 * The main database NEVER sees a raw SSN or full credit card number.
 */

import { TokenVault } from './tokenization.js';
import { encryptFields, decryptFields } from './encryption.js';
import { validateCreditApplication } from './validation.js';
import { AuditLogger } from './auditLog.js';

/** Fields that get TOKENIZED (replaced with meaningless tokens) */
const TOKENIZED_FIELDS = [
  { field: 'ssn', type: 'ssn' },
  { field: 'bankAccountNumber', type: 'bank_account' },
  { field: 'bankRoutingNumber', type: 'bank_account' },
  { field: 'driversLicenseNumber', type: 'drivers_license' },
];

/** Fields that get ENCRYPTED (reversible, but protected at rest) */
const ENCRYPTED_FIELDS = [
  'dateOfBirth',
  'mothersMaidenName',
  'annualIncome',
  'monthlyHousingPayment',
];

/** Fields that are stored as-is (non-sensitive) */
const PLAIN_FIELDS = [
  'applicationId',
  'applicationType',
  'status',
  'createdAt',
  'updatedAt',
];

export class CreditApplicationHandler {
  constructor(masterKey) {
    this.vault = new TokenVault(masterKey);
    this.auditLog = new AuditLogger();
    this.masterKey = masterKey;
    this.applications = new Map();
  }

  /**
   * Process a new credit application submission.
   * This is the main entry point from your API route.
   */
  async submitApplication(rawData, submitterIP, userAgent) {
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Step 1: Validate all fields
    const validation = validateCreditApplication(rawData);
    if (!validation.valid) {
      this.auditLog.log({
        action: 'APPLICATION_REJECTED',
        applicationId,
        reason: 'Validation failed',
        errors: validation.errors,
        ip: submitterIP,
      });
      return {
        success: false,
        errors: validation.errors,
        message: 'Application validation failed. Please correct the errors and resubmit.',
      };
    }

    // Step 2: Tokenize the most sensitive fields (SSN, bank accounts)
    const tokenizedData = { ...rawData, applicationId };
    const tokenMap = {};

    for (const { field, type } of TOKENIZED_FIELDS) {
      if (tokenizedData[field]) {
        const token = this.vault.tokenize(tokenizedData[field], type);
        tokenMap[field] = token;
        tokenizedData[field] = token;  // Replace raw value with token
      }
    }

    // Step 3: Encrypt remaining PII fields
    const securedData = encryptFields(tokenizedData, ENCRYPTED_FIELDS, this.masterKey);

    // Step 4: Add metadata
    securedData.applicationId = applicationId;
    securedData.status = 'submitted';
    securedData.createdAt = new Date().toISOString();
    securedData.updatedAt = new Date().toISOString();
    securedData._tokenMap = tokenMap;  // Track which fields are tokenized
    securedData._encryptedFields = ENCRYPTED_FIELDS.filter(f => rawData[f]);

    // Step 5: Store the secured application
    this.applications.set(applicationId, securedData);

    // Step 6: Audit log
    this.auditLog.log({
      action: 'APPLICATION_SUBMITTED',
      applicationId,
      applicantName: `${rawData.firstName} ${rawData.lastName}`,
      ip: submitterIP,
      userAgent,
      fieldsTokenized: Object.keys(tokenMap),
      fieldsEncrypted: securedData._encryptedFields,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      applicationId,
      message: 'Credit application submitted securely.',
      status: 'submitted',
      maskedSSN: this.vault.getMasked(tokenMap.ssn, 'ssn'),
    };
  }

  /**
   * Retrieve an application with sensitive data masked by default.
   * Full data requires explicit authorization.
   */
  getApplication(applicationId, { accessLevel = 'masked', accessedBy, accessReason } = {}) {
    const app = this.applications.get(applicationId);
    if (!app) return null;

    this.auditLog.log({
      action: 'APPLICATION_ACCESSED',
      applicationId,
      accessLevel,
      accessedBy: accessedBy || 'unknown',
      accessReason: accessReason || 'not provided',
    });

    if (accessLevel === 'masked') {
      // Return with sensitive fields masked
      const masked = { ...app };
      for (const [field, token] of Object.entries(app._tokenMap || {})) {
        const tokenDef = TOKENIZED_FIELDS.find(t => t.field === field);
        masked[field] = this.vault.getMasked(token, tokenDef?.type);
      }
      // Encrypted fields show as [ENCRYPTED]
      for (const field of app._encryptedFields || []) {
        masked[field] = '[ENCRYPTED]';
      }
      delete masked._tokenMap;
      delete masked._encryptedFields;
      return masked;
    }

    if (accessLevel === 'full') {
      if (!accessedBy || !accessReason) {
        throw new Error('Full access requires accessor identity and documented reason');
      }

      this.auditLog.log({
        action: 'APPLICATION_FULL_ACCESS',
        applicationId,
        accessedBy,
        accessReason,
        severity: 'HIGH',
      });

      // Detokenize and decrypt everything
      const full = { ...app };
      for (const [field, token] of Object.entries(app._tokenMap || {})) {
        full[field] = this.vault.detokenize(token, accessReason, accessedBy);
      }
      // Decrypt encrypted fields
      const decrypted = decryptFields(full, app._encryptedFields || [], this.masterKey);
      delete decrypted._tokenMap;
      delete decrypted._encryptedFields;
      return decrypted;
    }

    throw new Error(`Invalid access level: ${accessLevel}`);
  }

  /**
   * Update application status (approve, deny, pending review, etc.)
   */
  updateStatus(applicationId, newStatus, updatedBy, reason) {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');

    const oldStatus = app.status;
    app.status = newStatus;
    app.updatedAt = new Date().toISOString();

    this.auditLog.log({
      action: 'APPLICATION_STATUS_CHANGED',
      applicationId,
      oldStatus,
      newStatus,
      updatedBy,
      reason,
    });

    return { applicationId, oldStatus, newStatus };
  }

  /**
   * Delete an application and all associated sensitive data.
   * For GDPR/CCPA right-to-erasure compliance.
   */
  deleteApplication(applicationId, deletedBy, reason) {
    const app = this.applications.get(applicationId);
    if (!app) throw new Error('Application not found');

    // Destroy all tokens in the vault
    const tokens = Object.values(app._tokenMap || {});
    this.vault.destroyAll(tokens);

    // Delete the application record
    this.applications.delete(applicationId);

    this.auditLog.log({
      action: 'APPLICATION_DELETED',
      applicationId,
      deletedBy,
      reason,
      tokensDestroyed: tokens.length,
      severity: 'HIGH',
    });

    return { deleted: true, applicationId, tokensDestroyed: tokens.length };
  }

  /** Get all applications (masked) with pagination */
  listApplications({ page = 1, limit = 20, status } = {}) {
    let apps = [...this.applications.values()];
    if (status) apps = apps.filter(a => a.status === status);

    const total = apps.length;
    const start = (page - 1) * limit;
    const pageApps = apps.slice(start, start + limit);

    // Return masked versions only
    return {
      applications: pageApps.map(app => ({
        applicationId: app.applicationId,
        firstName: app.firstName,
        lastName: app.lastName,
        status: app.status,
        createdAt: app.createdAt,
        ssn: app._tokenMap?.ssn ? this.vault.getMasked(app._tokenMap.ssn, 'ssn') : null,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
