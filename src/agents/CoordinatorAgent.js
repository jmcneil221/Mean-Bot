import { Agent } from '../core/Agent.js';

/**
 * CoordinatorAgent — The boss. Oversees all other agents.
 *
 * Responsibilities:
 * - Receives high-level goals and decomposes them into tasks
 * - Routes tasks to the right specialist agent
 * - Enforces budget approval (NOTHING is spent without owner say-so)
 * - Monitors progress across all agents
 * - Resolves conflicts and dependencies between agents
 * - Reports status back to the owner
 */
export class CoordinatorAgent extends Agent {
  constructor() {
    super({
      name: 'Coordinator',
      role: 'Project Coordinator & Overseer',
      expertise: [
        'project management',
        'task decomposition',
        'resource allocation',
        'budget gatekeeping',
        'cross-team coordination',
        'risk assessment',
      ],
      capabilities: [
        'decompose_goals',
        'assign_tasks',
        'monitor_progress',
        'enforce_budget',
        'resolve_conflicts',
        'generate_reports',
      ],
    });

    this.agents = new Map();
    this.budgetManager = null;
    this.taskManager = null;
    this.messageBus = null;
    this.ownerNotifications = [];
  }

  /** Register the core systems */
  initialize({ budgetManager, taskManager, messageBus }) {
    this.budgetManager = budgetManager;
    this.taskManager = taskManager;
    this.messageBus = messageBus;

    // Register self on the message bus
    this.messageBus.register(this.name, (msg) => this.receiveMessage(msg));
    this.messageBus.subscribe(this.name, 'all');
    this.messageBus.subscribe(this.name, 'coordinator');

    this.log('Coordinator initialized with all core systems');
  }

  /** Register a specialist agent under coordination */
  registerAgent(agent) {
    this.agents.set(agent.name, agent);

    // Wire agent into the message bus
    this.messageBus.register(agent.name, (msg) => agent.receiveMessage(msg));
    this.messageBus.subscribe(agent.name, 'all');
    this.messageBus.subscribe(agent.name, agent.role.toLowerCase().replace(/\s+/g, '_'));

    // Give agent a logging callback
    agent.onLog = (entry) => this.agentLog(agent.name, entry);

    this.log(`Registered agent: ${agent.name} (${agent.role})`);
    return { registered: true, agentName: agent.name };
  }

  /** Decompose a high-level goal into tasks and assign to agents */
  planProject(goal) {
    this.log(`Planning project: ${goal.title}`);

    const plan = {
      id: `plan_${Date.now()}`,
      goal: goal.title,
      description: goal.description,
      phases: [],
      createdAt: new Date().toISOString(),
    };

    // Phase 1: Research & Analysis
    plan.phases.push({
      name: 'Research & Analysis',
      tasks: [
        { title: 'Market & competitor research', assignTo: 'Researcher', priority: 'high' },
        { title: 'Competitive landscape analysis', assignTo: 'Competitive Analyst', priority: 'high' },
        { title: 'Legal requirements analysis', assignTo: 'Legal Advisor', priority: 'high' },
        { title: 'Security threat assessment', assignTo: 'Security Expert', priority: 'high' },
      ],
    });

    // Phase 2: Design & Architecture
    plan.phases.push({
      name: 'Design & Architecture',
      tasks: [
        { title: 'Brand identity & graphic design', assignTo: 'Graphic Designer', priority: 'high' },
        { title: 'Site layout & wireframes', assignTo: 'Layout Specialist', priority: 'high' },
        { title: 'UX research & user flows', assignTo: 'UX Specialist', priority: 'high' },
        { title: 'API architecture design', assignTo: 'API Architect', priority: 'high' },
      ],
    });

    // Phase 3: Development & Implementation
    plan.phases.push({
      name: 'Development & Implementation',
      tasks: [
        { title: 'API development & integration', assignTo: 'API Architect', priority: 'high' },
        { title: 'Frontend implementation', assignTo: 'Layout Specialist', priority: 'high' },
        { title: 'Security implementation', assignTo: 'Security Expert', priority: 'high' },
        { title: 'DevOps & deployment pipeline', assignTo: 'DevOps Engineer', priority: 'normal' },
      ],
    });

    // Phase 4: Quality & Launch
    plan.phases.push({
      name: 'Quality & Launch',
      tasks: [
        { title: 'QA testing & bug tracking', assignTo: 'QA Tester', priority: 'high' },
        { title: 'Legal documents & user agreements', assignTo: 'Legal Advisor', priority: 'high' },
        { title: 'Analytics setup & tracking', assignTo: 'Analytics Specialist', priority: 'normal' },
        { title: 'Content strategy & copywriting', assignTo: 'Content Strategist', priority: 'normal' },
        { title: 'Performance & security audit', assignTo: 'Security Expert', priority: 'critical' },
      ],
    });

    return plan;
  }

  /** Assign a task — creates it in TaskManager and sends to the agent */
  assignTask(taskDef) {
    const task = this.taskManager.createTask(taskDef);

    // Check if budget approval is needed
    if (task.estimatedBudget && task.estimatedBudget > 0) {
      task.status = 'waiting_approval';
      const agent = this.agents.get(task.assignTo);
      if (agent) {
        const budgetReq = agent.createBudgetRequest({
          amount: task.estimatedBudget,
          purpose: task.title,
          vendor: taskDef.vendor || 'TBD',
        });
        const result = this.budgetManager.submitRequest(budgetReq);
        this.notifyOwner(result.message);
        return { task, budgetRequest: result };
      }
    }

    // No budget needed — assign directly
    const agent = this.agents.get(task.assignTo);
    if (agent) {
      agent.receiveTask(task);
      this.log(`Assigned "${task.title}" to ${task.assignTo}`);
    } else {
      this.log(`WARNING: No agent named "${task.assignTo}" — task unassigned`);
    }
    return { task };
  }

  /** Route a budget request to the owner — NEVER auto-approve */
  handleBudgetRequest(request) {
    const result = this.budgetManager.submitRequest(request);
    this.notifyOwner(result.message);
    return result;
  }

  /** Send a notification to the owner */
  notifyOwner(message) {
    const notification = {
      id: `notify_${Date.now()}`,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    this.ownerNotifications.push(notification);
    return notification;
  }

  /** Owner approves spending */
  ownerApproveBudget(requestId, notes = '') {
    return this.budgetManager.approve(requestId, notes);
  }

  /** Owner denies spending */
  ownerDenyBudget(requestId, reason = '') {
    return this.budgetManager.deny(requestId, reason);
  }

  /** Get full system dashboard */
  getDashboard() {
    const agentStatuses = {};
    for (const [name, agent] of this.agents) {
      agentStatuses[name] = agent.getStatus();
    }

    return {
      coordinator: this.getStatus(),
      agents: agentStatuses,
      tasks: this.taskManager.getSummary(),
      budget: this.budgetManager.getSummary(),
      pendingApprovals: this.budgetManager.getPendingRequests(),
      unreadNotifications: this.ownerNotifications.filter(n => !n.read).length,
      notifications: this.ownerNotifications.slice(-10),
    };
  }

  /** Get all registered agents */
  listAgents() {
    return [...this.agents.entries()].map(([name, agent]) => ({
      name,
      role: agent.role,
      expertise: agent.expertise,
      status: agent.status,
      capabilities: agent.capabilities,
    }));
  }

  /** Track agent logs centrally */
  agentLog(agentName, entry) {
    // Could persist to file, database, etc.
  }
}
