/**
 * MessageBus — handles inter-agent communication.
 * All messages are routed through the coordinator for visibility.
 */
export class MessageBus {
  constructor() {
    this.messages = [];
    this.subscribers = new Map();  // agentName -> callback
    this.channels = new Map();     // channel -> Set<agentName>
  }

  /** Register an agent to receive messages */
  register(agentName, callback) {
    this.subscribers.set(agentName, callback);
  }

  /** Subscribe an agent to a channel (e.g., "design", "security", "all") */
  subscribe(agentName, channel) {
    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());
    }
    this.channels.get(channel).add(agentName);
  }

  /** Send a direct message between agents */
  send(message) {
    this.messages.push(message);

    const callback = this.subscribers.get(message.to);
    if (callback) {
      callback(message);
      return { delivered: true, messageId: message.id };
    }
    return { delivered: false, messageId: message.id, reason: 'Recipient not registered' };
  }

  /** Broadcast to all agents on a channel */
  broadcast(fromAgent, channel, content, priority = 'normal') {
    const subscribers = this.channels.get(channel) || new Set();
    const message = {
      id: `broadcast_${Date.now()}`,
      from: fromAgent,
      channel,
      content,
      priority,
      timestamp: new Date().toISOString(),
    };
    this.messages.push(message);

    let delivered = 0;
    for (const agentName of subscribers) {
      if (agentName === fromAgent) continue;
      const callback = this.subscribers.get(agentName);
      if (callback) {
        callback({ ...message, to: agentName });
        delivered++;
      }
    }
    return { delivered, total: subscribers.size - 1, messageId: message.id };
  }

  /** Get message history with optional filters */
  getHistory(filter = {}) {
    let results = [...this.messages];
    if (filter.from) results = results.filter(m => m.from === filter.from);
    if (filter.to) results = results.filter(m => m.to === filter.to);
    if (filter.channel) results = results.filter(m => m.channel === filter.channel);
    if (filter.since) results = results.filter(m => new Date(m.timestamp) >= new Date(filter.since));
    return results;
  }
}
