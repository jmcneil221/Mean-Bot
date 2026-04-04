/**
 * Drivera Project Configuration & Blueprint
 * ===========================================
 * Central configuration for the Drivera app and website.
 */
export const driveraConfig = {
  project: {
    name: 'Drivera',
    tagline: 'The Driver\'s Copilot',
    description: 'A dynamic app and website for drivers — rideshare, delivery, trucking, and personal driving. Track earnings, optimize routes, manage vehicles, and connect with a driver community.',
    version: '0.1.0',
    stage: 'planning',
  },

  targetAudience: {
    primary: [
      'Rideshare drivers (Uber, Lyft)',
      'Delivery drivers (DoorDash, Instacart, Amazon Flex)',
      'Truck drivers (long-haul and local)',
    ],
    secondary: [
      'Fleet managers',
      'Part-time/weekend drivers',
      'Personal/commuter drivers',
    ],
  },

  coreFeatures: {
    mvp: [
      'Multi-platform earnings dashboard',
      'Earnings history and analytics',
      'Tax deduction tracking & mileage log',
      'Driver profile with verification',
      'Basic community feed',
      'Push notifications',
    ],
    v2: [
      'Cross-platform earnings optimization (which app to drive for NOW)',
      'Vehicle maintenance tracker',
      'Route optimization',
      'Insurance marketplace',
      'Driver community forums & groups',
      'In-app messaging',
    ],
    v3: [
      'AI earnings predictions',
      'Fleet management dashboard',
      'Driver mentorship matching',
      'EV charging station integration',
      'Voice assistant for hands-free',
      'Real-time traffic & demand heatmaps',
    ],
  },

  techStack: {
    frontend: {
      web: 'Next.js 14+ (React, App Router, Server Components)',
      mobile: 'React Native with Expo',
      styling: 'Tailwind CSS + Radix UI primitives',
      stateManagement: 'Zustand (client) + React Query (server)',
      maps: 'Mapbox GL JS',
      charts: 'Recharts',
    },
    backend: {
      runtime: 'Node.js 20+',
      framework: 'Fastify',
      database: 'PostgreSQL 16 with PostGIS',
      orm: 'Prisma',
      cache: 'Redis (Upstash for serverless)',
      queue: 'BullMQ',
      realtime: 'Socket.IO',
      search: 'Typesense or Meilisearch',
    },
    infrastructure: {
      hosting: 'Vercel (frontend) + Railway (backend)',
      cdn: 'Cloudflare',
      storage: 'Cloudflare R2',
      email: 'Resend',
      sms: 'Twilio',
      payments: 'Stripe',
      monitoring: 'Sentry + Better Uptime',
      analytics: 'PostHog',
      cicd: 'GitHub Actions',
    },
  },

  businessModel: {
    type: 'Freemium SaaS',
    freeTier: [
      'Basic earnings dashboard (manual entry)',
      'Mileage tracking',
      'Community read access',
      'Basic tax deduction tracking',
    ],
    premiumTier: {
      price: '$9.99/month or $79.99/year',
      features: [
        'Automatic platform sync (Uber, Lyft, DoorDash, etc.)',
        'Cross-platform earnings optimization',
        'Advanced analytics & predictions',
        'Full community access (post, message, groups)',
        'Vehicle maintenance reminders',
        'Priority support',
        'Tax report generation',
      ],
    },
    proTier: {
      price: '$24.99/month or $199.99/year',
      features: [
        'Everything in Premium',
        'Fleet management (up to 50 drivers)',
        'Custom reporting',
        'API access',
        'Dedicated account manager',
        'White-label options',
      ],
    },
    revenueStreams: [
      'Subscriptions (primary)',
      'Insurance referral commissions',
      'Financial product partnerships',
      'Aggregated & anonymized market data (NEVER individual data)',
    ],
  },

  budgetRules: {
    rule: 'NO spending without explicit owner approval',
    approvalProcess: 'All budget requests routed through Coordinator Agent to owner',
    categories: [
      'Infrastructure & hosting',
      'Third-party API services',
      'Design assets & tools',
      'Legal review',
      'Marketing & advertising',
      'Development tools',
    ],
  },
};
