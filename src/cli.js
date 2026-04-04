/**
 * Interactive CLI for the Drivera Agent Coordinator System.
 * Allows the owner to interact with agents, approve budgets, and manage tasks.
 */

import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { createDriveraSystem } from './index.js';

const system = createDriveraSystem();
const { coordinator, budgetManager, taskManager } = system;

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\ndrivera> ',
});

function printHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║              DRIVERA AGENT CLI — COMMANDS                ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  AGENTS                                                  ║
║    agents              List all registered agents         ║
║    status              Full system dashboard              ║
║    ask <agent> <msg>   Send a task to a specific agent    ║
║                                                          ║
║  TASKS                                                   ║
║    plan                Generate full project plan          ║
║    assign <agent> <task>  Assign a task to an agent       ║
║    tasks               List all tasks                     ║
║                                                          ║
║  BUDGET                                                  ║
║    budget              View budget summary                ║
║    budget set <amount> Set budget cap                     ║
║    pending             View pending approval requests     ║
║    approve <id>        Approve a budget request           ║
║    deny <id> [reason]  Deny a budget request              ║
║                                                          ║
║  SPECIALIST REPORTS                                      ║
║    design              Run graphic design analysis        ║
║    layout              Run site layout analysis           ║
║    api                 Run API architecture analysis      ║
║    research            Run market research                ║
║    competitive         Run competitive analysis           ║
║    security            Run security audit                 ║
║    legal               Run legal analysis                 ║
║    ux                  Run UX analysis                    ║
║    devops              Run DevOps infrastructure plan     ║
║    analytics           Run analytics & KPI plan           ║
║    content             Run content strategy               ║
║    qa                  Run QA test plan                   ║
║                                                          ║
║  SYSTEM                                                  ║
║    messages            View recent messages               ║
║    notifications       View owner notifications           ║
║    help                Show this help                     ║
║    exit                Exit CLI                           ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`);
}

async function runAgentTask(agentName, taskType, taskTitle) {
  const agents = coordinator.agents;
  const agent = agents.get(agentName);
  if (!agent) {
    console.log(`Agent "${agentName}" not found. Run "agents" to see available agents.`);
    return;
  }

  const task = taskManager.createTask({
    title: taskTitle,
    assignTo: agentName,
    priority: 'high',
  });
  task.type = taskType;
  agent.receiveTask(task);
  const result = await agent.processNextTask();

  if (result.status === 'completed') {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`  Agent: ${agentName} — ${taskTitle}`);
    console.log(`${'═'.repeat(60)}`);
    console.log(JSON.stringify(result.result, null, 2));

    // Check for cost recommendations
    const output = result.result;
    if (output.estimatedCosts || output.estimatedLegalReviewCost) {
      const costs = output.estimatedCosts || { legalReview: output.estimatedLegalReviewCost };
      console.log(`\n⚠️  COSTS IDENTIFIED — Require your approval:`);
      for (const [key, cost] of Object.entries(costs)) {
        if (cost.needsApproval) {
          const req = agent.createBudgetRequest({
            amount: cost.amount,
            purpose: key,
            vendor: cost.vendor,
          });
          const submitted = budgetManager.submitRequest(req);
          console.log(`  ${submitted.message}`);
        }
      }
    }
  } else {
    console.log(`Task failed: ${result.error}`);
  }
}

async function handleCommand(line) {
  const trimmed = line.trim();
  if (!trimmed) return;

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();

  switch (cmd) {
    case 'help':
      printHelp();
      break;

    case 'agents':
      console.log('\nRegistered Agents:');
      console.log('─'.repeat(60));
      for (const agent of coordinator.listAgents()) {
        console.log(`  ${agent.status === 'idle' ? '●' : '◉'} ${agent.name.padEnd(24)} │ ${agent.role}`);
      }
      break;

    case 'status':
      const dash = coordinator.getDashboard();
      console.log('\n╔═ SYSTEM DASHBOARD ═══════════════════════════════════╗');
      console.log(`  Active Agents:     ${Object.keys(dash.agents).length}`);
      console.log(`  Total Tasks:       ${dash.tasks.total}`);
      console.log(`  In Progress:       ${dash.tasks.inProgress}`);
      console.log(`  Completed:         ${dash.tasks.completed}`);
      console.log(`  Pending Approvals: ${dash.pendingApprovals.length}`);
      console.log(`  Budget Cap:        ${dash.budget.budgetCap ? `$${dash.budget.budgetCap}` : 'Not set'}`);
      console.log(`  Approved Spending: $${dash.budget.approvedTotal}`);
      console.log(`  Actual Spent:      $${dash.budget.spentTotal}`);
      console.log('╚══════════════════════════════════════════════════════╝');
      break;

    case 'plan':
      const plan = coordinator.planProject({
        title: 'Build Drivera — The Ultimate Driver Platform',
        description: 'Dynamic app and website for all drivers.',
      });
      console.log(`\n  Project: ${plan.goal}\n`);
      for (const phase of plan.phases) {
        console.log(`  ┌─ ${phase.name} ──────────────`);
        for (const task of phase.tasks) {
          console.log(`  │  [${task.priority.toUpperCase().padEnd(8)}] ${task.title}`);
          console.log(`  │  ${''.padEnd(12)} → ${task.assignTo}`);
        }
        console.log('  └────────────────────────────────────');
      }
      break;

    case 'budget':
      if (parts[1] === 'set' && parts[2]) {
        const amount = parseFloat(parts[2]);
        const result = budgetManager.setBudget(amount);
        console.log(`  ${result.message}`);
      } else {
        const summary = budgetManager.getSummary();
        console.log('\n  Budget Summary:');
        console.log(`  Cap:          ${summary.budgetCap ? `$${summary.budgetCap}` : 'No cap (approval still required)'}`);
        console.log(`  Approved:     $${summary.approvedTotal}`);
        console.log(`  Spent:        $${summary.spentTotal}`);
        console.log(`  Remaining:    ${typeof summary.remaining === 'number' ? `$${summary.remaining}` : summary.remaining}`);
        console.log(`  Pending:      ${summary.pendingRequests} request(s)`);
        if (Object.keys(summary.byCategory).length > 0) {
          console.log('  By Category:');
          for (const [cat, amount] of Object.entries(summary.byCategory)) {
            console.log(`    - ${cat}: $${amount}`);
          }
        }
      }
      break;

    case 'pending':
      const pending = budgetManager.getPendingRequests();
      if (pending.length === 0) {
        console.log('  No pending budget requests.');
      } else {
        console.log('\n  Pending Budget Requests:');
        console.log('  ─'.repeat(30));
        for (const req of pending) {
          console.log(`  ID:      ${req.id}`);
          console.log(`  Agent:   ${req.agentName}`);
          console.log(`  Amount:  $${req.amount}`);
          console.log(`  Purpose: ${req.purpose}`);
          console.log(`  Vendor:  ${req.vendor}`);
          console.log(`  ─`.repeat(30));
        }
      }
      break;

    case 'approve':
      if (parts[1]) {
        try {
          const result = coordinator.ownerApproveBudget(parts[1], parts.slice(2).join(' '));
          console.log(`  ${result.message}`);
        } catch (e) {
          console.log(`  Error: ${e.message}`);
        }
      } else {
        console.log('  Usage: approve <request-id>');
      }
      break;

    case 'deny':
      if (parts[1]) {
        try {
          const result = coordinator.ownerDenyBudget(parts[1], parts.slice(2).join(' '));
          console.log(`  ${result.message}`);
        } catch (e) {
          console.log(`  Error: ${e.message}`);
        }
      } else {
        console.log('  Usage: deny <request-id> [reason]');
      }
      break;

    case 'design':
      await runAgentTask('Graphic Designer', 'create_brand_identity', 'Drivera Brand Identity');
      break;
    case 'layout':
      await runAgentTask('Layout Specialist', 'create_wireframes', 'Drivera Site Layout & Wireframes');
      break;
    case 'api':
      await runAgentTask('API Architect', 'design_api', 'Drivera API Architecture');
      break;
    case 'research':
      await runAgentTask('Researcher', 'market_research', 'Drivera Market Research');
      break;
    case 'competitive':
      await runAgentTask('Competitive Analyst', 'analyze_competitors', 'Drivera Competitive Analysis');
      break;
    case 'security':
      await runAgentTask('Security Expert', 'security_audit', 'Drivera Security Audit');
      break;
    case 'legal':
      await runAgentTask('Legal Advisor', 'draft_tos', 'Drivera Terms of Service');
      break;
    case 'ux':
      await runAgentTask('UX Specialist', 'design_user_flows', 'Drivera User Flows');
      break;
    case 'devops':
      await runAgentTask('DevOps Engineer', 'setup_infrastructure', 'Drivera Infrastructure Plan');
      break;
    case 'analytics':
      await runAgentTask('Analytics Specialist', 'define_kpis', 'Drivera KPIs & Analytics');
      break;
    case 'content':
      await runAgentTask('Content Strategist', 'create_content_strategy', 'Drivera Content Strategy');
      break;
    case 'qa':
      await runAgentTask('QA Tester', 'create_test_plan', 'Drivera QA Test Plan');
      break;

    case 'messages':
      const msgs = system.messageBus.getHistory({});
      if (msgs.length === 0) {
        console.log('  No messages yet.');
      } else {
        console.log('\n  Recent Messages:');
        for (const msg of msgs.slice(-10)) {
          console.log(`  [${msg.timestamp}] ${msg.from} → ${msg.to || msg.channel}: ${msg.content}`);
        }
      }
      break;

    case 'notifications':
      const notifs = coordinator.ownerNotifications;
      if (notifs.length === 0) {
        console.log('  No notifications.');
      } else {
        console.log('\n  Owner Notifications:');
        for (const n of notifs.slice(-10)) {
          console.log(`  ${n.read ? '○' : '●'} [${n.timestamp}] ${n.message}`);
          n.read = true;
        }
      }
      break;

    case 'exit':
    case 'quit':
      console.log('  Shutting down Drivera Agent System. Goodbye!');
      rl.close();
      process.exit(0);
      break;

    default:
      console.log(`  Unknown command: "${cmd}". Type "help" for available commands.`);
  }
}

// Start CLI
console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║       DRIVERA AI AGENT COORDINATOR — CLI            ║');
console.log('║   Type "help" for commands | "exit" to quit         ║');
console.log('║   Budget Rule: NO spending without YOUR approval    ║');
console.log('╚══════════════════════════════════════════════════════╝');

console.log(`\n  ${coordinator.listAgents().length} agents online and ready.`);

rl.prompt();
rl.on('line', async (line) => {
  await handleCommand(line);
  rl.prompt();
});
