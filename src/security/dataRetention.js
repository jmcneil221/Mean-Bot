/**
 * Data Retention & Purge Policy
 * ===============================
 * Defines how long sensitive data is kept and when it's destroyed.
 * Required for GDPR, CCPA, and GLBA (Gramm-Leach-Bliley Act) compliance.
 *
 * Principle: Keep data only as long as legally required, then destroy it.
 */

export class DataRetentionManager {
  constructor() {
    this.policies = new Map();
    this.scheduledPurges = [];
    this._setupDefaultPolicies();
  }

  _setupDefaultPolicies() {
    // Credit application data
    this.setPolicy('credit_application_approved', {
      retentionDays: 2555,     // ~7 years (GLBA/IRS requirement)
      reason: 'Financial regulations require 7-year retention for approved applications',
      autoArchive: 365,         // Move to cold storage after 1 year
      autoPurge: true,
    });

    this.setPolicy('credit_application_denied', {
      retentionDays: 730,       // 2 years (ECOA requirement for adverse action records)
      reason: 'Equal Credit Opportunity Act requires 25 months minimum',
      autoArchive: 90,
      autoPurge: true,
    });

    this.setPolicy('credit_application_withdrawn', {
      retentionDays: 365,       // 1 year
      reason: 'Retain for potential disputes/resubmission',
      autoArchive: 90,
      autoPurge: true,
    });

    // SSN tokens in vault
    this.setPolicy('ssn_token', {
      retentionDays: 2555,      // Aligned with credit application retention
      reason: 'Required as long as associated credit application exists',
      autoPurge: true,
    });

    // Audit logs (NEVER auto-purge — these are your legal protection)
    this.setPolicy('audit_log', {
      retentionDays: 2555,      // 7 years
      reason: 'PCI DSS requires 1 year readily available, 7 years archived',
      autoArchive: 365,
      autoPurge: false,          // Manual purge only
    });

    // Session data
    this.setPolicy('session_data', {
      retentionDays: 1,
      reason: 'Sessions should expire within 24 hours of inactivity',
      autoPurge: true,
    });

    // Failed login attempts
    this.setPolicy('failed_login', {
      retentionDays: 90,
      reason: 'Security analysis of brute force patterns',
      autoPurge: true,
    });

    // User account data (after account deletion)
    this.setPolicy('deleted_account', {
      retentionDays: 30,         // 30-day grace period for undeletion
      reason: 'Grace period before permanent deletion',
      autoPurge: true,
    });

    // Uploaded documents (license photos, etc.)
    this.setPolicy('identity_document', {
      retentionDays: 90,         // Delete after verification
      reason: 'Delete identity documents after verification is complete',
      autoPurge: true,
    });
  }

  /** Set or update a retention policy */
  setPolicy(dataType, policy) {
    this.policies.set(dataType, {
      ...policy,
      dataType,
      createdAt: new Date().toISOString(),
    });
  }

  /** Get the retention policy for a data type */
  getPolicy(dataType) {
    return this.policies.get(dataType);
  }

  /** Check if a record should be purged based on its creation date */
  shouldPurge(dataType, createdAt) {
    const policy = this.policies.get(dataType);
    if (!policy) return false;
    if (!policy.autoPurge) return false;

    const created = new Date(createdAt);
    const now = new Date();
    const daysSinceCreation = Math.floor((now - created) / (1000 * 60 * 60 * 24));

    return daysSinceCreation >= policy.retentionDays;
  }

  /** Check if a record should be archived */
  shouldArchive(dataType, createdAt) {
    const policy = this.policies.get(dataType);
    if (!policy || !policy.autoArchive) return false;

    const created = new Date(createdAt);
    const now = new Date();
    const daysSinceCreation = Math.floor((now - created) / (1000 * 60 * 60 * 24));

    return daysSinceCreation >= policy.autoArchive;
  }

  /** Schedule a purge check */
  schedulePurge(dataType, recordId, createdAt) {
    this.scheduledPurges.push({
      dataType,
      recordId,
      createdAt,
      scheduledAt: new Date().toISOString(),
      status: 'scheduled',
    });
  }

  /** Get records due for purging */
  getRecordsDueForPurge() {
    return this.scheduledPurges.filter(p =>
      p.status === 'scheduled' && this.shouldPurge(p.dataType, p.createdAt)
    );
  }

  /** Get records due for archiving */
  getRecordsDueForArchive() {
    return this.scheduledPurges.filter(p =>
      p.status === 'scheduled' && this.shouldArchive(p.dataType, p.createdAt)
    );
  }

  /** Handle a GDPR/CCPA deletion request — overrides retention policy */
  handleDeletionRequest(recordId, requestedBy) {
    const entry = this.scheduledPurges.find(p => p.recordId === recordId);
    if (entry) {
      entry.status = 'deletion_requested';
      entry.deletionRequestedBy = requestedBy;
      entry.deletionRequestedAt = new Date().toISOString();
    }
    return {
      action: 'deletion_requested',
      recordId,
      message: 'Data will be permanently deleted within 30 days per GDPR/CCPA requirements',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  /** Get all policies as a compliance report */
  getComplianceReport() {
    const policies = [];
    for (const [type, policy] of this.policies) {
      policies.push({
        dataType: type,
        retentionPeriod: `${policy.retentionDays} days (${(policy.retentionDays / 365).toFixed(1)} years)`,
        autoArchiveAfter: policy.autoArchive ? `${policy.autoArchive} days` : 'N/A',
        autoPurge: policy.autoPurge ? 'Yes' : 'No (manual only)',
        reason: policy.reason,
      });
    }

    return {
      generatedAt: new Date().toISOString(),
      policies,
      scheduledPurges: this.scheduledPurges.length,
      pendingDeletions: this.scheduledPurges.filter(p => p.status === 'deletion_requested').length,
    };
  }
}
