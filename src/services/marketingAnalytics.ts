import type { MarketingEvent, MarketingKpi } from '../types/marketing';

export interface KpiSnapshot {
  kpi: MarketingKpi;
  value: number;
  percentage: number;
}

export function isWithinCurrentWeek(timestamp: string, now = new Date()): boolean {
  const date = new Date(timestamp);
  const start = new Date(now);
  const day = start.getDay();
  const daysSinceMonday = (day + 6) % 7;
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - daysSinceMonday);
  return date >= start && date <= now;
}

export function getKpiSnapshots(events: MarketingEvent[], kpis: MarketingKpi[], now = new Date()): KpiSnapshot[] {
  return kpis.map((kpi) => {
    const value = events.filter((event) => event.name === kpi.event && isWithinCurrentWeek(event.occurredAt, now)).length;
    return { kpi, value, percentage: Math.min(100, Math.round((value / kpi.target) * 100)) };
  });
}

export function trackMarketingEvent(
  events: MarketingEvent[],
  name: string,
  channel?: MarketingEvent['channel'],
  metadata?: MarketingEvent['metadata'],
): MarketingEvent[] {
  return [{ name, channel, metadata, occurredAt: new Date().toISOString() }, ...events];
}
