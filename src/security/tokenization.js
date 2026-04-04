/**
 * Tokenization System
 * ====================
 * Replaces sensitive data (SSN, account numbers) with non-sensitive tokens.
 * The actual data is stored encrypted in a separate, heavily-restricted vault.
 *
 * Why tokenization over just encryption?
 * - Tokens are meaningless if stolen — no key can reverse them
 * - Reduces PCI DSS scope — systems using tokens don't handle real data
 * - The vault is a single, hardened point to protect
 * - Tokens can be format-preserving (same length/pattern as original)
 */

import { randomBytes, createHash } from 'crypto';
import { encryptField, decryptField } from './encryption.js';

export class TokenVault {
  constructor(masterKey) {
    if (!masterKey || masterKey.length < 32) {
      throw new Error('Master key must be at least 32 characters');
    }
    this.masterKey = masterKey;
    this.tokenStore = new Map();   // token → encrypted value
    this.reverseIndex = new Map(); // blind index → token (for dedup)
  }

  /**
   * Tokenize a sensitive value.
   * Returns a token that can safely be stored in the main database.
   * The real value is encrypted and stored only in the vault.
   */
  tokenize(sensitiveValue, dataType = 'generic') {
    if (!sensitiveValue) throw new Error('Value is required for tokenization');

    // Create a blind index to detect duplicates (same SSN = same token)
    const blindIndex = this._createBlindIndex(sensitiveValue, dataType);

    // Return existing token if this value was already tokenized
    if (this.reverseIndex.has(blindIndex)) {
      return this.reverseIndex.get(blindIndex);
    }

    // Generate a format-preserving token
    const token = this._generateToken(dataType);

    // Encrypt the real value and store in vault
    const encryptedValue = encryptField(sensitiveValue, this.masterKey);
    this.tokenStore.set(token, {
      encrypted: encryptedValue,
      dataType,
      tokenizedAt: new Date().toISOString(),
      accessCount: 0,
      lastAccessedAt: null,
    });

    this.reverseIndex.set(blindIndex, token);
    return token;
  }

  /**
   * Detokenize — retrieve the original value.
   * REQUIRES authorization. Every access is logged.
   */
  detokenize(token, accessReason, accessedBy) {
    if (!accessReason || !accessedBy) {
      throw new Error('Access reason and accessor identity are required for detokenization');
    }

    const entry = this.tokenStore.get(token);
    if (!entry) {
      throw new Error('Token not found in vault');
    }

    // Log the access
    entry.accessCount++;
    entry.lastAccessedAt = new Date().toISOString();
    entry.lastAccessedBy = accessedBy;
    entry.lastAccessReason = accessReason;

    // Decrypt and return
    return decryptField(entry.encrypted, this.masterKey);
  }

  /**
   * Get masked version of tokenized data (e.g., ***-**-1234).
   * Does NOT require full detokenization privileges.
   */
  getMasked(token, dataType) {
    const entry = this.tokenStore.get(token);
    if (!entry) return null;

    const value = decryptField(entry.encrypted, this.masterKey);

    switch (dataType || entry.dataType) {
      case 'ssn':
        return `***-**-${value.slice(-4)}`;
      case 'credit_card':
        return `****-****-****-${value.slice(-4)}`;
      case 'bank_account':
        return `****${value.slice(-4)}`;
      case 'phone':
        return `(***) ***-${value.slice(-4)}`;
      case 'email': {
        const [local, domain] = value.split('@');
        return `${local[0]}${'*'.repeat(Math.max(local.length - 2, 1))}${local.slice(-1)}@${domain}`;
      }
      case 'dob':
        return `**/**/****`;
      case 'drivers_license':
        return `****${value.slice(-4)}`;
      default:
        return `${'*'.repeat(Math.max(value.length - 4, 0))}${value.slice(-4)}`;
    }
  }

  /**
   * Permanently destroy a token and its associated data.
   * Used for GDPR right-to-erasure / CCPA deletion requests.
   */
  destroy(token) {
    const entry = this.tokenStore.get(token);
    if (!entry) return false;

    this.tokenStore.delete(token);
    // Remove from reverse index
    for (const [key, val] of this.reverseIndex) {
      if (val === token) {
        this.reverseIndex.delete(key);
        break;
      }
    }
    return true;
  }

  /**
   * Destroy all tokens for a user (full account deletion).
   */
  destroyAll(tokens) {
    let destroyed = 0;
    for (const token of tokens) {
      if (this.destroy(token)) destroyed++;
    }
    return { destroyed, total: tokens.length };
  }

  /** Get vault statistics (no sensitive data exposed) */
  getStats() {
    return {
      totalTokens: this.tokenStore.size,
      byType: this._countByType(),
    };
  }

  // --- Internal methods ---

  _generateToken(dataType) {
    const prefix = {
      ssn: 'TOK-SSN',
      credit_card: 'TOK-CC',
      bank_account: 'TOK-BA',
      drivers_license: 'TOK-DL',
      dob: 'TOK-DOB',
      phone: 'TOK-PH',
      email: 'TOK-EM',
      generic: 'TOK-GEN',
    }[dataType] || 'TOK-GEN';

    return `${prefix}-${randomBytes(16).toString('hex')}`;
  }

  _createBlindIndex(value, dataType) {
    return createHash('sha256')
      .update(`${dataType}:${value}:${this.masterKey}`)
      .digest('hex');
  }

  _countByType() {
    const counts = {};
    for (const entry of this.tokenStore.values()) {
      counts[entry.dataType] = (counts[entry.dataType] || 0) + 1;
    }
    return counts;
  }
}
