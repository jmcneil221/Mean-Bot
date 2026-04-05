import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  encryptField,
  decryptField,
  encryptFields,
  decryptFields,
  generateMasterKey,
} from '../security/encryption.js';
import { TokenVault } from '../security/tokenization.js';
import { validateCreditApplication, sanitizeObject } from '../security/validation.js';
import { AuditLogger } from '../security/auditLog.js';
import { DataRetentionManager } from '../security/dataRetention.js';
import { runComplianceCheck } from '../security/compliance.js';
import { CreditApplicationHandler } from '../security/creditApplication.js';

const TEST_MASTER_KEY = generateMasterKey();

// ─── Encryption Tests ────────────────────────────────────────────

describe('Field-Level Encryption', () => {
  it('should encrypt and decrypt a string value', () => {
    const ssn = '123-45-6789';
    const encrypted = encryptField(ssn, TEST_MASTER_KEY);
    assert.notEqual(encrypted, ssn, 'Encrypted should differ from plaintext');
    const decrypted = decryptField(encrypted, TEST_MASTER_KEY);
    assert.equal(decrypted, ssn);
  });

  it('should produce different ciphertexts for the same input (unique IVs)', () => {
    const value = '999-88-7777';
    const enc1 = encryptField(value, TEST_MASTER_KEY);
    const enc2 = encryptField(value, TEST_MASTER_KEY);
    assert.notEqual(enc1, enc2, 'Each encryption should use a unique IV');
    assert.equal(decryptField(enc1, TEST_MASTER_KEY), value);
    assert.equal(decryptField(enc2, TEST_MASTER_KEY), value);
  });

  it('should fail decryption with wrong key', () => {
    const encrypted = encryptField('sensitive-data', TEST_MASTER_KEY);
    const wrongKey = generateMasterKey();
    assert.throws(() => decryptField(encrypted, wrongKey));
  });

  it('should detect tampering (GCM auth tag)', () => {
    const encrypted = encryptField('my-ssn', TEST_MASTER_KEY);
    const buf = Buffer.from(encrypted, 'base64');
    buf[buf.length - 1] ^= 0xff; // Flip a byte
    const tampered = buf.toString('base64');
    assert.throws(() => decryptField(tampered, TEST_MASTER_KEY));
  });

  it('should encrypt/decrypt multiple fields on an object', () => {
    const data = { ssn: '111-22-3333', name: 'John', dob: '1990-01-15', income: '75000' };
    const sensitiveFields = ['ssn', 'dob', 'income'];
    const encrypted = encryptFields(data, sensitiveFields, TEST_MASTER_KEY);

    assert.equal(encrypted.name, 'John', 'Non-sensitive fields unchanged');
    assert.notEqual(encrypted.ssn, '111-22-3333');
    assert.notEqual(encrypted.dob, '1990-01-15');

    const decrypted = decryptFields(encrypted, sensitiveFields, TEST_MASTER_KEY);
    assert.equal(decrypted.ssn, '111-22-3333');
    assert.equal(decrypted.dob, '1990-01-15');
    assert.equal(decrypted.income, '75000');
  });

  it('should generate a valid master key', () => {
    const key = generateMasterKey();
    assert.equal(key.length, 64, 'Key should be 64 hex chars (256 bits)');
    assert.ok(/^[0-9a-f]+$/.test(key), 'Key should be hex');
  });
});

// ─── Tokenization Tests ─────────────────────────────────────────

