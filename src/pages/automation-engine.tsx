import { useMemo, useState } from 'react';
import { AutomationEngineDashboard } from '../components/AutomationEngineDashboard';
import { AutomationEngine } from '../services/automationEngine';
import type { Automation, AutomationStore } from '../types/automation';

const now = new Date().toISOString();
export const exampleAutomations: Automation[] = [{ id: 'bonus-challenge', name: 'Bonus LP on Challenge Complete', enabled: true, trigger: { event: 'challenge.completed', entity: 'challenge' }, conditions: [{ field: 'completed', operator: 'equals', value: true }], action: { type: 'award_lp', amount: 25, reason: 'Challenge completion' }, runCount: 0, createdAt: now, updatedAt: now }];

export default function AutomationEnginePage() {
  const [store, setStore] = useState<AutomationStore>({ automations: exampleAutomations, logs: [], entities: {} });
  const engine = useMemo(() => new AutomationEngine(store), [store]);
  const toggle = (id: string) => setStore((current) => ({ ...current, automations: current.automations.map((a) => a.id === id ? { ...a, enabled: !a.enabled } : a) }));
  return <AutomationEngineDashboard automations={store.automations} logs={store.logs} onToggle={toggle} />;
}
