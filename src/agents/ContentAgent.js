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
        personality: 'Like a knowledgeable friend who makes car buying feel easy and safe.',
        doSay: ['Find your perfect car', 'Your data is protected', 'Transparent pricing, no surprises', 'Everyone deserves a fair deal'],
        dontSay: ['Disrupting the industry', 'Used cars (say pre-owned)', 'Bad credit (say credit-challenged)', 'We sell your data'],
      },
      contentPillars: [
        { pillar: 'Car Buying Guides', examples: ['First-time buyer checklist', 'How to negotiate a car price', 'New vs used: which is right for you?'] },
        { pillar: 'Credit & Financing', examples: ['How to improve your credit score before buying', 'Understanding APR and loan terms', 'Pre-qualification vs pre-approval explained'] },
        { pillar: 'Vehicle Research', examples: ['Best reliable cars under $15K', 'SUVs with best safety ratings', 'EV buying guide for beginners'] },
        { pillar: 'Dealer Insights', examples: ['How to spot a trustworthy dealer', 'Questions to ask before signing', 'Understanding dealer fees'] },
        { pillar: 'How-To Guides', examples: ['Getting started on Carbuyinghub.com', 'How to submit a credit application', 'Reading your deal score'] },
      ],
      seoStrategy: {
        primaryKeywords: ['buy a car online', 'bad credit car loans', 'car buying website', 'online credit application for car', 'buy here pay here near me', 'used cars for sale', 'auto financing'],
        contentTypes: ['Blog posts (3-4/month)', 'City-specific dealer guides', 'Video walkthroughs', 'Car buying glossary', 'Vehicle comparison tools'],
        technicalSEO: ['Structured data markup (Vehicle, Offer, Review schema)', 'Fast page loads (<2s)', 'Mobile-first indexing', 'Local SEO for dealer/city pages'],
      },
      appStoreOptimization: {
        title: 'Carbuyinghub — Car Buying Made Easy',
        subtitle: 'Search cars, apply for credit, compare deals',
        keywords: 'car buying, used cars, auto loans, credit application, car deals, financing, dealer, vehicle search',
        screenshotStrategy: ['Vehicle search results', 'Credit application form', 'Deal score rating', 'Dealer reviews', 'Payment calculator'],
      },
    };
  }
}
