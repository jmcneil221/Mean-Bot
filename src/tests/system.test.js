import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { createCarbuyinghubSystem } from '../index.js';

describe('Carbuyinghub Agent Coordinator System', () => {
  let system;

  before(() => {
    system = createCarbuyinghubSystem();
  });

  it('should initialize with coordinator and 12 agents', () => {
    const agents = system.coordinator.listAgents();
    assert.equal(agents.length, 12);
  });

  it('should have all required specialist agents', () => {
    const names = system.coordinator.listAgents().map(a => a.name);
    const required = [
      'Graphic Designer', 'Layout Specialist', 'API Architect',
      'Researcher', 'Competitive Analyst', 'Security Expert',
      'Legal Advisor', 'UX Specialist', 'DevOps Engineer',
      'Analytics Specialist', 'Content Strategist', 'QA Tester',
    ];
    for (const name of required) {
      assert.ok(names.includes(name), `Missing agent: ${name}`);
    }
  });

  it('should generate a project plan with 4 phases', () => {
    const plan = system.coordinator.planProject({
      title: 'Test Project',
      description: 'Testing the planning system',
    });
    assert.equal(plan.phases.length, 4);
    assert.ok(plan.phases[0].tasks.length > 0);
  });

  it('should block spending without owner approval', () => {
    const agent = system.coordinator.agents.get('Graphic Designer');
    const request = agent.createBudgetRequest({
      amount: 500,
      purpose: 'Design tools license',
      vendor: 'Figma',
    });
    const result = system.budgetManager.submitRequest(request);
    assert.equal(result.status, 'pending_owner_approval');
  });

  it('should allow owner to approve budget requests', () => {
    const agent = system.coordinator.agents.get('Security Expert');
    const request = agent.createBudgetRequest({
      amount: 100,
      purpose: 'Security scanning tool',
      vendor: 'Snyk',
    });
    system.budgetManager.submitRequest(request);
    const approval = system.budgetManager.approve(request.id);
    assert.equal(approval.approved, true);
  });

  it('should allow owner to deny budget requests', () => {
    const agent = system.coordinator.agents.get('Content Strategist');
    const request = agent.createBudgetRequest({
      amount: 2000,
      purpose: 'Premium stock photos',
      vendor: 'Getty Images',
    });
    system.budgetManager.submitRequest(request);
    const denial = system.budgetManager.deny(request.id, 'Too expensive, use free alternatives');
    assert.equal(denial.denied, true);
  });

  it('should enforce budget cap', () => {
    system.budgetManager.setBudget(1000);
    const agent = system.coordinator.agents.get('DevOps Engineer');
    const request = agent.createBudgetRequest({
      amount: 5000,
      purpose: 'Cloud infrastructure',
      vendor: 'AWS',
    });
    system.budgetManager.submitRequest(request);
    const result = system.budgetManager.approve(request.id);
    assert.equal(result.approved, false);
  });

  it('should assign and process tasks', async () => {
    const task = system.coordinator.assignTask({
      title: 'Design Carbuyinghub Logo',
      assignTo: 'Graphic Designer',
      priority: 'high',
    });
    assert.ok(task.task.id);

    const agent = system.coordinator.agents.get('Graphic Designer');
    const result = await agent.processNextTask();
    assert.equal(result.status, 'completed');
  });

  it('should deliver messages between agents', () => {
    const msg = system.messageBus.broadcast('Coordinator', 'all', 'Project kickoff meeting at 9 AM');
    assert.ok(msg.delivered > 0);
  });

  it('should provide a complete system dashboard', () => {
    const dashboard = system.coordinator.getDashboard();
    assert.ok(dashboard.coordinator);
    assert.ok(dashboard.agents);
    assert.ok(dashboard.tasks);
    assert.ok(dashboard.budget);
  });
});