describe('Tokenization Vault', () => {
  it('should tokenize an SSN and return a token', () => {
    const vault = new TokenVault(TEST_MASTER_KEY);
    const token = vault.tokenize('123-45-6789', 'ssn');
    assert.ok(token.startsWith('TOK-SSN-'), 'Token should have SSN prefix');
    assert.equal(token.length, 40, 'Token should be prefix + 32 hex chars');
  });

  it('should return the same token for the same value (dedup)', () => {
    const vault = new TokenVault(TEST_MASTER_KEY);
    const token1 = vault.tokenize('999-88-7777', 'ssn');
    const token2 = vault.tokenize('999-88-7777', 'ssn');
    assert.equal(token1, token2);
  });

  it('should detokenize with proper authorization', () => {
    const vault = new TokenVault(TEST_MASTER_KEY);
    const token = vault.tokenize('555-66-7777', 'ssn');
    const original = vault.detokenize(token, 'Credit check', 'admin@carbuyinghub.com');
    assert.equal(original, '555-66-7777');
  });

  it('should require access reason and identity for detokenization', () => {
    const vault = new TokenVault(TEST_MASTER_KEY);
    const token = vault.tokenize('111-22-3333', 'ssn');
    assert.throws(() => vault.detokenize(token), /required/);
  });

  it('should return masked SSN (***-**-1234)', () => {
    const vault = new TokenVault(TEST_MASTER_KEY);
    const token = vault.tokenize('123-45-6789', 'ssn');
    const masked = vault.getMasked(token, 'ssn');
    assert.equal(masked, '***-**-6789');
  });

  it('should mask credit card numbers', () => {
    const vault = new TokenVault(TEST_MASTER_KEY);
    const token = vault.tokenize('4111111111111234', 'credit_card');
    const masked = vault.getMasked(token, 'credit_card');
    assert.equal(masked, '****-****-****-1234');
  });

  it('should destroy a token permanently', () => {
    const vault = new TokenVault(TEST_MASTER_KEY);
    const token = vault.tokenize('999-99-9999', 'ssn');
    const destroyed = vault.destroy(token);
    assert.ok(destroyed);
    assert.throws(() => vault.detokenize(token, 'test', 'test'));
  });

  it('should reject a weak master key', () => {
    assert.throws(() => new TokenVault('short'), /at least 32/);
  });
});

// ─── Validation Tests ────────────────────────────────────────────

describe('Input Validation', () => {
  const validApplication = {
    firstName: 'John',
    lastName: 'Doe',
    ssn: '287-65-4321',
    dateOfBirth: '1990-05-15',
    email: 'john@example.com',
    phone: '555-123-4567',
    address: { street: '123 Main St', city: 'Austin', state: 'TX', zipCode: '78701' },
    annualIncome: 75000,
    monthlyHousingPayment: 1500,
    employmentStatus: 'employed',
    driversLicenseNumber: 'DL12345678',
    applicationType: 'auto_loan',
  };

  it('should accept a valid credit application', () => {
    const result = validateCreditApplication(validApplication);
    assert.ok(result.valid, `Expected valid but got errors: ${JSON.stringify(result.errors)}`);
  });

  it('should reject invalid SSN (all same digits)', () => {
    const result = validateCreditApplication({ ...validApplication, ssn: '111-11-1111' });
    assert.ok(!result.valid);
    assert.ok(result.errors.some(e => e.includes('SSN')));
  });

  it('should reject SSN with invalid area number', () => {
    const result = validateCreditApplication({ ...validApplication, ssn: '666-12-3456' });
    assert.ok(!result.valid);
  });

  it('should reject applicant under 18', () => {
    const result = validateCreditApplication({ ...validApplication, dateOfBirth: '2015-01-01' });
    assert.ok(!result.valid);
    assert.ok(result.errors.some(e => e.includes('18')));
  });

  it('should reject invalid email', () => {
    const result = validateCreditApplication({ ...validApplication, email: 'not-an-email' });
    assert.ok(!result.valid);
  });

  it('should reject invalid ZIP code', () => {
    const result = validateCreditApplication({
      ...validApplication,
      address: { ...validApplication.address, zipCode: 'ABCDE' },
    });
    assert.ok(!result.valid);
  });

  it('should reject missing required fields', () => {
    const result = validateCreditApplication({});
    assert.ok(!result.valid);
    assert.ok(result.errors.length >= 5, 'Should report multiple missing fields');
  });

  it('should sanitize HTML/script injection from strings', () => {
    const dirty = { name: '<script>alert("xss")</script>John', role: 'driver' };
    const clean = sanitizeObject(dirty);
    assert.ok(!clean.name.includes('<script>'));
    assert.ok(!clean.name.includes('</script>'));
    assert.ok(clean.name.includes('John'));
  });

  it('should sanitize nested objects', () => {
    const dirty = { user: { name: '<img onerror=alert(1)>Bob', age: 30 } };
    const clean = sanitizeObject(dirty);
    assert.ok(!clean.user.name.includes('<img'));
    assert.equal(clean.user.age, 30);
  });
});

// ─── Audit Log Tests ────────────────────────────────────────────

