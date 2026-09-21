import type { MarketingEvent, MarketingKpi } from '../types/marketing';

export interface KpiSnapshot {
  kpi: MarketingKpi;
  value: number;
  percentage: number;
}

/** Persistence boundary for production analytics providers or API clients. */
export type MarketingEventSink = (event: MarketingEvent) => void | Promise<void>;

export function isWithinCurrentWeek(timestamp: string, now = new Date()): boolean {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return false;
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

export function createMarketingEvent(
  name: string,
  channel?: MarketingEvent['channel'],
  metadata?: MarketingEvent['metadata'],
  occurredAt = new Date().toISOString(),
): MarketingEvent {
  return { name, channel, metadata, occurredAt };
}

/** Adds an event locally and forwards it to an optional durable sink. */
export function trackMarketingEvent(
  events: MarketingEvent[],
  name: string,
  channel?: MarketingEvent['channel'],
  metadata?: MarketingEvent['metadata'],
  sink?: MarketingEventSink,
): MarketingEvent[] {
  const event = createMarketingEvent(name, channel, metadata);
  void sink?.(event);
  return [event, ...events];
}
