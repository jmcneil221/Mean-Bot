/**
 * Audit Logger — Tamper-Evident Logging for PII Access
 * ======================================================
 * Every time sensitive data is accessed, modified, or deleted, it's logged here.
 * Logs are chained (each entry references the previous hash) to detect tampering.
 *
 * Required for: PCI DSS (Req 10), SOC 2, GLBA, HIPAA
 *
 * Logs capture:
 * - WHO accessed the data
 * - WHAT data was accessed
 * - WHEN it was accessed
 * - WHERE (IP, user agent)
 * - WHY (documented reason)
 */

import { createHash } from 'crypto';

export class AuditLogger {
  constructor() {
    this.logs = [];
    this.lastHash = '0'.repeat(64); // Genesis hash
  }

  /**
   * Log an audit event. Returns the log entry with its chain hash.
   */
  log(event) {
    const entry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      action: event.action,
      severity: event.severity || this._inferSeverity(event.action),

      // WHO
      accessedBy: event.accessedBy || event.updatedBy || event.deletedBy || 'system',

      // WHAT
      resourceType: event.resourceType || 'credit_application',
      resourceId: event.applicationId || event.resourceId || null,

      // Details
      details: { ...event },

      // Chain integrity
      previousHash: this.lastHash,
      hash: null,
    };

    // Remove redundant fields from details
    delete entry.details.action;
    delete entry.details.severity;

    // Compute chain hash
    entry.hash = this._computeHash(entry);
    this.lastHash = entry.hash;

    this.logs.push(entry);

    // Console output for high-severity events
    if (entry.severity === 'HIGH' || entry.severity === 'CRITICAL') {
      console.warn(`[AUDIT] [${entry.severity}] ${entry.action} by ${entry.accessedBy} on ${entry.resourceId}`);
    }

    return entry;
  }

  /**
   * Verify the integrity of the entire audit log chain.
   * Detects if any log entry has been tampered with.
   */
  verifyIntegrity() {
    let expectedPrevHash = '0'.repeat(64);
    const issues = [];

    for (let i = 0; i < this.logs.length; i++) {
      const entry = this.logs[i];

      // Check chain link
      if (entry.previousHash !== expectedPrevHash) {
        issues.push({
          index: i,
          issue: 'Chain link broken — previous hash mismatch',
          entryId: entry.id,
        });
      }

      // Re-compute hash and compare
      const computed = this._computeHash(entry);
      if (computed !== entry.hash) {
        issues.push({
          index: i,
          issue: 'Entry hash mismatch — possible tampering',
          entryId: entry.id,
        });
      }

      expectedPrevHash = entry.hash;
    }

    return {
      valid: issues.length === 0,
      totalEntries: this.logs.length,
      issues,
    };
  }

  /**
   * Query audit logs with filters.
   */
  query({ action, accessedBy, resourceId, severity, since, until, limit = 100 } = {}) {
    let results = [...this.logs];

    if (action) results = results.filter(e => e.action === action);
    if (accessedBy) results = results.filter(e => e.accessedBy === accessedBy);
    if (resourceId) results = results.filter(e => e.resourceId === resourceId);
    if (severity) results = results.filter(e => e.severity === severity);
    if (since) results = results.filter(e => new Date(e.timestamp) >= new Date(since));
    if (until) results = results.filter(e => new Date(e.timestamp) <= new Date(until));

    return results.slice(-limit);
  }

  /**
   * Get a summary of audit activity.
   */
  getSummary() {
    const byAction = {};
    const bySeverity = {};
    const byUser = {};

    for (const entry of this.logs) {
      byAction[entry.action] = (byAction[entry.action] || 0) + 1;
      bySeverity[entry.severity] = (bySeverity[entry.severity] || 0) + 1;
      byUser[entry.accessedBy] = (byUser[entry.accessedBy] || 0) + 1;
    }

    return {
      totalEvents: this.logs.length,
      byAction,
      bySeverity,
      byUser,
      chainIntegrity: this.verifyIntegrity().valid ? 'INTACT' : 'COMPROMISED',
      oldestEntry: this.logs[0]?.timestamp || null,
      newestEntry: this.logs[this.logs.length - 1]?.timestamp || null,
    };
  }

  /**
   * Export logs for compliance reporting.
   */
  export({ format = 'json', since, until } = {}) {
    const entries = this.query({ since, until, limit: Infinity });

    if (format === 'json') {
      return JSON.stringify(entries, null, 2);
    }

    if (format === 'csv') {
      const headers = 'id,timestamp,action,severity,accessedBy,resourceType,resourceId,hash\n';
      const rows = entries.map(e =>
        `${e.id},${e.timestamp},${e.action},${e.severity},${e.accessedBy},${e.resourceType},${e.resourceId},${e.hash}`
      ).join('\n');
      return headers + rows;
    }

    return entries;
  }

  // --- Internal ---

  _computeHash(entry) {
    const payload = JSON.stringify({
      id: entry.id,
      timestamp: entry.timestamp,
      action: entry.action,
      accessedBy: entry.accessedBy,
      resourceId: entry.resourceId,
      details: entry.details,
      previousHash: entry.previousHash,
    });
    return createHash('sha256').update(payload).digest('hex');
  }

  _inferSeverity(action) {
    const severityMap = {
      APPLICATION_SUBMITTED: 'MEDIUM',
      APPLICATION_ACCESSED: 'LOW',
      APPLICATION_FULL_ACCESS: 'HIGH',
      APPLICATION_STATUS_CHANGED: 'MEDIUM',
      APPLICATION_DELETED: 'HIGH',
      APPLICATION_REJECTED: 'LOW',
      TOKEN_DETOKENIZED: 'HIGH',
      BULK_EXPORT: 'CRITICAL',
      SETTINGS_CHANGED: 'HIGH',
      LOGIN_FAILED: 'MEDIUM',
      LOGIN_SUCCESS: 'LOW',
      PASSWORD_CHANGED: 'HIGH',
      MFA_DISABLED: 'CRITICAL',
    };
    return severityMap[action] || 'MEDIUM';
  }
}