describe('Audit Logger', () => {
  it('should log events with timestamps and IDs', () => {
    const logger = new AuditLogger();
    const entry = logger.log({ action: 'APPLICATION_SUBMITTED', applicationId: 'APP-001' });
    assert.ok(entry.id);
    assert.ok(entry.timestamp);
    assert.equal(entry.action, 'APPLICATION_SUBMITTED');
  });

  it('should maintain chain integrity (tamper detection)', () => {
    const logger = new AuditLogger();
    logger.log({ action: 'APPLICATION_SUBMITTED', applicationId: 'APP-001' });
    logger.log({ action: 'APPLICATION_ACCESSED', applicationId: 'APP-001', accessedBy: 'admin' });
    logger.log({ action: 'APPLICATION_STATUS_CHANGED', applicationId: 'APP-001' });

    const integrity = logger.verifyIntegrity();
    assert.ok(integrity.valid, 'Untampered log should be valid');
    assert.equal(integrity.totalEntries, 3);
  });

  it('should detect tampering in the chain', () => {
    const logger = new AuditLogger();
    logger.log({ action: 'EVENT_1' });
    logger.log({ action: 'EVENT_2' });
    logger.log({ action: 'EVENT_3' });

    // Tamper with middle entry
    logger.logs[1].action = 'TAMPERED';

    const integrity = logger.verifyIntegrity();
    assert.ok(!integrity.valid, 'Tampered log should be detected');
    assert.ok(integrity.issues.length > 0);
  });

  it('should query logs by action and accessor', () => {
    const logger = new AuditLogger();
    logger.log({ action: 'APPLICATION_SUBMITTED', accessedBy: 'user1' });
    logger.log({ action: 'APPLICATION_ACCESSED', accessedBy: 'admin' });
    logger.log({ action: 'APPLICATION_SUBMITTED', accessedBy: 'user2' });

    const results = logger.query({ action: 'APPLICATION_SUBMITTED' });
    assert.equal(results.length, 2);

    const adminResults = logger.query({ accessedBy: 'admin' });
    assert.equal(adminResults.length, 1);
  });

  it('should export logs as CSV', () => {
    const logger = new AuditLogger();
    logger.log({ action: 'TEST_EVENT', applicationId: 'APP-001' });
    const csv = logger.export({ format: 'csv' });
    assert.ok(csv.includes('id,timestamp,action'));
    assert.ok(csv.includes('TEST_EVENT'));
  });

  it('should provide a summary with integrity status', () => {
    const logger = new AuditLogger();
    logger.log({ action: 'APPLICATION_SUBMITTED' });
    logger.log({ action: 'APPLICATION_SUBMITTED' });
    logger.log({ action: 'APPLICATION_ACCESSED' });

    const summary = logger.getSummary();
    assert.equal(summary.totalEvents, 3);
    assert.equal(summary.byAction['APPLICATION_SUBMITTED'], 2);
    assert.equal(summary.chainIntegrity, 'INTACT');
  });
});

// ─── Data Retention Tests ────────────────────────────────────────

describe('Data Retention Manager', () => {
  it('should have default policies for all credit application types', () => {
    const manager = new DataRetentionManager();
    assert.ok(manager.getPolicy('credit_application_approved'));
    assert.ok(manager.getPolicy('credit_application_denied'));
    assert.ok(manager.getPolicy('ssn_token'));
    assert.ok(manager.getPolicy('audit_log'));
  });

  it('should not auto-purge audit logs', () => {
    const manager = new DataRetentionManager();
    const policy = manager.getPolicy('audit_log');
    assert.equal(policy.autoPurge, false);
  });

  it('should identify records due for purging', () => {
    const manager = new DataRetentionManager();
    // Set a short policy for testing
    manager.setPolicy('test_data', { retentionDays: 0, autoPurge: true, reason: 'test' });
    manager.schedulePurge('test_data', 'REC-001', '2020-01-01');

    const due = manager.getRecordsDueForPurge();
    assert.ok(due.length > 0);
    assert.equal(due[0].recordId, 'REC-001');
  });

  it('should handle GDPR deletion requests', () => {
    const manager = new DataRetentionManager();
    manager.schedulePurge('credit_application_approved', 'APP-001', new Date().toISOString());

    const result = manager.handleDeletionRequest('APP-001', 'user@example.com');
    assert.equal(result.action, 'deletion_requested');
    assert.ok(result.deadline);
  });

  it('should generate a compliance report', () => {
    const manager = new DataRetentionManager();
    const report = manager.getComplianceReport();
    assert.ok(report.policies.length > 0);
    assert.ok(report.generatedAt);
  });
});

