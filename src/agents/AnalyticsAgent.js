import { Agent } from '../core/Agent.js';

/**
 * AnalyticsAgent — Expert in data analytics, KPIs, and growth metrics.
 */
export class AnalyticsAgent extends Agent {
  constructor() {
    super({
      name: 'Analytics Specialist',
      role: 'Analytics & Growth Metrics Expert',
      expertise: [
        'product analytics',
        'KPI definition',
        'funnel analysis',
        'cohort analysis',
        'A/B testing',
        'user retention metrics',
        'revenue analytics',
        'growth modeling',
        'dashboard design',
        'data privacy in analytics',
      ],
      capabilities: [
        'define_kpis',
        'setup_analytics',
        'create_dashboards',
        'analyze_funnels',
        'design_experiments',
        'growth_modeling',
      ],
    });
  }

  async executeTask(task) {
    return {
      agent: this.name,
      task: task.title,
      kpis: {
        acquisition: [
          'Daily/Weekly/Monthly Active Users (DAU/WAU/MAU)',
          'New user sign-ups per day',
          'Cost per acquisition (CPA)',
          'Sign-up to onboarding completion rate',
          'Platform connection rate (% who connect at least 1 platform)',
        ],
        engagement: [
          'Daily app opens per user',
          'Time spent in app per session',
          'Features used per session',
          'Community posts/comments per week',
          'Earnings check frequency',
        ],
        retention: [
          'Day 1 / Day 7 / Day 30 retention',
          'Churn rate (monthly)',
          'Reactivation rate',
          'Net Promoter Score (NPS)',
        ],
        revenue: [
          'Monthly Recurring Revenue (MRR)',
          'Average Revenue Per User (ARPU)',
          'Free to premium conversion rate',
          'Subscription churn rate',
          'Lifetime Value (LTV)',
          'LTV:CAC ratio (target 3:1+)',
        ],
        driverSpecific: [
          'Total driver earnings tracked through platform',
          'Average earnings increase after using Carbuyinghub',
          'Tax deductions identified per user',
          'Cross-platform optimization usage',
        ],
      },
      analyticsStack: {
        product: 'PostHog (privacy-friendly, self-hostable)',
        web: 'Plausible or Fathom (privacy-first web analytics)',
        experiments: 'PostHog feature flags + A/B testing',
        dataWarehouse: 'ClickHouse or BigQuery (when scale demands)',
      },
      recommendations: [
        'Track the "aha moment" — when a driver sees earnings across all platforms for the first time',
        'Privacy-first analytics: anonymize by default, consent for detailed tracking',
        'Build internal dashboards before investor dashboards',
      ],
    };
  }
}
