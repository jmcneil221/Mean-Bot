/**
 * BudgetManager — ALL spending must be approved by the owner.
 * No agent can spend money autonomously.
 */
export class BudgetManager {
  constructor() {
    this.requests = new Map();
    this.approvedTotal = 0;
    this.spentTotal = 0;
    this.budget = null;            // owner-set cap (null = no cap, still requires approval)
    this.categories = new Map();   // track spending by category
  }

  /** Owner sets an overall budget cap */
  setBudget(amount) {
    this.budget = amount;
    return { budget: this.budget, message: `Budget cap set to $${amount}` };
  }

  /** Agent submits a spending request — always goes to owner */
  submitRequest(request) {
    request.status = 'pending_owner_approval';
    request.submittedAt = new Date().toISOString();
    this.requests.set(request.id, request);
    return {
      requestId: request.id,
      status: 'pending_owner_approval',
      message: `⚠️  OWNER APPROVAL REQUIRED: $${request.amount} requested by ${request.agentName} for "${request.purpose}"`,
      details: request,
    };
  }

  /** Owner approves a request */
  approve(requestId, ownerNotes = '') {
    const request = this.requests.get(requestId);
    if (!request) throw new Error(`Request ${requestId} not found`);
    if (request.status !== 'pending_owner_approval') {
      throw new Error(`Request ${requestId} is already ${request.status}`);
    }

    // Check budget cap
    if (this.budget !== null && (this.approvedTotal + request.amount) > this.budget) {
      return {
        approved: false,
        message: `Exceeds budget cap. Approved so far: $${this.approvedTotal}, Cap: $${this.budget}, Requested: $${request.amount}`,
      };
    }

    request.status = 'approved';
    request.approvedAt = new Date().toISOString();
    request.ownerNotes = ownerNotes;
    this.approvedTotal += request.amount;

    // Track category
    const cat = request.purpose || 'uncategorized';
    this.categories.set(cat, (this.categories.get(cat) || 0) + request.amount);

    return {
      approved: true,
      requestId,
      amount: request.amount,
      message: `✅ Approved: $${request.amount} for "${request.purpose}"`,
    };
  }

  /** Owner denies a request */
  deny(requestId, reason = '') {
    const request = this.requests.get(requestId);
    if (!request) throw new Error(`Request ${requestId} not found`);

    request.status = 'denied';
    request.deniedAt = new Date().toISOString();
    request.denyReason = reason;
    return {
      denied: true,
      requestId,
      message: `❌ Denied: $${request.amount} for "${request.purpose}" — ${reason || 'No reason given'}`,
    };
  }

  /** Mark approved spending as actually spent */
  recordSpending(requestId) {
    const request = this.requests.get(requestId);
    if (!request || request.status !== 'approved') {
      throw new Error(`Request ${requestId} is not approved`);
    }
    request.status = 'spent';
    request.spentAt = new Date().toISOString();
    this.spentTotal += request.amount;
    return { spent: request.amount, totalSpent: this.spentTotal };
  }

  /** Get all pending requests that need owner attention */
  getPendingRequests() {
    return [...this.requests.values()].filter(r => r.status === 'pending_owner_approval');
  }

  /** Full financial summary */
  getSummary() {
    const all = [...this.requests.values()];
    return {
      budgetCap: this.budget,
      approvedTotal: this.approvedTotal,
      spentTotal: this.spentTotal,
      remaining: this.budget !== null ? this.budget - this.approvedTotal : 'no cap set',
      pendingRequests: all.filter(r => r.status === 'pending_owner_approval').length,
      approvedRequests: all.filter(r => r.status === 'approved').length,
      deniedRequests: all.filter(r => r.status === 'denied').length,
      spentRequests: all.filter(r => r.status === 'spent').length,
      byCategory: Object.fromEntries(this.categories),
    };
  }
}
