/**
 * Input Validation & Sanitization for Credit Applications
 * =========================================================
 * Validates and sanitizes ALL user input before it touches any other system.
 * This is the first line of defense against injection attacks and bad data.
 *
 * Rules:
 * - Every field is validated for type, format, and length
 * - SSNs must match exact format (9 digits)
 * - No HTML/script injection allowed in any field
 * - All strings are trimmed and normalized
 */

/** Strip any HTML tags and dangerous characters */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .trim()
    .replace(/<[^>]*>/g, '')          // Remove HTML tags
    .replace(/[<>'"`;(){}]/g, '')     // Remove dangerous chars
    .replace(/\s+/g, ' ');            // Normalize whitespace
}

/** Validate SSN format: 9 digits, not all zeros, not known invalid patterns */
function validateSSN(ssn) {
  if (!ssn) return { valid: false, error: 'SSN is required' };

  // Strip formatting (dashes, spaces)
  const cleaned = ssn.replace(/[\s-]/g, '');

  if (!/^\d{9}$/.test(cleaned)) {
    return { valid: false, error: 'SSN must be exactly 9 digits' };
  }

  // Known invalid SSN patterns
  const area = parseInt(cleaned.substring(0, 3));
  const group = parseInt(cleaned.substring(3, 5));
  const serial = parseInt(cleaned.substring(5, 9));

  if (area === 0 || group === 0 || serial === 0) {
    return { valid: false, error: 'Invalid SSN format' };
  }
  if (area === 666 || area >= 900) {
    return { valid: false, error: 'Invalid SSN area number' };
  }
  if (cleaned === '123456789' || /^(\d)\1{8}$/.test(cleaned)) {
    return { valid: false, error: 'SSN appears to be a test/invalid number' };
  }

  return { valid: true, cleaned };
}

/** Validate email format */
function validateEmail(email) {
  if (!email) return { valid: false, error: 'Email is required' };
  const cleaned = sanitizeString(email).toLowerCase();
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!emailRegex.test(cleaned)) {
    return { valid: false, error: 'Invalid email format' };
  }
  if (cleaned.length > 254) {
    return { valid: false, error: 'Email too long' };
  }
  return { valid: true, cleaned };
}

/** Validate phone number */
function validatePhone(phone) {
  if (!phone) return { valid: false, error: 'Phone number is required' };
  const cleaned = phone.replace(/[\s\-().+]/g, '');
  if (!/^\d{10,11}$/.test(cleaned)) {
    return { valid: false, error: 'Phone must be 10-11 digits' };
  }
  return { valid: true, cleaned };
}

