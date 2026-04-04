import { Agent } from '../core/Agent.js';

/**
 * LayoutAgent — Expert in site structure, wireframes, and responsive design.
 *
 * Handles: page layouts, wireframes, responsive design, navigation architecture,
 * component systems, grid systems, mobile-first design.
 */
export class LayoutAgent extends Agent {
  constructor() {
    super({
      name: 'Layout Specialist',
      role: 'Site Layout & Structure Expert',
      expertise: [
        'responsive web design',
        'mobile-first design',
        'wireframing',
        'component architecture',
        'grid systems',
        'navigation design',
        'information architecture',
        'CSS frameworks',
        'design systems',
        'accessibility (WCAG)',
      ],
      capabilities: [
        'create_wireframes',
        'design_page_layouts',
        'build_component_system',
        'design_navigation',
        'create_responsive_grid',
        'audit_accessibility',
      ],
    });
  }

  async executeTask(task) {
    const handlers = {
      create_wireframes: () => this.createWireframes(task),
      design_site_structure: () => this.designSiteStructure(task),
      default: () => this.generalLayoutTask(task),
    };
    const handler = handlers[task.type] || handlers.default;
    return handler();
  }

  createWireframes(task) {
    return {
      agent: this.name,
      task: task.title,
      pages: {
        home: {
          sections: ['Hero with CTA', 'Feature highlights (3-col)', 'Driver testimonials', 'How it works', 'Download CTA', 'Footer'],
          layout: 'Single-page scroll with sticky nav',
        },
        dashboard: {
          sections: ['Top stats bar', 'Map/route view', 'Earnings summary', 'Upcoming trips', 'Quick actions sidebar'],
          layout: 'Two-column: sidebar + main content',
        },
        profile: {
          sections: ['Avatar + info card', 'Verification status', 'Vehicle info', 'Rating/reviews', 'Settings tabs'],
          layout: 'Card-based single column',
        },
        trips: {
          sections: ['Trip search/filter bar', 'Trip list (scrollable)', 'Trip detail modal', 'Map integration'],
          layout: 'Split view: list left, map right',
        },
        earnings: {
          sections: ['Period selector', 'Earnings chart', 'Transaction list', 'Payout schedule', 'Tax summary'],
          layout: 'Dashboard grid',
        },
      },
      breakpoints: {
        mobile: '< 640px (single column, bottom nav)',
        tablet: '640px - 1024px (condensed sidebar)',
        desktop: '> 1024px (full layout)',
      },
      componentSystem: [
        'Button (primary, secondary, ghost, danger)',
        'Card (content, stat, profile, trip)',
        'Input (text, select, date, search)',
        'Modal (confirmation, detail, form)',
        'Navigation (top bar, sidebar, bottom mobile)',
        'Map (full, mini, route overlay)',
        'Chart (line, bar, donut)',
        'Badge (status, rating, verification)',
        'Toast (success, error, info, warning)',
      ],
      recommendations: [
        'Use CSS Grid for dashboard layouts, Flexbox for components',
        'Implement skeleton loading states for all data-driven components',
        'Bottom navigation on mobile for thumb-friendly access',
        'Dark mode support from day one — drivers often use apps at night',
      ],
    };
  }

  designSiteStructure(task) {
    return {
      agent: this.name,
      task: task.title,
      siteMap: {
        public: ['/ (Home)', '/about', '/drivers', '/safety', '/pricing', '/blog', '/contact', '/legal'],
        auth: ['/login', '/register', '/forgot-password', '/verify-email', '/verify-phone'],
        app: ['/dashboard', '/trips', '/trips/:id', '/earnings', '/profile', '/settings', '/vehicles', '/messages', '/support'],
        admin: ['/admin/dashboard', '/admin/users', '/admin/trips', '/admin/analytics', '/admin/settings'],
      },
      navigation: {
        desktop: 'Top navbar with dropdown menus',
        mobile: 'Bottom tab bar (Dashboard, Trips, Earnings, Messages, Profile)',
        admin: 'Left sidebar with collapsible sections',
      },
      techStack: {
        framework: 'Next.js (React) — SSR + SPA hybrid',
        styling: 'Tailwind CSS + custom design tokens',
        stateManagement: 'Zustand for client state, React Query for server state',
        maps: 'Mapbox GL JS or Google Maps Platform',
        charts: 'Recharts for dashboard visualizations',
      },
    };
  }

  generalLayoutTask(task) {
    return {
      agent: this.name,
      task: task.title,
      output: `Layout analysis complete for: ${task.title}`,
      recommendations: [
        'Prioritize mobile experience — most drivers use phones',
        'Ensure touch targets are at least 44x44px',
        'Test layouts with real content, not lorem ipsum',
      ],
    };
  }
}
