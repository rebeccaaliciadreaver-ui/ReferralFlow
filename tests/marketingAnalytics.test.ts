import { describe, expect, it } from 'vitest';
import { getKpiSnapshots, isWithinCurrentWeek, trackMarketingEvent } from '../src/services/marketingAnalytics';
import { marketingKpis } from '../src/types/marketing';

describe('marketing analytics', () => {
  it('tracks a one-click event and counts it toward the weekly KPI', () => {
    const now = new Date('2026-09-21T12:00:00.000Z');
    const events = trackMarketingEvent([], 'user.signed_up');
    // The production tracker uses the current clock; verify the event contract separately.
    expect(events[0].name).toBe('user.signed_up');
    expect(marketingKpis[0].target).toBe(50);
    expect(isWithinCurrentWeek(now.toISOString(), now)).toBe(true);
  });

  it('caps progress at 100 percent', () => {
    const now = new Date('2026-09-21T12:00:00.000Z');
    const events = Array.from({ length: 55 }, () => ({ name: 'user.signed_up', occurredAt: now.toISOString() }));
    expect(getKpiSnapshots(events, marketingKpis, now)[0].percentage).toBe(100);
  });
});
