import type {
  Automation, AutomationAction, AutomationEvent, AutomationLog, AutomationStore, JsonValue,
} from '../types/automation';

const id = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const get = (data: Record<string, JsonValue>, path: string): JsonValue | undefined =>
  path.split('.').reduce<JsonValue | undefined>((value, key) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
    return (value as Record<string, JsonValue>)[key];
  }, data);

export function matchesCondition(value: JsonValue | undefined, operator: AutomationAction extends never ? never : string, expected: JsonValue): boolean {
  switch (operator) {
    case 'equals': return value === expected;
    case 'not_equals': return value !== expected;
    case 'greater_than': return typeof value === 'number' && typeof expected === 'number' && value > expected;
    case 'less_than': return typeof value === 'number' && typeof expected === 'number' && value < expected;
    case 'contains':
      return typeof value === 'string' && typeof expected === 'string' ? value.includes(expected) : Array.isArray(value) ? value.includes(expected) : false;
    default: return false;
  }
}

export class AutomationEngine {
  constructor(private readonly store: AutomationStore) {}

  async process(event: AutomationEvent): Promise<AutomationLog[]> {
    const candidates = this.store.automations.filter((automation) =>
      automation.enabled && automation.trigger.event === event.event &&
      (!automation.trigger.entity || automation.trigger.entity === event.entity));

    return Promise.all(candidates.map((automation) => this.run(automation, event)));
  }

  private async run(automation: Automation, event: AutomationEvent): Promise<AutomationLog> {
    const now = new Date().toISOString();
    const passes = automation.conditions.every((condition) =>
      matchesCondition(get(event.data, condition.field), condition.operator, condition.value));
    const log: AutomationLog = {
      id: id('log'), automationId: automation.id, event: event.event, entityId: event.entityId,
      status: passes ? 'success' : 'skipped',
      message: passes ? `Executed ${automation.action.type}` : 'Conditions did not match', createdAt: now,
    };
    if (passes) {
      try {
        this.executeAction(automation.action, event);
        automation.runCount += 1;
        automation.updatedAt = now;
      } catch (error) {
        log.status = 'failed';
        log.message = error instanceof Error ? error.message : 'Action failed';
      }
    }
    this.store.logs.unshift(log);
    return log;
  }

  private executeAction(action: Automation['action'], event: AutomationEvent): void {
    const entity = event.entityId ? (this.store.entities[event.entityId] ??= {}) : undefined;
    switch (action.type) {
      case 'award_lp': entity && (entity.lp = Number(entity.lp ?? 0) + action.amount); break;
      case 'send_inbox_message': entity && (entity.lastInboxMessage = action.message); break;
      case 'update_entity_status': entity && (entity.status = action.status); break;
      case 'create_referral': entity && (entity.lastReferredUserId = action.referredUserId); break;
      default: throw new Error(`Unsupported action: ${(action as { type: string }).type}`);
    }
  }
}