// ─── Compliance Check Tests ──────────────────────────────────────

describe('Compliance Check', () => {
  it('should return a compliance score and results', () => {
    const check = runComplianceCheck();
    assert.ok(check.summary);
    assert.ok(typeof check.complianceScore === 'number');
    assert.ok(check.complianceScore > 0);
    assert.ok(check.results.length > 0);
  });

  it('should list all regulation areas checked', () => {
    const check = runComplianceCheck();
    const regulations = [...new Set(check.results.map(r => r.regulation))];
    assert.ok(regulations.length >= 5, 'Should check at least 5 regulations');
  });
});

// ─── Credit Application Handler (Integration) ───────────────────

describe('Credit Application Handler', () => {
  const handler = new CreditApplicationHandler(TEST_MASTER_KEY);

  const validApp = {
    firstName: 'Jane',
    lastName: 'Smith',
    ssn: '234-56-7890',
    dateOfBirth: '1985-03-20',
    email: 'jane@example.com',
    phone: '512-555-0199',
    address: { street: '456 Oak Ave', city: 'Dallas', state: 'TX', zipCode: '75201' },
    annualIncome: 85000,
    monthlyHousingPayment: 1800,
    employmentStatus: 'employed',
    driversLicenseNumber: 'DL98765432',
    applicationType: 'auto_loan',
  };

  it('should submit a valid application and return masked SSN', async () => {
    const result = await handler.submitApplication(validApp, '127.0.0.1', 'test-agent');
    assert.ok(result.success);
    assert.ok(result.applicationId);
    assert.equal(result.maskedSSN, '***-**-7890');
  });

  it('should reject an invalid application', async () => {
    const result = await handler.submitApplication({ firstName: 'Bad' }, '127.0.0.1', 'test');
    assert.ok(!result.success);
    assert.ok(result.errors.length > 0);
  });

  it('should return masked data by default when retrieving', async () => {
    const submitResult = await handler.submitApplication(
      { ...validApp, ssn: '345-67-8901', email: 'masked@test.com' },
      '127.0.0.1', 'test'
    );
    const app = handler.getApplication(submitResult.applicationId);
    assert.ok(app);
    assert.ok(app.ssn.includes('***'), 'SSN should be masked');
  });

  it('should require identity and reason for full access', async () => {
    const submitResult = await handler.submitApplication(
      { ...validApp, ssn: '456-78-9012', email: 'full@test.com' },
      '127.0.0.1', 'test'
    );
    assert.throws(() =>
      handler.getApplication(submitResult.applicationId, { accessLevel: 'full' })
    );
  });

  it('should update application status with audit trail', async () => {
    const submitResult = await handler.submitApplication(
      { ...validApp, ssn: '567-89-0123', email: 'status@test.com' },
      '127.0.0.1', 'test'
    );
    const update = handler.updateStatus(submitResult.applicationId, 'approved', 'admin', 'Good credit');
    assert.equal(update.oldStatus, 'submitted');
    assert.equal(update.newStatus, 'approved');
  });

  it('should delete an application and destroy tokens (GDPR)', async () => {
    const submitResult = await handler.submitApplication(
      { ...validApp, ssn: '678-90-1234', email: 'delete@test.com' },
      '127.0.0.1', 'test'
    );
    const result = handler.deleteApplication(submitResult.applicationId, 'user', 'GDPR request');
    assert.ok(result.deleted);
    assert.ok(result.tokensDestroyed > 0);

    // Verify it's gone
    const app = handler.getApplication(submitResult.applicationId);
    assert.equal(app, null);
  });

  it('should list applications with pagination (masked)', async () => {
    const list = handler.listApplications({ page: 1, limit: 10 });
    assert.ok(list.applications);
    assert.ok(list.pagination);
    // All SSNs should be masked
    for (const app of list.applications) {
      if (app.ssn) {
        assert.ok(app.ssn.includes('***'), `SSN should be masked: ${app.ssn}`);
      }
    }
  });

  it('should create audit trail for all operations', () => {
    const summary = handler.auditLog.getSummary();
    assert.ok(summary.totalEvents > 0);
    assert.equal(summary.chainIntegrity, 'INTACT');
  });
});
