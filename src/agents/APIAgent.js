import { Agent } from '../core/Agent.js';

/**
 * APIAgent — Expert in API design, backend architecture, and integrations.
 *
 * Handles: REST/GraphQL API design, database schema, third-party integrations,
 * real-time communication, payment processing, mapping services.
 */
export class APIAgent extends Agent {
  constructor() {
    super({
      name: 'API Architect',
      role: 'API & Backend Architecture Expert',
      expertise: [
        'RESTful API design',
        'GraphQL',
        'database design (SQL & NoSQL)',
        'authentication & authorization',
        'real-time systems (WebSocket)',
        'payment gateway integration',
        'mapping & geolocation APIs',
        'microservices architecture',
        'rate limiting & caching',
        'API versioning',
      ],
      capabilities: [
        'design_api',
        'design_database_schema',
        'plan_integrations',
        'design_auth_system',
        'design_realtime_system',
        'create_api_documentation',
      ],
    });
  }

  async executeTask(task) {
    const handlers = {
      design_api: () => this.designAPI(task),
      design_database: () => this.designDatabase(task),
      plan_integrations: () => this.planIntegrations(task),
      default: () => this.generalAPITask(task),
    };
    const handler = handlers[task.type] || handlers.default;
    return handler();
  }

  designAPI(task) {
    return {
      agent: this.name,
      task: task.title,
      apiDesign: {
        style: 'REST with optional GraphQL layer',
        baseUrl: '/api/v1',
        auth: 'JWT + refresh tokens with OAuth2 social login',
        endpoints: {
          auth: [
            'POST /auth/register',
            'POST /auth/login',
            'POST /auth/refresh',
            'POST /auth/forgot-password',
            'POST /auth/verify-phone',
            'POST /auth/oauth/:provider',
          ],
          users: [
            'GET /users/me',
            'PUT /users/me',
            'POST /users/me/avatar',
            'GET /users/me/documents',
            'POST /users/me/verify',
          ],
          vehicles: [
            'GET /vehicles',
            'POST /vehicles',
            'PUT /vehicles/:id',
            'DELETE /vehicles/:id',
            'POST /vehicles/:id/photos',
          ],
          trips: [
            'POST /trips',
            'GET /trips',
            'GET /trips/:id',
            'PUT /trips/:id/status',
            'POST /trips/:id/rate',
            'GET /trips/:id/route',
            'WS /trips/:id/live',
          ],
          earnings: [
            'GET /earnings',
            'GET /earnings/summary',
            'GET /earnings/history',
            'POST /earnings/payout',
            'GET /earnings/tax-summary',
          ],
          messaging: [
            'GET /messages/conversations',
            'GET /messages/:conversationId',
            'POST /messages/:conversationId',
            'WS /messages/live',
          ],
          admin: [
            'GET /admin/users',
            'GET /admin/analytics',
            'PUT /admin/users/:id/status',
            'GET /admin/reports',
          ],
        },
      },
      techStack: {
        runtime: 'Node.js with Express or Fastify',
        database: 'PostgreSQL (primary) + Redis (cache/sessions)',
        orm: 'Prisma',
        realtime: 'Socket.IO for live trip tracking & messaging',
        queue: 'Bull (Redis-backed) for background jobs',
        storage: 'AWS S3 or Cloudflare R2 for file uploads',
        search: 'Elasticsearch for trip/driver search',
      },
      recommendations: [
        'Use API versioning from day 1 (/api/v1/)',
        'Implement rate limiting: 100 req/min for auth, 1000/min for general',
        'Use cursor-based pagination for lists',
        'WebSocket for live trip tracking — critical for driver experience',
        'Implement idempotency keys for payment endpoints',
      ],
    };
  }

  designDatabase(task) {
    return {
      agent: this.name,
      task: task.title,
      schema: {
        users: {
          fields: ['id (UUID)', 'email', 'phone', 'passwordHash', 'firstName', 'lastName', 'role (driver|rider|admin)', 'avatarUrl', 'verificationStatus', 'rating', 'createdAt', 'updatedAt'],
          indexes: ['email (unique)', 'phone (unique)', 'role'],
        },
        vehicles: {
          fields: ['id (UUID)', 'userId (FK)', 'make', 'model', 'year', 'color', 'licensePlate', 'vin', 'insurance', 'photos[]', 'status', 'createdAt'],
          indexes: ['userId', 'licensePlate (unique)'],
        },
        trips: {
          fields: ['id (UUID)', 'driverId (FK)', 'riderId (FK)', 'vehicleId (FK)', 'status', 'pickupLocation (POINT)', 'dropoffLocation (POINT)', 'route (LINESTRING)', 'distanceMiles', 'durationMinutes', 'fare', 'startedAt', 'completedAt'],
          indexes: ['driverId', 'riderId', 'status', 'createdAt'],
        },
        earnings: {
          fields: ['id (UUID)', 'userId (FK)', 'tripId (FK)', 'amount', 'type (trip|bonus|tip|referral)', 'status (pending|paid|failed)', 'paidAt'],
          indexes: ['userId', 'status', 'paidAt'],
        },
        messages: {
          fields: ['id (UUID)', 'conversationId', 'senderId (FK)', 'content', 'readAt', 'createdAt'],
          indexes: ['conversationId', 'senderId', 'createdAt'],
        },
      },
    };
  }

  planIntegrations(task) {
    return {
      agent: this.name,
      task: task.title,
      integrations: {
        maps: { provider: 'Mapbox or Google Maps', purpose: 'Routing, geocoding, live tracking', costModel: 'Per-request pricing' },
        payments: { provider: 'Stripe Connect', purpose: 'Driver payouts, rider charges, marketplace payments', costModel: 'Per-transaction fee' },
        sms: { provider: 'Twilio', purpose: 'Phone verification, trip alerts', costModel: 'Per-message' },
        email: { provider: 'SendGrid or Resend', purpose: 'Transactional & marketing emails', costModel: 'Monthly tier' },
        push: { provider: 'Firebase Cloud Messaging', purpose: 'Mobile push notifications', costModel: 'Free tier generous' },
        storage: { provider: 'AWS S3 / Cloudflare R2', purpose: 'Photos, documents, uploads', costModel: 'Per-GB storage + egress' },
        analytics: { provider: 'Mixpanel or PostHog', purpose: 'User behavior tracking', costModel: 'Monthly tier' },
        monitoring: { provider: 'Sentry', purpose: 'Error tracking & performance', costModel: 'Monthly tier' },
      },
      costEstimates: 'ALL costs require owner approval before any service is activated',
    };
  }

  generalAPITask(task) {
    return {
      agent: this.name,
      task: task.title,
      output: `API architecture analysis complete for: ${task.title}`,
      recommendations: [
        'Start with a monolith, extract microservices as needed',
        'Implement comprehensive request validation at the API boundary',
        'Use structured logging for all API requests',
      ],
    };
  }
}
