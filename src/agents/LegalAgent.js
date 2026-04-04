import { Agent } from '../core/Agent.js';

/**
 * LegalAgent — Expert in legal documents, user agreements, and regulatory compliance.
 *
 * Handles: Terms of Service, Privacy Policy, user agreements, regulatory compliance,
 * data processing agreements, cookie policies, DMCA, liability.
 */
export class LegalAgent extends Agent {
  constructor() {
    super({
      name: 'Legal Advisor',
      role: 'Legal & Compliance Expert',
      expertise: [
        'terms of service drafting',
        'privacy policy (GDPR/CCPA)',
        'user agreements',
        'data processing agreements',
        'gig worker regulations',
        'transportation regulations',
        'intellectual property',
        'liability & indemnification',
        'cookie policy & consent',
        'dispute resolution',
      ],
      capabilities: [
        'draft_terms_of_service',
        'draft_privacy_policy',
        'draft_user_agreement',
        'compliance_audit',
        'regulatory_analysis',
        'draft_cookie_policy',
      ],
    });
  }

  async executeTask(task) {
    const handlers = {
      draft_tos: () => this.draftTermsOfService(task),
      draft_privacy: () => this.draftPrivacyPolicy(task),
      regulatory_analysis: () => this.regulatoryAnalysis(task),
      default: () => this.generalLegalTask(task),
    };
    const handler = handlers[task.type] || handlers.default;
    return handler();
  }

  draftTermsOfService(task) {
    return {
      agent: this.name,
      task: task.title,
      document: {
        title: 'Drivera Terms of Service',
        sections: [
          {
            heading: '1. Acceptance of Terms',
            summary: 'By accessing or using Drivera, users agree to be bound by these terms. Must be 18+ to use the service.',
          },
          {
            heading: '2. Description of Service',
            summary: 'Drivera is a driver tools platform. We are NOT a transportation company. We provide tools for drivers to manage earnings, routes, vehicles, and connect with other drivers.',
          },
          {
            heading: '3. User Accounts',
            summary: 'Users must provide accurate information. One account per person. Users responsible for account security. We may verify identity for certain features.',
          },
          {
            heading: '4. Driver-Specific Terms',
            summary: 'Drivera does not employ drivers. Users maintain independent contractor status with their platforms. We do not control driving activities.',
          },
          {
            heading: '5. Data & Earnings Integration',
            summary: 'Users authorize Drivera to access earnings data from connected platforms. Data used only for user\'s benefit. We never sell individual driver data.',
          },
          {
            heading: '6. Subscription & Payments',
            summary: 'Free tier available. Premium features require subscription. Auto-renewal with 30-day cancellation. Refund policy for unused premium time.',
          },
          {
            heading: '7. Acceptable Use',
            summary: 'No illegal activities, no platform manipulation, no sharing accounts, no scraping, no harassment in community features.',
          },
          {
            heading: '8. Intellectual Property',
            summary: 'Drivera owns the platform. Users own their data. User-generated content grants us display license. No reverse engineering.',
          },
          {
            heading: '9. Limitation of Liability',
            summary: 'Drivera provides tools "as-is". Not liable for driving decisions, earnings outcomes, or third-party platform changes. Maximum liability limited to subscription fees paid.',
          },
          {
            heading: '10. Dispute Resolution',
            summary: 'Mandatory arbitration with opt-out window (30 days after sign-up). Small claims court option preserved. Class action waiver.',
          },
          {
            heading: '11. Termination',
            summary: 'Users may delete account anytime. We may terminate for violations. Data export available for 30 days after termination.',
          },
          {
            heading: '12. Changes to Terms',
            summary: '30-day notice for material changes. Continued use after notice constitutes acceptance. Email notification for significant updates.',
          },
        ],
      },
      warnings: [
        'DISCLAIMER: This is an AI-generated outline. Have a licensed attorney review before publication.',
        'Gig worker classification laws vary by state — legal review critical',
        'Arbitration clauses face increasing legal scrutiny — consider alternatives',
      ],
      estimatedLegalReviewCost: {
        amount: 2500,
        vendor: 'Licensed attorney / legal service',
        needsApproval: true,
        note: 'REQUIRED: AI-generated legal documents must be reviewed by a licensed attorney',
      },
    };
  }

  draftPrivacyPolicy(task) {
    return {
      agent: this.name,
      task: task.title,
      document: {
        title: 'Drivera Privacy Policy',
        sections: [
          {
            heading: 'Data We Collect',
            items: [
              'Account info (name, email, phone)',
              'Identity documents (driver license — encrypted, used for verification only)',
              'Location data (only when app is active, user-controlled)',
              'Earnings data from connected platforms (user-authorized)',
              'Vehicle information',
              'Usage analytics (anonymized)',
              'Device information',
            ],
          },
          {
            heading: 'How We Use Data',
            items: [
              'Provide and improve our services',
              'Earnings tracking and optimization',
              'Route suggestions',
              'Tax reporting assistance',
              'Community features',
              'Service communications',
            ],
          },
          {
            heading: 'Data We NEVER Sell',
            items: [
              'Individual driver location data',
              'Personal earnings information',
              'Identity documents',
              'Any personally identifiable information',
            ],
          },
          {
            heading: 'User Rights',
            items: [
              'Access your data (data export)',
              'Delete your data (account deletion)',
              'Opt out of data collection (with service limitations)',
              'Correct inaccurate data',
              'Data portability (download everything)',
              'Withdraw consent at any time',
            ],
          },
          {
            heading: 'GDPR Compliance',
            items: ['Legal basis for processing', 'Data Protection Officer contact', 'EU representative', 'Cross-border transfer safeguards'],
          },
          {
            heading: 'CCPA Compliance',
            items: ['Categories of personal info collected', 'Right to know', 'Right to delete', 'Right to opt-out of sale', 'Non-discrimination'],
          },
        ],
      },
      recommendations: [
        'Implement cookie consent banner (GDPR requires opt-in)',
        'Create a dedicated privacy center in the app',
        'Appoint a Data Protection Officer before EU launch',
        'Annual privacy impact assessment',
        'REQUIRED: Licensed attorney review before publication',
      ],
    };
  }

  regulatoryAnalysis(task) {
    return {
      agent: this.name,
      task: task.title,
      regulations: {
        federal: [
          'FTC Act — no deceptive practices in data collection or earnings claims',
          'COPPA — ensure no users under 13 (age gate required)',
          'CAN-SPAM — marketing email compliance',
          'DMCA — user-generated content takedown process',
        ],
        state: [
          'California AB5 / Prop 22 — gig worker classification impacts',
          'CCPA/CPRA — California privacy requirements',
          'State-specific data breach notification laws (all 50 states)',
          'Biometric data laws (Illinois BIPA if using facial verification)',
        ],
        international: [
          'GDPR (EU) — strict consent and data handling',
          'PIPEDA (Canada) — privacy compliance',
          'Data localization requirements vary by country',
        ],
        transportation: [
          'FMCSA regulations (if serving commercial truck drivers)',
          'DOT hours of service tracking requirements',
          'State transportation authority requirements vary',
        ],
      },
      recommendations: [
        'Start US-only, expand internationally after compliance review',
        'Build privacy-by-design into the architecture from day 1',
        'Budget for ongoing legal counsel — regulations change frequently',
      ],
    };
  }

  generalLegalTask(task) {
    return {
      agent: this.name,
      task: task.title,
      output: `Legal analysis complete for: ${task.title}`,
      recommendations: [
        'All legal documents should be reviewed by a licensed attorney before publication',
        'Maintain a compliance calendar for regulatory deadlines',
      ],
    };
  }
}
