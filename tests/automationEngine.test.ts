import { describe, expect, it } from 'vitest';
import { AutomationEngine, matchesCondition } from '../src/services/automationEngine';
import type { AutomationStore } from '../src/types/automation';

describe('automation engine', () => {
  it('evaluates supported conditions', () => {
    expect(matchesCondition('challenge completed', 'contains', 'completed')).toBe(true);
    expect(matchesCondition(10, 'greater_than', 5)).toBe(true);
    expect(matchesCondition(10, 'less_than', 5)).toBe(false);
  });

  it('runs a matching rule and updates entity state and logs', async () => {
    const store: AutomationStore = { automations: [{ id: 'a1', name: 'Award', enabled: true, trigger: { event: 'challenge.completed' }, conditions: [{ field: 'completed', operator: 'equals', value: true }], action: { type: 'award_lp', amount: 25 }, runCount: 0, createdAt: '', updatedAt: '' }], logs: [], entities: { user1: { lp: 10 } } };
    const logs = await new AutomationEngine(store).process({ event: 'challenge.completed', entityId: 'user1', data: { completed: true } });
    expect(logs[0].status).toBe('success');
    expect(store.entities.user1.lp).toBe(35);
    expect(store.automations[0].runCount).toBe(1);
  });

  it('skips rules when conditions do not match', async () => {
    const store: AutomationStore = { automations: [{ id: 'a1', name: 'Award', enabled: true, trigger: { event: 'challenge.completed' }, conditions: [{ field: 'completed', operator: 'equals', value: true }], action: { type: 'award_lp', amount: 25 }, runCount: 0, createdAt: '', updatedAt: '' }], logs: [], entities: {} };
    const [log] = await new AutomationEngine(store).process({ event: 'challenge.completed', data: { completed: false } });
    expect(log.status).toBe('skipped');
    expect(store.automations[0].runCount).toBe(0);
  });
});
