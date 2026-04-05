/**
 * Carbuyinghub.com Project Configuration & Blueprint
 * =====================================================
 * Central configuration for the Carbuyinghub.com app and website.
 */
export const carbuyinghubConfig = {
  project: {
    name: 'Carbuyinghub.com',
    tagline: 'Your Trusted Car Buying Destination',
    description: 'A dynamic app and website for car buyers — search inventory, apply for credit, compare deals, get vehicle history, and connect with trusted dealers. The complete car buying experience.',
    domain: 'carbuyinghub.com',
    version: '0.1.0',
    stage: 'planning',
  },

  domain: {
    primary: 'carbuyinghub.com',
    www: 'www.carbuyinghub.com',
    app: 'app.carbuyinghub.com',
    api: 'api.carbuyinghub.com',
    admin: 'admin.carbuyinghub.com',
    cdn: 'cdn.carbuyinghub.com',
    dns: {
      provider: 'Cloudflare (recommended — free SSL, CDN, DDoS protection)',
      records: [
        { type: 'A', name: '@', value: 'Vercel IP (set after deployment)', proxy: true },
        { type: 'CNAME', name: 'www', value: 'carbuyinghub.com', proxy: true },
        { type: 'CNAME', name: 'app', value: 'carbuyinghub.com', proxy: true },
        { type: 'CNAME', name: 'api', value: 'api-server.railway.app', proxy: true },
        { type: 'TXT', name: '@', value: 'v=spf1 include:_spf.google.com ~all', note: 'Email SPF' },
        { type: 'TXT', name: '@', value: 'Vercel domain verification TXT (provided by Vercel)', note: 'Domain verification' },
        { type: 'MX', name: '@', value: 'Google Workspace or Resend MX records', note: 'Email routing' },
      ],
    },
    ssl: {
      provider: 'Cloudflare (auto SSL) + Vercel (auto SSL)',
      mode: 'Full (Strict)',
      hsts: true,
    },
    emails: {
      noreply: 'noreply@carbuyinghub.com',
      support: 'support@carbuyinghub.com',
      legal: 'legal@carbuyinghub.com',
      privacy: 'privacy@carbuyinghub.com',
      applications: 'applications@carbuyinghub.com',
    },
  },

  targetAudience: {
    primary: [
      'First-time car buyers looking for guidance and financing',
      'Credit-challenged buyers needing flexible financing options',
      'Used car shoppers comparing deals across multiple dealers',
    ],
    secondary: [
      'Car dealers listing inventory and receiving credit applications',
      'Auto lenders offering financing products',
      'Trade-in sellers looking for best value',
      'Car enthusiasts researching vehicles',
    ],
  },

  coreFeatures: {
    mvp: [
      'Vehicle search & inventory browsing',
      'Online credit application (secured with tokenization & encryption)',
      'Dealer listings with ratings & reviews',
      'Vehicle history report integration',
      'User accounts with saved searches & favorites',
      'Mobile-responsive website',
      'Push notifications for price drops & application status',
    ],
    v2: [
      'AI-powered vehicle recommendations based on budget & preferences',
      'Trade-in value estimator',
      'Payment calculator with real-time rate estimates',
      'Dealer chat / messaging system',
      'Price comparison across dealers',
      'Vehicle inspection scheduling',
      'Insurance quote comparison',
    ],
    v3: [
      'AI negotiation assistant',
      'Augmented reality vehicle previews',
      'Full dealer management system (DMS integration)',
      'Auction access for wholesale buyers',
      'Fleet purchasing portal',
      'Extended warranty marketplace',
      'Post-purchase vehicle maintenance tracking',
    ],
  },

  techStack: {
    frontend: {
      web: 'Next.js 14+ (React, App Router, Server Components)',
      mobile: 'React Native with Expo',
      styling: 'Tailwind CSS + Radix UI primitives',
      stateManagement: 'Zustand (client) + React Query (server)',
      maps: 'Mapbox GL JS (dealer locations, delivery radius)',
      charts: 'Recharts (pricing trends, market analytics)',
    },
    backend: {
      runtime: 'Node.js 20+',
      framework: 'Fastify',
      database: 'PostgreSQL 16 with PostGIS (dealer proximity search)',
      orm: 'Prisma',
      cache: 'Redis (Upstash for serverless)',
      queue: 'BullMQ (credit application processing, notifications)',
      realtime: 'Socket.IO (dealer chat, application status updates)',
      search: 'Typesense or Meilisearch (vehicle inventory search)',
    },
    infrastructure: {
      hosting: 'Vercel (frontend) + Railway (backend)',
      cdn: 'Cloudflare',
      storage: 'Cloudflare R2 (vehicle photos, documents)',
      email: 'Resend (transactional) + SendGrid (marketing)',
      sms: 'Twilio (application status, verification)',
      payments: 'Stripe (dealer subscriptions, premium features)',
      monitoring: 'Sentry + Better Uptime',
      analytics: 'PostHog',
      cicd: 'GitHub Actions',
    },
  },

  businessModel: {
    type: 'Marketplace + SaaS',
    buyerFeatures: {
      free: [
        'Vehicle search & browsing',
        'Credit application submission',
        'Dealer reviews & ratings',
        'Saved searches & favorites',
        'Price drop alerts',
      ],
      premium: {
        price: '$4.99/month or $29.99/year',
        features: [
          'Unlimited vehicle history reports',
          'AI deal scoring (is this a good deal?)',
          'Priority credit application processing',
          'Price negotiation insights',
          'Extended search filters',
        ],
      },
    },
    dealerFeatures: {
      basic: {
        price: '$99/month',
        features: [
          'Up to 25 vehicle listings',
          'Receive credit applications',
          'Basic dealer profile',
          'Monthly analytics report',
        ],
      },
      professional: {
        price: '$299/month',
        features: [
          'Up to 100 vehicle listings',
          'Featured placement in search results',
          'In-app messaging with buyers',
          'Lead management dashboard',
          'Weekly analytics reports',
          'Inventory management tools',
        ],
      },
      enterprise: {
        price: '$799/month',
        features: [
          'Unlimited vehicle listings',
          'Premium search placement',
          'DMS integration',
          'API access',
          'Dedicated account manager',
          'Custom branding',
          'Multi-location support',
        ],
      },
    },
    revenueStreams: [
      'Dealer subscription fees (primary)',
      'Buyer premium subscriptions',
      'Credit application referral fees from lenders',
      'Featured listing fees',
      'Vehicle history report partnerships',
      'Insurance referral commissions',
      'Extended warranty commissions',
      'Aggregated market data & analytics (NEVER individual buyer data)',
    ],
  },

  budgetRules: {
    rule: 'NO spending without explicit owner approval',
    approvalProcess: 'All budget requests routed through Coordinator Agent to owner',
    categories: [
      'Infrastructure & hosting',
      'Domain & SSL',
      'Third-party API services (VIN lookup, credit bureaus)',
      'Design assets & tools',
      'Legal review (credit application compliance)',
      'Marketing & advertising',
      'Development tools',
      'Vehicle data providers',
    ],
  },
};
