import { Agent } from '../core/Agent.js';

/**
 * GraphicDesignAgent — Expert in visual identity and graphic assets.
 *
 * Handles: logos, color palettes, typography, iconography, illustrations,
 * marketing materials, app store assets, social media graphics.
 */
export class GraphicDesignAgent extends Agent {
  constructor() {
    super({
      name: 'Graphic Designer',
      role: 'Graphic Design Expert',
      expertise: [
        'brand identity design',
        'logo design',
        'color theory & palettes',
        'typography selection',
        'iconography',
        'illustration',
        'marketing materials',
        'app store assets',
        'social media graphics',
        'print design',
      ],
      capabilities: [
        'create_brand_identity',
        'design_logo',
        'create_color_palette',
        'select_typography',
        'design_icons',
        'create_marketing_assets',
        'design_app_store_assets',
      ],
    });
  }

  async executeTask(task) {
    const handlers = {
      create_brand_identity: () => this.createBrandIdentity(task),
      design_logo: () => this.designLogo(task),
      create_color_palette: () => this.createColorPalette(task),
      default: () => this.generalDesignTask(task),
    };

    const handler = handlers[task.type] || handlers.default;
    return handler();
  }

  createBrandIdentity(task) {
    return {
      agent: this.name,
      task: task.title,
      deliverables: {
        brandGuide: {
          primaryColors: ['#1E3A5F', '#00B4D8', '#FF6B35', '#2EC4B6'],
          secondaryColors: ['#F7F7F7', '#333333', '#E8E8E8'],
          fonts: {
            heading: 'Inter Bold',
            body: 'Inter Regular',
            accent: 'Space Grotesk',
          },
          logoVariants: ['full-color', 'monochrome', 'icon-only', 'dark-mode'],
          brandVoice: 'Professional yet approachable — drivers trust Drivera',
        },
        moodBoard: 'Clean, modern, trustworthy — automotive meets tech',
        targetAudience: 'Drivers of all types: rideshare, delivery, trucking, personal',
      },
      recommendations: [
        'Use bold, high-contrast colors for in-vehicle readability',
        'Design icons at 24px, 32px, and 48px for multi-platform use',
        'Create a motion design system for micro-interactions',
      ],
      estimatedCosts: {
        stockPhotos: { amount: 200, vendor: 'Unsplash Pro', needsApproval: true },
        fontLicense: { amount: 0, vendor: 'Google Fonts', needsApproval: false },
        iconPack: { amount: 79, vendor: 'Phosphor Icons Pro', needsApproval: true },
      },
    };
  }

  designLogo(task) {
    return {
      agent: this.name,
      task: task.title,
      concepts: [
        { name: 'The Compass', style: 'Minimalist compass integrating a "D"', confidence: 0.9 },
        { name: 'The Shield', style: 'Shield shape representing driver protection', confidence: 0.85 },
        { name: 'The Road', style: 'Abstract road forming the Drivera wordmark', confidence: 0.8 },
      ],
      specifications: {
        formats: ['SVG', 'PNG', 'ICO', 'PDF'],
        sizes: ['16x16', '32x32', '64x64', '128x128', '512x512', '1024x1024'],
        colorModes: ['CMYK for print', 'RGB for digital', 'Grayscale'],
      },
      recommendations: [
        'Test logo at small sizes for mobile app icon clarity',
        'Ensure logo works on both light and dark backgrounds',
      ],
    };
  }

  createColorPalette(task) {
    return {
      agent: this.name,
      task: task.title,
      palette: {
        primary: { hex: '#1E3A5F', name: 'Drivera Navy', usage: 'Headers, primary actions' },
        secondary: { hex: '#00B4D8', name: 'Road Blue', usage: 'Links, highlights, accents' },
        accent: { hex: '#FF6B35', name: 'Signal Orange', usage: 'CTAs, alerts, important actions' },
        success: { hex: '#2EC4B6', name: 'Green Light', usage: 'Confirmations, positive states' },
        warning: { hex: '#FFD166', name: 'Caution Yellow', usage: 'Warnings, attention needed' },
        danger: { hex: '#EF476F', name: 'Brake Red', usage: 'Errors, destructive actions' },
        background: { hex: '#F8F9FA', name: 'Cloud White', usage: 'Page backgrounds' },
        surface: { hex: '#FFFFFF', name: 'Pure White', usage: 'Card surfaces' },
        text: { hex: '#212529', name: 'Asphalt', usage: 'Body text' },
        textSecondary: { hex: '#6C757D', name: 'Guardrail Gray', usage: 'Secondary text' },
      },
      accessibilityNotes: [
        'All text colors pass WCAG AA contrast on their backgrounds',
        'Signal Orange on white requires large text (18px+) for AA compliance',
      ],
    };
  }

  generalDesignTask(task) {
    return {
      agent: this.name,
      task: task.title,
      output: `Graphic design analysis complete for: ${task.title}`,
      recommendations: [
        'Maintain brand consistency across all touchpoints',
        'Optimize all assets for web and mobile performance',
      ],
    };
  }
}
