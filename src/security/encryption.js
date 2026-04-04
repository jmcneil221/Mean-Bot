/**
 * Field-Level Encryption Module
 * ==============================
 * Encrypts sensitive PII fields individually so that even if the database
 * is compromised, SSNs and personal data remain protected.
 *
 * Uses AES-256-GCM (authenticated encryption) — the gold standard.
 * Each field gets its own IV (initialization vector) for uniqueness.
 * Authentication tags prevent tampering.
 *
 * IMPORTANT: In production, encryption keys MUST come from a Key Management
 * Service (AWS KMS, Google Cloud KMS, HashiCorp Vault) — NEVER hardcoded.
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;       // 128-bit IV for GCM
const TAG_LENGTH = 16;      // 128-bit auth tag
const SALT_LENGTH = 32;     // Salt for key derivation
const KEY_LENGTH = 32;      // 256-bit key

/**
 * Derive an encryption key from a master secret + salt.
 * Uses scrypt (memory-hard) to resist brute force.
 */
function deriveKey(masterKey, salt) {
  return scryptSync(masterKey, salt, KEY_LENGTH, { N: 16384, r: 8, p: 1 });
}

/**
 * Encrypt a single field value.
 * Returns a self-contained encrypted payload (salt:iv:tag:ciphertext) in base64.
 */
export function encryptField(plaintext, masterKey) {
  if (!plaintext || !masterKey) {
    throw new Error('Both plaintext and masterKey are required');
  }

  const salt = randomBytes(SALT_LENGTH);
  const key = deriveKey(masterKey, salt);
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(String(plaintext), 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  // Pack: salt + iv + tag + ciphertext → base64
  const payload = Buffer.concat([salt, iv, tag, encrypted]);
  return payload.toString('base64');
}

/**
 * Decrypt a field value from its encrypted payload.
 */
export function decryptField(encryptedPayload, masterKey) {
  if (!encryptedPayload || !masterKey) {
    throw new Error('Both encryptedPayload and masterKey are required');
  }

  const payload = Buffer.from(encryptedPayload, 'base64');

  // Unpack: salt + iv + tag + ciphertext
  const salt = payload.subarray(0, SALT_LENGTH);
  const iv = payload.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = payload.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const ciphertext = payload.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

  const key = deriveKey(masterKey, salt);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}

/**
 * Encrypt multiple fields on an object.
 * Only encrypts the specified sensitive fields, leaves the rest untouched.
 */
export function encryptFields(data, sensitiveFieldNames, masterKey) {
  const result = { ...data };
  for (const field of sensitiveFieldNames) {
    if (result[field] !== undefined && result[field] !== null) {
      result[field] = encryptField(String(result[field]), masterKey);
    }
  }
  return result;
}

/**
 * Decrypt multiple fields on an object.
 */
export function decryptFields(data, sensitiveFieldNames, masterKey) {
  const result = { ...data };
  for (const field of sensitiveFieldNames) {
    if (result[field] !== undefined && result[field] !== null) {
      result[field] = decryptField(result[field], masterKey);
    }
  }
  return result;
}

/**
 * Generate a cryptographically secure master key.
 * Store this in a KMS — NEVER in code or config files.
 */
export function generateMasterKey() {
  return randomBytes(KEY_LENGTH).toString('hex');
}

/**
 * Hash a value for searching without decrypting.
 * Use this to create a searchable blind index (e.g., last 4 of SSN).
 */
export function createBlindIndex(value, salt, masterKey) {
  const key = deriveKey(masterKey, Buffer.from(salt, 'hex'));
  const cipher = createCipheriv('aes-256-gcm', key, Buffer.alloc(IV_LENGTH, 0));
  const hash = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  return hash.toString('hex');
}