/** Validate date of birth (must be 18+) */
function validateDOB(dob) {
  if (!dob) return { valid: false, error: 'Date of birth is required' };
  const date = new Date(dob);
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  const age = Math.floor((Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  if (age < 18) {
    return { valid: false, error: 'Applicant must be at least 18 years old' };
  }
  if (age > 120) {
    return { valid: false, error: 'Invalid date of birth' };
  }
  return { valid: true, cleaned: date.toISOString().split('T')[0] };
}

/** Validate currency amounts */
function validateCurrency(value, fieldName, { min = 0, max = 99999999 } = {}) {
  if (value === undefined || value === null || value === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  const num = parseFloat(String(value).replace(/[$,]/g, ''));
  if (isNaN(num)) {
    return { valid: false, error: `${fieldName} must be a valid number` };
  }
  if (num < min || num > max) {
    return { valid: false, error: `${fieldName} must be between $${min} and $${max.toLocaleString()}` };
  }
  return { valid: true, cleaned: num };
}

/** Validate a name field */
function validateName(name, fieldName) {
  if (!name) return { valid: false, error: `${fieldName} is required` };
  const cleaned = sanitizeString(name);
  if (cleaned.length < 1 || cleaned.length > 100) {
    return { valid: false, error: `${fieldName} must be 1-100 characters` };
  }
  if (!/^[a-zA-Z\s'-]+$/.test(cleaned)) {
    return { valid: false, error: `${fieldName} contains invalid characters` };
  }
  return { valid: true, cleaned };
}

/** Validate address fields */
function validateAddress(address) {
  const errors = [];
  if (!address) return { valid: false, errors: ['Address is required'] };

  if (!address.street || sanitizeString(address.street).length < 3) {
    errors.push('Street address is required (min 3 characters)');
  }
  if (!address.city || sanitizeString(address.city).length < 2) {
    errors.push('City is required');
  }
  if (!address.state || !/^[A-Z]{2}$/.test(String(address.state).toUpperCase())) {
    errors.push('State must be a 2-letter code (e.g., CA, TX)');
  }
  if (!address.zipCode || !/^\d{5}(-\d{4})?$/.test(String(address.zipCode))) {
    errors.push('ZIP code must be 5 digits (or 5+4 format)');
  }

  return errors.length > 0
    ? { valid: false, errors }
    : {
        valid: true,
        cleaned: {
          street: sanitizeString(address.street),
          city: sanitizeString(address.city),
          state: String(address.state).toUpperCase().substring(0, 2),
          zipCode: String(address.zipCode).trim(),
        },
      };
}

/** Validate drivers license number */
function validateDriversLicense(license) {
  if (!license) return { valid: false, error: 'Drivers license number is required' };
  const cleaned = sanitizeString(license).replace(/\s/g, '');
  if (cleaned.length < 4 || cleaned.length > 20) {
    return { valid: false, error: 'Invalid drivers license number length' };
  }
  if (!/^[A-Z0-9*-]+$/i.test(cleaned)) {
    return { valid: false, error: 'Drivers license contains invalid characters' };
  }
  return { valid: true, cleaned: cleaned.toUpperCase() };
}

/**
 * Validate a complete credit application.
 * Returns { valid: true } or { valid: false, errors: [...] }.
 */
export function validateCreditApplication(data) {
  const errors = [];

  // Required personal info
  const firstName = validateName(data.firstName, 'First name');
  if (!firstName.valid) errors.push(firstName.error);

  const lastName = validateName(data.lastName, 'Last name');
  if (!lastName.valid) errors.push(lastName.error);

  const ssn = validateSSN(data.ssn);
  if (!ssn.valid) errors.push(ssn.error);

  const dob = validateDOB(data.dateOfBirth);
  if (!dob.valid) errors.push(dob.error);

  const email = validateEmail(data.email);
  if (!email.valid) errors.push(email.error);

  const phone = validatePhone(data.phone);
  if (!phone.valid) errors.push(phone.error);

  // Address
  const address = validateAddress(data.address);
  if (!address.valid) errors.push(...address.errors);

  // Financial info
  const income = validateCurrency(data.annualIncome, 'Annual income', { min: 0, max: 99999999 });
  if (!income.valid) errors.push(income.error);

  const housing = validateCurrency(data.monthlyHousingPayment, 'Monthly housing payment', { min: 0, max: 999999 });
  if (!housing.valid) errors.push(housing.error);

  // Employment
  if (!data.employmentStatus || !['employed', 'self_employed', 'unemployed', 'retired', 'student', 'other'].includes(data.employmentStatus)) {
    errors.push('Employment status is required (employed, self_employed, unemployed, retired, student, other)');
  }

  // Drivers license
  const license = validateDriversLicense(data.driversLicenseNumber);
  if (!license.valid) errors.push(license.error);

  // Application type
  if (!data.applicationType || !['personal_loan', 'auto_loan', 'vehicle_financing', 'business_loan', 'credit_line'].includes(data.applicationType)) {
    errors.push('Application type is required (personal_loan, auto_loan, vehicle_financing, business_loan, credit_line)');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true };
}

/**
 * Sanitize an entire object — strips dangerous content from all string fields.
 */
export function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  const result = Array.isArray(obj) ? [] : {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
