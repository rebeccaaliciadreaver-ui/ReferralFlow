import type { Automation, AutomationLog } from '../types/automation';

interface Props { automations: Automation[]; logs: AutomationLog[]; onToggle?: (id: string) => void; }
const statusColor: Record<string, string> = { success: '#55e6a5', skipped: '#ffd166', failed: '#ff6b8a' };

export function AutomationEngineDashboard({ automations, logs, onToggle }: Props) {
  const successful = logs.filter((log) => log.status === 'success').length;
  return <main style={{ maxWidth: 1100, margin: '0 auto', padding: 32, color: '#eef2ff', background: '#101329', minHeight: '100vh', fontFamily: 'system-ui' }}>
    <header><p style={{ color: '#9d8cff', fontWeight: 700 }}>REFERRALFLOW / AUTOMATION</p><h1>Automation Engine</h1><p style={{ color: '#aab1d6' }}>Six subsystems working together to turn product events into growth loops.</p></header>
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, margin: '28px 0' }}>
      {[['Active rules', automations.filter((a) => a.enabled).length], ['Total runs', automations.reduce((n, a) => n + a.runCount, 0)], ['Successful', successful], ['Execution logs', logs.length]].map(([label, value]) => <div key={String(label)} style={{ background: '#191d3b', borderRadius: 12, padding: 18 }}><small style={{ color: '#aab1d6' }}>{label}</small><strong style={{ display: 'block', fontSize: 28, marginTop: 8 }}>{value}</strong></div>)}
    </section>
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>{['Trigger Detection', 'Context Analysis', 'Decision Logic', 'Action Execution', 'State Sync', 'Logging & Analytics'].map((name) => <div key={name} style={{ padding: 16, border: '1px solid #30365c', borderRadius: 10 }}><strong>{name}</strong><p style={{ color: '#aab1d6', marginBottom: 0 }}>Operational</p></div>)}</section>
    <h2>Automation rules</h2>
    {automations.map((automation) => <article key={automation.id} style={{ background: '#191d3b', padding: 18, borderRadius: 12, margin: '12px 0', display: 'flex', justifyContent: 'space-between' }}><div><strong>{automation.name}</strong><p style={{ color: '#aab1d6', margin: '6px 0' }}>When <code>{automation.trigger.event}</code> → <code>{automation.action.type}</code></p><small>{automation.runCount} runs</small></div><button onClick={() => onToggle?.(automation.id)}>{automation.enabled ? 'Enabled' : 'Disabled'}</button></article>)}
    <h2>Recent execution logs</h2>{logs.slice(0, 10).map((log) => <div key={log.id} style={{ padding: 10, borderBottom: '1px solid #30365c' }}><span style={{ color: statusColor[log.status], fontWeight: 700 }}>{log.status.toUpperCase()}</span> — {log.message} <small style={{ color: '#aab1d6' }}>{new Date(log.createdAt).toLocaleString()}</small></div>)}
  </main>;
}
