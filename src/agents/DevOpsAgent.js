import { Agent } from '../core/Agent.js';

/**
 * DevOpsAgent — Expert in deployment, CI/CD, infrastructure, and monitoring.
 */
export class DevOpsAgent extends Agent {
  constructor() {
    super({
      name: 'DevOps Engineer',
      role: 'DevOps & Infrastructure Expert',
      expertise: [
        'CI/CD pipelines',
        'containerization (Docker)',
        'cloud infrastructure (AWS/GCP/Vercel)',
        'monitoring & alerting',
        'database management',
        'auto-scaling',
        'CDN configuration',
        'SSL/TLS management',
        'environment management',
        'disaster recovery',
      ],
      capabilities: [
        'setup_cicd',
        'configure_infrastructure',
        'setup_monitoring',
        'create_deployment_pipeline',
        'configure_cdn',
        'setup_backups',
      ],
    });
  }

  async executeTask(task) {
    return {
      agent: this.name,
      task: task.title,
      infrastructure: {
        environments: {
          development: 'Local Docker Compose setup',
          staging: 'Auto-deploy from develop branch',
          production: 'Manual promotion from staging with approval gate',
        },
        cicd: {
          tool: 'GitHub Actions',
          pipeline: ['Lint -> Test -> Build -> Security Scan -> Deploy to staging -> Manual approval -> Deploy to production'],
          autoTests: ['Unit tests', 'Integration tests', 'E2E tests (Playwright)', 'Security scanning (Snyk)', 'Lighthouse performance audit'],
        },
        hosting: {
          frontend: 'Vercel (Next.js optimized, global CDN)',
          backend: 'Railway or Fly.io (auto-scaling, managed Postgres)',
          database: 'Managed PostgreSQL with daily backups',
          cache: 'Upstash Redis (serverless, pay-per-request)',
          storage: 'Cloudflare R2 (S3-compatible, no egress fees)',
          cdn: 'Cloudflare (DNS, CDN, DDoS protection)',
        },
        monitoring: {
          errors: 'Sentry (error tracking + performance)',
          uptime: 'Better Uptime or Checkly',
          logs: 'Axiom or Logtail (structured logging)',
          analytics: 'PostHog (self-hostable, privacy-friendly)',
        },
        estimatedMonthlyCosts: {
          starter: '$0-50/mo (free tiers cover early stage)',
          growth: '$100-500/mo (post-launch, real traffic)',
          scale: '$500-2000/mo (10K+ active users)',
          note: 'ALL costs require owner approval before activation',
        },
      },
      recommendations: [
        'Start with free tiers — most services offer generous free plans',
        'Use infrastructure-as-code from day 1 (even if simple)',
        'Set up monitoring before launch, not after first outage',
        'Automated backups with tested restore procedures',
      ],
    };
  }
}
