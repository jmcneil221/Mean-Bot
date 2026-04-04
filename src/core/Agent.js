/**
 * Base Agent class — all specialist agents extend this.
 * Provides identity, messaging, task handling, and budget-request capabilities.
 */
export class Agent {
  constructor({ name, role, expertise, capabilities }) {
    this.id = `agent_${name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    this.name = name;
    this.role = role;
    this.expertise = expertise;
    this.capabilities = capabilities || [];
    this.status = 'idle';          // idle | working | waiting_approval | blocked
    this.taskQueue = [];
    this.completedTasks = [];
    this.messages = [];
    this.createdAt = new Date().toISOString();
  }

  /** Receive a task from the coordinator */
  receiveTask(task) {
    task.assignedAt = new Date().toISOString();
    task.status = 'queued';
    this.taskQueue.push(task);
    this.log(`Received task: ${task.title}`);
    return { accepted: true, taskId: task.id };
  }

  /** Process the next task in queue */
  async processNextTask() {
    if (this.taskQueue.length === 0) {
      return { status: 'idle', message: 'No tasks in queue' };
    }

    const task = this.taskQueue.shift();
    this.status = 'working';
    task.status = 'in_progress';
    task.startedAt = new Date().toISOString();
    this.log(`Started working on: ${task.title}`);

    try {
      const result = await this.executeTask(task);
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
      task.result = result;
      this.completedTasks.push(task);
      this.status = 'idle';
      this.log(`Completed: ${task.title}`);
      return { status: 'completed', task, result };
    } catch (error) {
      task.status = 'failed';
      task.error = error.message;
      this.status = 'idle';
      this.log(`Failed: ${task.title} — ${error.message}`);
      return { status: 'failed', task, error: error.message };
    }
  }

  /** Override in subclass to handle domain-specific logic */
  async executeTask(task) {
    return {
      agent: this.name,
      task: task.title,
      output: `Processed by ${this.name}`,
      recommendations: [],
    };
  }

  /** Request budget approval — routed through coordinator */
  createBudgetRequest({ amount, currency = 'USD', purpose, vendor, recurring = false }) {
    const request = {
      id: `budget_${Date.now()}`,
      agentName: this.name,
      agentId: this.id,
      amount,
      currency,
      purpose,
      vendor,
      recurring,
      status: 'pending_owner_approval',
      createdAt: new Date().toISOString(),
    };
    this.status = 'waiting_approval';
    this.log(`Budget request: $${amount} for "${purpose}"`);
    return request;
  }

  /** Send a message to another agent via the coordinator */
  sendMessage(toAgentName, content, priority = 'normal') {
    const message = {
      id: `msg_${Date.now()}`,
      from: this.name,
      to: toAgentName,
      content,
      priority,
      timestamp: new Date().toISOString(),
    };
    this.messages.push(message);
    return message;
  }

  /** Receive a message */
  receiveMessage(message) {
    this.messages.push({ ...message, received: true });
    this.log(`Message from ${message.from}: ${message.content.substring(0, 80)}...`);
  }

  /** Get agent status summary */
  getStatus() {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      status: this.status,
      pendingTasks: this.taskQueue.length,
      completedTasks: this.completedTasks.length,
      unreadMessages: this.messages.filter(m => m.received && !m.read).length,
    };
  }

  /** Internal logging */
  log(message) {
    const entry = `[${new Date().toISOString()}] [${this.name}] ${message}`;
    if (typeof this.onLog === 'function') this.onLog(entry);
    return entry;
  }
}
