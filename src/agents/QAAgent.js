import { Agent } from '../core/Agent.js';

/**
 * QAAgent — Expert in testing, quality assurance, and bug tracking.
 */
export class QAAgent extends Agent {
  constructor() {
    super({
      name: 'QA Tester',
      role: 'Quality Assurance Expert',
      expertise: [
        'test strategy & planning',
        'unit testing',
        'integration testing',
        'end-to-end testing',
        'mobile testing',
        'performance testing',
        'accessibility testing',
        'cross-browser testing',
        'regression testing',
        'user acceptance testing',
      ],
      capabilities: [
        'create_test_plan',
        'write_test_cases',
        'run_tests',
        'performance_audit',
        'accessibility_audit',
        'cross_browser_test',
      ],
    });
  }

  async executeTask(task) {
    return {
      agent: this.name,
      task: task.title,
      testStrategy: {
        pyramid: {
          unit: '70% — Fast, isolated, run on every commit',
          integration: '20% — API + database, run on every PR',
          e2e: '10% — Critical user flows, run before deploy',
        },
        tools: {
          unit: 'Vitest (fast, ESM-native, Jest-compatible)',
          integration: 'Supertest (API testing)',
          e2e: 'Playwright (cross-browser, mobile viewports)',
          performance: 'Lighthouse CI + k6 for load testing',
          accessibility: 'axe-core + Playwright accessibility testing',
          visual: 'Playwright visual regression snapshots',
        },
        criticalFlows: [
          'User registration and login',
          'Platform connection (OAuth flow)',
          'Earnings dashboard loads correctly',
          'Trip tracking (real-time updates)',
          'Payment/subscription flow',
          'Profile verification',
          'Push notification delivery',
        ],
        mobileTestMatrix: {
          ios: ['iPhone 14', 'iPhone SE (small screen)', 'iPad'],
          android: ['Pixel 7', 'Samsung S23', 'Budget device (low RAM)'],
          conditions: ['Good WiFi', '4G', '3G/slow', 'Offline mode'],
        },
        performanceTargets: {
          firstContentfulPaint: '< 1.5s',
          largestContentfulPaint: '< 2.5s',
          timeToInteractive: '< 3.5s',
          cumulativeLayoutShift: '< 0.1',
          apiResponseP95: '< 200ms',
          lighthouseScore: '> 90',
        },
      },
      recommendations: [
        'Test with real driver data patterns (earnings spikes, multi-platform)',
        'Automated accessibility testing catches 30-50% of issues — supplement with manual',
        'Performance test on low-end devices — many drivers use budget phones',
        'Test offline scenarios — drivers often lose connectivity',
      ],
    };
  }
}
