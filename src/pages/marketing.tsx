import { useMemo, useState } from 'react';
import { getKpiSnapshots, trackMarketingEvent } from '../services/marketingAnalytics';
import { marketingChannels, marketingKpis } from '../types/marketing';
import type { MarketingEvent, UserProfile } from '../types/marketing';
import type { MarketingEventSink } from '../services/marketingAnalytics';

interface Props { profile: UserProfile; initialEvents?: MarketingEvent[]; onEvent?: MarketingEventSink; }

export default function MarketingPage({ profile, initialEvents = [], onEvent }: Props) {
  const [events, setEvents] = useState(initialEvents);
  const snapshots = useMemo(() => getKpiSnapshots(events, marketingKpis), [events]);
  const track = (event: string, channel?: MarketingEvent['channel']) => setEvents((current) => trackMarketingEvent(current, event, channel, undefined, onEvent));

  return <main style={{ maxWidth: 1100, margin: '0 auto', padding: 32, color: '#eef2ff', background: '#101329', minHeight: '100vh', fontFamily: 'system-ui' }}>
    <header><p style={{ color: '#9d8cff', fontWeight: 700 }}>REFERRALFLOW / GROWTH</p><h1>Welcome, {profile.displayName}</h1><p style={{ color: '#aab1d6' }}>Your marketing plan and weekly growth targets in one place.</p></header>
    <section aria-label="Weekly KPIs" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, margin: '28px 0' }}>
      {snapshots.map(({ kpi, value, percentage }) => <article key={kpi.id} style={{ background: '#191d3b', borderRadius: 12, padding: 18 }}><small style={{ color: '#aab1d6' }}>{kpi.label}</small><strong style={{ display: 'block', fontSize: 28, margin: '8px 0' }}>{value} / {kpi.target}</strong><progress value={percentage} max={100} style={{ width: '100%' }} /><button onClick={() => track(kpi.event)} style={{ marginTop: 12 }}>Track one</button></article>)}
    </section>
    <h2>Channels ranked by payoff</h2>
    {marketingChannels.map((channel) => <article key={channel.id} style={{ background: '#191d3b', borderRadius: 12, padding: 18, margin: '12px 0', display: 'flex', justifyContent: 'space-between', gap: 20 }}><div><strong>{channel.name}</strong><p style={{ color: '#aab1d6' }}>{channel.description}</p><small>{channel.priority.replace('_', ' ').toUpperCase()} · {channel.payoff}</small></div><button onClick={() => track('marketing.channel_engaged', channel.id)}>Track activity</button></article>)}
    <p style={{ color: '#aab1d6', marginTop: 28 }}>Targets reset automatically at the start of each week. Provide <code>onEvent</code> to persist events through your authenticated API or analytics provider.</p>
  </main>;
}
