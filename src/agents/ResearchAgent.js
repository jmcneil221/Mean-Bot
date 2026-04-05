import { Agent } from '../core/Agent.js';

/**
 * ResearchAgent — Deep research on markets, technologies, and user needs.
 *
 * Handles: market research, user persona creation, technology evaluation,
 * trend analysis, feature prioritization, user surveys.
 */
export class ResearchAgent extends Agent {
  constructor() {
    super({
      name: 'Researcher',
      role: 'Market & Technology Researcher',
      expertise: [
        'market research',
        'user persona development',
        'technology evaluation',
        'trend analysis',
        'feature prioritization',
        'survey design',
        'data analysis',
        'industry reports',
        'user interviews',
        'A/B testing strategy',
      ],
      capabilities: [
        'conduct_market_research',
        'create_user_personas',
        'evaluate_technologies',
        'analyze_trends',
        'prioritize_features',
        'design_surveys',
      ],
    });
  }

  async executeTask(task) {
    const handlers = {
      market_research: () => this.conductMarketResearch(task),
      user_personas: () => this.createUserPersonas(task),
      tech_evaluation: () => this.evaluateTechnologies(task),
      default: () => this.generalResearch(task),
    };
    const handler = handlers[task.type] || handlers.default;
    return handler();
  }

  conductMarketResearch(task) {
    return {
      agent: this.name,
      task: task.title,
      findings: {
        marketSize: {
          usedCarMarket: '$900B+ US used car market (2025)',
          newCarMarket: '$600B+ US new car market (2025)',
          autoFinancing: '$1.4T+ outstanding US auto loan market',
          onlineCarBuying: '$200B+ and growing 15% YoY as buyers shift online',
        },
        targetSegments: [
          { segment: 'First-time car buyers', size: '6M+ per year in US', pain: 'No credit history, confusing process, fear of overpaying' },
          { segment: 'Credit-challenged buyers', size: '30%+ of US adults have subprime credit', pain: 'Denied at dealerships, predatory rates, limited options' },
          { segment: 'Used car shoppers', size: '40M+ used cars sold/year in US', pain: 'Hidden damage, price uncertainty, dealer trust issues' },
          { segment: 'Car dealers', size: '18K+ franchised + 37K+ independent in US', pain: 'Lead generation costs, online competition, inventory management' },
          { segment: 'Auto lenders', size: '$600B+ originated annually', pain: 'Customer acquisition, fraud, application processing costs' },
        ],
        trends: [
          'Online car buying accelerating post-COVID — buyers want digital-first experience',
          'AI-powered pricing and deal scoring becoming standard',
          'Buy-here-pay-here dealers growing for subprime market',
          'Vehicle subscription and lease alternatives gaining traction',
          'EV market creating new buyer education needs',
          'Consumers demanding transparent pricing — no hidden fees',
        ],
        opportunities: [
          'Simplified online credit application with instant pre-qualification',
          'AI deal scoring — tell buyers if a price is good before they negotiate',
          'Aggregated inventory search across multiple dealers',
          'Transparent pricing and market value comparison',
          'Credit-challenged buyer marketplace (underserved, high demand)',
          'Vehicle history + inspection bundle for buyer confidence',
        ],
      },
      recommendations: [
        'Start with used car market — largest volume, most pain points',
        'Credit application is the hook — make it fast, secure, and easy',
        'Differentiate with transparency: real market pricing, no hidden fees',
        'Build for mobile-first — 60%+ of car searches start on phones',
        'Partner with independent dealers first — they need leads most',
      ],
    };
  }

  createUserPersonas(task) {
    return {
      agent: this.name,
      task: task.title,
      personas: [
        {
          name: 'Marcus — The First-Time Buyer',
          age: 23, type: 'First car purchase',
          goals: ['Find a reliable car under $15K', 'Get approved for financing', 'Not get ripped off'],
          frustrations: ['No credit history', 'Dealer pressure tactics', 'Confusing finance terms'],
          techComfort: 'High',
        },
        {
          name: 'Linda — The Credit Rebuilder',
          age: 38, type: 'Subprime buyer',
          goals: ['Get approved despite 520 credit score', 'Find reasonable interest rate', 'Rebuild credit'],
          frustrations: ['Denied everywhere', 'Predatory lender offers', 'Embarrassment at dealerships'],
          techComfort: 'Medium',
        },
        {
          name: 'James — The Family Upgrader',
          age: 42, type: 'Used car shopper',
          goals: ['Find reliable SUV for family', 'Trade in current vehicle', 'Stay within budget'],
          frustrations: ['Hidden vehicle damage', 'Unclear pricing', 'Time-consuming dealer visits'],
          techComfort: 'Medium',
        },
        {
          name: 'Priya — The Savvy Researcher',
          age: 31, type: 'Online-first buyer',
          goals: ['Compare prices across 10+ dealers', 'Know exact market value', 'Negotiate from strength'],
          frustrations: ['Inconsistent pricing', 'Pressure to decide fast', 'Lack of transparency'],
          techComfort: 'High',
        },
        {
          name: 'Dave — Independent Dealer Owner',
          age: 55, type: 'Dealer',
          goals: ['Generate quality leads', 'Sell 50+ cars/month', 'Compete with online platforms'],
          frustrations: ['High lead generation costs', 'Tire kickers', 'Carvana/Vroom competition'],
          techComfort: 'Low-Medium',
        },
      ],
    };
  }

  evaluateTechnologies(task) {
    return {
      agent: this.name,
      task: task.title,
      evaluation: {
        frontend: [
          { tech: 'Next.js', score: 9, reason: 'SSR, great DX, huge ecosystem' },
          { tech: 'React Native', score: 8, reason: 'Cross-platform mobile from one codebase' },
          { tech: 'Flutter', score: 7, reason: 'Great performance but smaller web ecosystem' },
        ],
        backend: [
          { tech: 'Node.js + Express/Fastify', score: 9, reason: 'JavaScript everywhere, real-time capable' },
          { tech: 'Python + FastAPI', score: 8, reason: 'Great for ML/AI features, clean API design' },
          { tech: 'Go', score: 7, reason: 'High performance but smaller talent pool' },
        ],
        database: [
          { tech: 'PostgreSQL + PostGIS', score: 9, reason: 'Geospatial queries critical for driver app' },
          { tech: 'MongoDB', score: 6, reason: 'Flexible but geospatial less mature' },
        ],
        hosting: [
          { tech: 'Vercel + Railway', score: 8, reason: 'Easy deployment, good free tiers' },
          { tech: 'AWS', score: 9, reason: 'Full-featured but complex, higher cost' },
          { tech: 'Fly.io', score: 8, reason: 'Edge deployment, great for global reach' },
        ],
      },
      recommendation: 'Next.js + Node.js + PostgreSQL + Vercel/Railway — best balance of speed, cost, and capability',
    };
  }

  generalResearch(task) {
    return {
      agent: this.name,
      task: task.title,
      output: `Research complete for: ${task.title}`,
      recommendations: ['Validate assumptions with real driver interviews before building'],
    };
  }
}
