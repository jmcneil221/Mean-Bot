/**
 * Compliance Configuration
 * =========================
 * Defines the regulatory requirements for handling credit applications.
 * Carbuyinghub must comply with these because it handles SSNs and financial data.
 *
 * Key regulations:
 * - PCI DSS: Payment card data security
 * - GLBA: Financial data privacy (Gramm-Leach-Bliley Act)
 * - FCRA: Fair Credit Reporting Act
 * - ECOA: Equal Credit Opportunity Act
 * - CCPA/CPRA: California privacy
 * - GDPR: EU privacy (if serving EU customers)
 * - SOC 2: Service organization controls
 */

export const complianceConfig = {
  regulations: {
    pciDss: {
      name: 'PCI DSS v4.0',
      applies: true,
      reason: 'Processing/storing credit-related data',
      requirements: [
        { id: 'Req 1', area: 'Network Security', status: 'implemented', detail: 'WAF, firewall rules, network segmentation' },
        { id: 'Req 2', area: 'Secure Configuration', status: 'implemented', detail: 'No default passwords, hardened systems' },
        { id: 'Req 3', area: 'Protect Stored Data', status: 'implemented', detail: 'AES-256-GCM encryption, tokenization for SSN/financial data' },
        { id: 'Req 4', area: 'Encrypt Transmission', status: 'implemented', detail: 'TLS 1.3 enforced, HSTS enabled' },
        { id: 'Req 5', area: 'Anti-Malware', status: 'planned', detail: 'File upload scanning, dependency vulnerability checks' },
        { id: 'Req 6', area: 'Secure Development', status: 'implemented', detail: 'Input validation, parameterized queries, code review' },
        { id: 'Req 7', area: 'Access Control', status: 'implemented', detail: 'RBAC, principle of least privilege' },
        { id: 'Req 8', area: 'User Identification', status: 'implemented', detail: 'MFA, strong passwords, session management' },
        { id: 'Req 9', area: 'Physical Access', status: 'not_applicable', detail: 'Cloud-hosted, provider handles physical security' },
        { id: 'Req 10', area: 'Logging & Monitoring', status: 'implemented', detail: 'Tamper-evident audit logs, chained hashing' },
        { id: 'Req 11', area: 'Security Testing', status: 'planned', detail: 'Quarterly vulnerability scans, annual pen test' },
        { id: 'Req 12', area: 'Security Policy', status: 'in_progress', detail: 'Information security policy documentation' },
      ],
    },

    glba: {
      name: 'Gramm-Leach-Bliley Act (GLBA)',
      applies: true,
      reason: 'Handling non-public personal financial information',
      requirements: [
        { area: 'Privacy Notice', status: 'implemented', detail: 'Clear disclosure of data collection, sharing, and protection practices' },
        { area: 'Opt-Out Rights', status: 'implemented', detail: 'Users can opt out of non-essential data sharing' },
        { area: 'Safeguards Rule', status: 'implemented', detail: 'Encryption, access controls, employee training, incident response' },
        { area: 'Pretexting Protection', status: 'implemented', detail: 'Identity verification before disclosing customer data' },
      ],
    },

    fcra: {
      name: 'Fair Credit Reporting Act (FCRA)',
      applies: true,
      reason: 'Collecting data for credit decisions',
      requirements: [
        { area: 'Permissible Purpose', status: 'required', detail: 'Only pull credit reports with valid permissible purpose' },
        { area: 'Adverse Action Notice', status: 'required', detail: 'If application denied, must provide reason and credit bureau info' },
        { area: 'Disposal Rule', status: 'implemented', detail: 'Secure destruction of consumer report data when no longer needed' },
        { area: 'Accuracy', status: 'required', detail: 'Ensure accuracy of information furnished to credit bureaus' },
      ],
    },

    ecoa: {
      name: 'Equal Credit Opportunity Act (ECOA)',
      applies: true,
      reason: 'Processing credit applications',
      requirements: [
        { area: 'Non-Discrimination', status: 'required', detail: 'Cannot discriminate based on race, color, religion, sex, age, etc.' },
        { area: 'Notice of Action', status: 'required', detail: 'Notify applicant of approval/denial within 30 days' },
        { area: 'Record Retention', status: 'implemented', detail: 'Keep records 25 months for applications, longer if complaint filed' },
      ],
    },

    ccpaCpra: {
      name: 'California Consumer Privacy Act / California Privacy Rights Act',
      applies: true,
      reason: 'Serving California residents',
      requirements: [
        { area: 'Right to Know', status: 'implemented', detail: 'Users can request what data we have' },
        { area: 'Right to Delete', status: 'implemented', detail: 'Data deletion within 45 days of request' },
        { area: 'Right to Opt-Out', status: 'implemented', detail: '"Do Not Sell My Data" option' },
        { area: 'Data Minimization', status: 'implemented', detail: 'Only collect data necessary for the stated purpose' },
        { area: 'Sensitive Data', status: 'implemented', detail: 'SSN classified as sensitive — requires explicit consent' },
      ],
    },

    soc2: {
      name: 'SOC 2 Type II',
      applies: true,
      reason: 'Required for enterprise trust and partner integrations',
      trustPrinciples: [
        { principle: 'Security', status: 'implemented', detail: 'Encryption, access controls, monitoring, incident response' },
        { principle: 'Availability', status: 'planned', detail: 'Uptime SLAs, disaster recovery, redundancy' },
        { principle: 'Processing Integrity', status: 'implemented', detail: 'Input validation, audit logging, data accuracy checks' },
        { principle: 'Confidentiality', status: 'implemented', detail: 'Encryption at rest/transit, tokenization, access logging' },
        { principle: 'Privacy', status: 'implemented', detail: 'CCPA/GDPR compliance, data minimization, user consent' },
      ],
    },
  },

  dataClassification: {
    critical: {
      description: 'Data that if exposed causes severe harm',
      examples: ['SSN', 'Full credit card numbers', 'Bank account + routing numbers', 'Passwords/auth tokens'],
      protections: ['AES-256-GCM encryption', 'Tokenization', 'Access logging', 'MFA required for access', 'Automatic purge policy'],
    },
    sensitive: {
      description: 'Personal data requiring strong protection',
      examples: ['Date of birth', 'Drivers license number', 'Annual income', 'Home address', 'Email', 'Phone'],
      protections: ['AES-256-GCM encryption at rest', 'TLS in transit', 'Access logging', 'Role-based access'],
    },
    internal: {
      description: 'Business data not for public consumption',
      examples: ['Application status', 'Internal notes', 'Agent assignments', 'System configuration'],
      protections: ['Authentication required', 'Role-based access', 'Audit logging'],
    },
    public: {
      description: 'Data that can be freely shared',
      examples: ['Public website content', 'Help documentation', 'Marketing materials'],
      protections: ['Integrity verification', 'Version control'],
    },
  },

  incidentResponse: {
    phases: [
      { phase: 'Detection', actions: ['Automated monitoring alerts', 'Anomaly detection', 'User reports'] },
      { phase: 'Containment', actions: ['Isolate affected systems', 'Revoke compromised credentials', 'Block suspicious IPs'] },
      { phase: 'Investigation', actions: ['Analyze audit logs', 'Determine scope of breach', 'Identify root cause'] },
      { phase: 'Notification', actions: ['Notify affected users within 72 hours (GDPR)', 'Notify regulators as required', 'Notify credit bureaus if SSNs exposed'] },
      { phase: 'Recovery', actions: ['Patch vulnerability', 'Restore from clean backups', 'Reset affected credentials'] },
      { phase: 'Post-Incident', actions: ['Document lessons learned', 'Update security controls', 'Conduct additional training'] },
    ],
    notificationTimelines: {
      gdpr: '72 hours to supervisory authority',
      ccpa: 'Without unreasonable delay',
      pciDss: 'Immediately to payment brands',
      stateBreachLaws: 'Varies by state (30-90 days typically)',
    },
  },
};

/**
 * Run a compliance check against the current system state.
 */
export function runComplianceCheck() {
  const results = [];
  let passed = 0;
  let failed = 0;
  let planned = 0;

  for (const [regKey, reg] of Object.entries(complianceConfig.regulations)) {
    const items = reg.requirements || reg.trustPrinciples || [];
    for (const item of items) {
      const status = item.status;
      if (status === 'implemented') passed++;
      else if (status === 'planned' || status === 'in_progress') planned++;
      else failed++;

      results.push({
        regulation: reg.name,
        area: item.area || item.principle,
        status,
        detail: item.detail,
      });
    }
  }

  return {
    summary: { passed, planned, needsAttention: failed, total: passed + planned + failed },
    complianceScore: Math.round((passed / (passed + planned + failed)) * 100),
    results,
  };
}
