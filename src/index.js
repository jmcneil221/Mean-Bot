/**
 * Carbuyinghub AI Agent Coordinator System
 * ====================================
 * Entry point — initializes all agents and the coordination infrastructure.
 *
 * Architecture:
 *   Owner (You)
 *     └── Coordinator Agent (oversees everything)
 *           ├── Graphic Designer
 *           ├── Layout Specialist
 *           ├── API Architect
 *           ├── Researcher
 *           ├── Competitive Analyst
 *           ├── Security Expert
 *           ├── Legal Advisor
 *           ├── UX Specialist
 *           ├── DevOps Engineer
 *           ├── Analytics Specialist
 *           ├── Content Strategist
 *           └── QA Tester
 *
 * Budget Rule: NO money is spent without owner approval through the Coordinator.
 */

import { TaskManager } from './core/TaskManager.js';
import { BudgetManager } from './core/BudgetManager.js';
import { MessageBus } from './core/MessageBus.js';

import { CoordinatorAgent } from './agents/CoordinatorAgent.js';
import { GraphicDesignAgent } from './agents/GraphicDesignAgent.js';
import { LayoutAgent } from './agents/LayoutAgent.js';
import { APIAgent } from './agents/APIAgent.js';
import { ResearchAgent } from './agents/ResearchAgent.js';
import { CompetitiveAgent } from './agents/CompetitiveAgent.js';
import { SecurityAgent } from './agents/SecurityAgent.js';
import { LegalAgent } from './agents/LegalAgent.js';
import { UXAgent } from './agents/UXAgent.js';
import { DevOpsAgent } from './agents/DevOpsAgent.js';
import { AnalyticsAgent } from './agents/AnalyticsAgent.js';
import { ContentAgent } from './agents/ContentAgent.js';
import { QAAgent } from './agents/QAAgent.js';

/**
 * Bootstrap the entire agent system.
 * Returns the coordinator with all agents registered and ready.
 */
export function createCarbuyinghubSystem() {
  // Core infrastructure
  const taskManager = new TaskManager();
  const budgetManager = new BudgetManager();
  const messageBus = new MessageBus();

  // The boss
  const coordinator = new CoordinatorAgent();
  coordinator.initialize({ budgetManager, taskManager, messageBus });

  // Register all specialist agents
  const agents = [
    new GraphicDesignAgent(),
    new LayoutAgent(),
    new APIAgent(),
    new ResearchAgent(),
    new CompetitiveAgent(),
    new SecurityAgent(),
    new LegalAgent(),
    new UXAgent(),
    new DevOpsAgent(),
    new AnalyticsAgent(),
    new ContentAgent(),
    new QAAgent(),
  ];

  for (const agent of agents) {
    coordinator.registerAgent(agent);
  }

  return {
    coordinator,
    taskManager,
    budgetManager,
    messageBus,
  };
}

// Auto-run if executed directly
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (isMainModule || process.argv[1]?.endsWith('index.js')) {
  const system = createCarbuyinghubSystem();
  const { coordinator } = system;

  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║         CARBUYINGHUB AI AGENT COORDINATOR SYSTEM         ║');
  console.log('║        "Your AI Team, Your Rules, Your App"         ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log('║  Budget Rule: NO spending without owner approval    ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  console.log('Registered Agents:');
  console.log('─'.repeat(55));
  for (const agent of coordinator.listAgents()) {
    console.log(`  ► ${agent.name.padEnd(22)} │ ${agent.role}`);
  }
  console.log('─'.repeat(55));

  // Demo: Plan the Carbuyinghub project
  const plan = coordinator.planProject({
    title: 'Build Carbuyinghub.com — The Ultimate Car Buying Platform',
    description: 'A dynamic app and website for drivers of all types: rideshare, delivery, trucking, and personal driving.',
  });

  console.log(`\nProject Plan: ${plan.goal}`);
  console.log('═'.repeat(55));
  for (const phase of plan.phases) {
    console.log(`\n  Phase: ${phase.name}`);
    for (const task of phase.tasks) {
      console.log(`    → [${task.priority.toUpperCase()}] ${task.title} ⟶ ${task.assignTo}`);
    }
  }

  // Show dashboard
  const dashboard = coordinator.getDashboard();
  console.log('\n\nSystem Dashboard:');
  console.log('─'.repeat(55));
  console.log(`  Active Agents:       ${Object.keys(dashboard.agents).length}`);
  console.log(`  Pending Approvals:   ${dashboard.pendingApprovals.length}`);
  console.log(`  Budget Status:       ${dashboard.budget.remaining === 'no cap set' ? 'No cap set (all spending requires approval)' : `$${dashboard.budget.remaining} remaining`}`);
  console.log('\n  Run "npm run agents" for the interactive CLI.\n');
}
