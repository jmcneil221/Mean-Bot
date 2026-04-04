/**
 * TaskManager — creates, tracks, and routes tasks across agents.
 */
export class TaskManager {
  constructor() {
    this.tasks = new Map();
    this.taskCounter = 0;
  }

  createTask({ title, description, assignTo, priority = 'normal', requiredCapabilities = [], dependencies = [], estimatedBudget = null }) {
    this.taskCounter++;
    const task = {
      id: `task_${this.taskCounter}_${Date.now()}`,
      title,
      description,
      assignTo,
      priority,            // low | normal | high | critical
      requiredCapabilities,
      dependencies,
      estimatedBudget,
      status: 'created',   // created | queued | in_progress | waiting_approval | completed | failed
      createdAt: new Date().toISOString(),
      assignedAt: null,
      startedAt: null,
      completedAt: null,
      result: null,
      subtasks: [],
    };
    this.tasks.set(task.id, task);
    return task;
  }

  getTask(taskId) {
    return this.tasks.get(taskId);
  }

  updateTask(taskId, updates) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    Object.assign(task, updates);
    return task;
  }

  /** Break a task into subtasks */
  decompose(parentTaskId, subtaskDefs) {
    const parent = this.tasks.get(parentTaskId);
    if (!parent) throw new Error(`Parent task ${parentTaskId} not found`);

    const subtasks = subtaskDefs.map(def => {
      const sub = this.createTask({ ...def, dependencies: [parentTaskId] });
      parent.subtasks.push(sub.id);
      return sub;
    });
    return subtasks;
  }

  /** Get all tasks matching a filter */
  query(filter = {}) {
    let results = [...this.tasks.values()];
    if (filter.status) results = results.filter(t => t.status === filter.status);
    if (filter.assignTo) results = results.filter(t => t.assignTo === filter.assignTo);
    if (filter.priority) results = results.filter(t => t.priority === filter.priority);
    return results;
  }

  /** Dashboard summary */
  getSummary() {
    const all = [...this.tasks.values()];
    return {
      total: all.length,
      created: all.filter(t => t.status === 'created').length,
      inProgress: all.filter(t => t.status === 'in_progress').length,
      completed: all.filter(t => t.status === 'completed').length,
      failed: all.filter(t => t.status === 'failed').length,
      waitingApproval: all.filter(t => t.status === 'waiting_approval').length,
      totalEstimatedBudget: all.reduce((sum, t) => sum + (t.estimatedBudget || 0), 0),
    };
  }
}
