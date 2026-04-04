import { Agent } from '../core/Agent.js';

/**
 * UXAgent — Expert in user experience, usability, and interaction design.
 *
 * Handles: user flows, usability testing, accessibility, interaction patterns,
 * onboarding design, user journey mapping.
 */
export class UXAgent extends Agent {
  constructor() {
    super({
      name: 'UX Specialist',
      role: 'User Experience Expert',
      expertise: [
        'user flow design',
        'usability testing',
        'accessibility (WCAG 2.1 AA)',
        'interaction design',
        'onboarding optimization',
        'user journey mapping',
        'heuristic evaluation',
        'A/B testing',
        'mobile UX patterns',
        'driver-specific UX (glanceable, one-handed)',
      ],
      capabilities: [
        'design_user_flows',
        'create_journey_maps',
        'audit_usability',
        'design_onboarding',
        'accessibility_audit',
        'create_interaction_specs',
      ],
    });
  }

  async executeTask(task) {
    const handlers = {
      design_user_flows: () => this.designUserFlows(task),
      design_onboarding: () => this.designOnboarding(task),
      default: () => this.generalUXTask(task),
    };
    const handler = handlers[task.type] || handlers.default;
    return handler();
  }

  designUserFlows(task) {
    return {
      agent: this.name,
      task: task.title,
      flows: {
        driverOnboarding: {
          steps: ['Download app', 'Sign up (email/phone)', 'Verify phone', 'Basic profile', 'Connect driving platforms', 'Optional: add vehicle', 'Dashboard tour', 'Start using'],
          targetTime: 'Under 3 minutes to first value',
          dropOffRisks: ['Platform connection step (complex OAuth)', 'Document upload (friction)'],
        },
        startTrip: {
          steps: ['Open app', 'See earnings dashboard', 'Check best platform right now', 'Tap "Go Online"', 'See live earnings ticker'],
          targetTime: 'Under 5 seconds to key info',
          principle: 'Glanceable — driver should never look at phone for more than 2 seconds',
        },
        checkEarnings: {
          steps: ['Open app', 'Earnings summary on dashboard (no navigation needed)', 'Tap for details', 'Filter by platform/date', 'See tax deductions'],
          targetTime: 'Under 3 seconds to see today\'s earnings',
        },
        communityInteraction: {
          steps: ['Tap community tab', 'See local driver feed', 'Post or comment', 'Join topic channels', 'Direct message other drivers'],
          targetTime: 'Under 10 seconds to engage',
        },
      },
      uxPrinciples: [
        'GLANCEABLE: Key info visible without interaction — drivers are driving',
        'ONE-HANDED: All critical actions reachable with thumb on 6" screen',
        'OFFLINE-CAPABLE: Cache critical data for poor connectivity areas',
        'HIGH CONTRAST: Readable in direct sunlight and at night',
        'VOICE-READY: Design for future voice control integration',
        'FORGIVING: Undo actions, confirm destructive operations',
      ],
      recommendations: [
        'Dashboard shows earnings front and center — that\'s why drivers open the app',
        'Use haptic feedback for important notifications while driving',
        'Large touch targets (minimum 48x48px) for in-vehicle use',
        'Test with actual drivers in parked vehicles',
      ],
    };
  }

  designOnboarding(task) {
    return {
      agent: this.name,
      task: task.title,
      onboardingFlow: {
        philosophy: 'Progressive disclosure — ask for the minimum, add value immediately',
        steps: [
          { step: 1, screen: 'Welcome', action: 'Choose sign-up method', timeTarget: '10s' },
          { step: 2, screen: 'Basic Info', action: 'Name + phone/email', timeTarget: '30s' },
          { step: 3, screen: 'Verify', action: 'Enter OTP code', timeTarget: '20s' },
          { step: 4, screen: 'What do you drive for?', action: 'Select platforms (Uber, Lyft, DoorDash, etc.)', timeTarget: '15s' },
          { step: 5, screen: 'Connect', action: 'OAuth to platforms (optional, can skip)', timeTarget: '30s' },
          { step: 6, screen: 'Dashboard', action: 'Interactive tour with 3 tooltips', timeTarget: '20s' },
        ],
        totalTargetTime: '2 minutes 5 seconds',
        skipOptions: 'Users can skip steps 4-6 and complete later',
      },
    };
  }

  generalUXTask(task) {
    return {
      agent: this.name,
      task: task.title,
      output: `UX analysis complete for: ${task.title}`,
      recommendations: ['Every screen should answer: what can the driver do here in under 2 seconds?'],
    };
  }
}
