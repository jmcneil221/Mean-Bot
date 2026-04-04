import { Agent } from '../core/Agent.js';

/**
 * ContentAgent — Expert in content strategy, copywriting, and SEO.
 */
export class ContentAgent extends Agent {
  constructor() {
    super({
      name: 'Content Strategist',
      role: 'Content Strategy & Copywriting Expert',
      expertise: [
        'content strategy',
        'copywriting',
        'SEO optimization',
        'brand voice',
        'social media content',
        'blog strategy',
        'email marketing',
        'app store optimization (ASO)',
        'driver community content',
        'help documentation',
      ],
      capabilities: [
        'create_content_strategy',
        'write_copy',
        'optimize_seo',
        'plan_social_media',
        'write_blog_posts',
        'create_email_campaigns',
        'app_store_listing',
      ],
    });
  }

  async executeTask(task) {
    return {
      agent: this.name,
      task: task.title,
      brandVoice: {
        tone: 'Confident but not cocky. Helpful but not patronizing. Driver-first, always.',
        personality: 'Like a trusted friend who also happens to know everything about driving for a living.',
        doSay: ['We help you earn more', 'Your data, your control', 'Built by drivers, for drivers', 'No commissions, ever'],
        dontSay: ['Disrupting the industry', 'Gig economy', 'Side hustle (dismissive)', 'We own your data'],
      },
      contentPillars: [
        { pillar: 'Earnings Optimization', examples: ['Best hours to drive in [city]', 'Platform comparison guides', 'Tax deduction checklist'] },
        { pillar: 'Driver Safety', examples: ['Dashcam recommendations', 'Emergency procedures', 'Vehicle maintenance schedules'] },
        { pillar: 'Community Stories', examples: ['Driver spotlights', 'Success stories', 'Tips from veteran drivers'] },
        { pillar: 'Industry News', examples: ['Regulation updates', 'Platform policy changes', 'EV transition guides'] },
        { pillar: 'How-To Guides', examples: ['Getting started with Drivera', 'Connecting platforms', 'Reading your earnings dashboard'] },
      ],
      seoStrategy: {
        primaryKeywords: ['driver earnings tracker', 'rideshare driver app', 'gig driver tools', 'driver tax deductions', 'multi-app driver'],
        contentTypes: ['Blog posts (2-4/month)', 'City-specific guides', 'Video tutorials', 'Driver glossary/wiki'],
        technicalSEO: ['Structured data markup', 'Fast page loads (<2s)', 'Mobile-first indexing', 'Local SEO for city pages'],
      },
      appStoreOptimization: {
        title: 'Drivera — Driver Earnings & Tools',
        subtitle: 'Track earnings across all platforms',
        keywords: 'driver, earnings, uber, lyft, doordash, rideshare, delivery, tracking, tax',
        screenshotStrategy: ['Earnings dashboard', 'Platform comparison', 'Tax deductions', 'Community feed', 'Dark mode'],
      },
    };
  }
}
