import type { AnalyticsEventRepository, PersistedMarketingEvent } from './analyticsEvents';

export class InMemoryAnalyticsRepository implements AnalyticsEventRepository {
  private readonly events = new Map<string, PersistedMarketingEvent>();
  async insert(event: PersistedMarketingEvent): Promise<boolean> {
    const key = `${event.userId}:${event.idempotencyKey ?? event.id}`;
    if (this.events.has(key)) return false;
    this.events.set(key, event); return true;
  }
  async countByNameSince(userId: string, eventName: PersistedMarketingEvent['name'], since: Date): Promise<number> {
    return [...this.events.values()].filter((event) => event.userId === userId && event.name === eventName && new Date(event.occurredAt) >= since).length;
  }
  all(): PersistedMarketingEvent[] { return [...this.events.values()]; }
}
