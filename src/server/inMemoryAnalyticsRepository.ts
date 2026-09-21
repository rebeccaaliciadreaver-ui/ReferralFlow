import type { AnalyticsEventRepository, PersistedMarketingEvent } from './analyticsEvents';

/** Development adapter. Replace with a database implementation in production. */
export class InMemoryAnalyticsRepository implements AnalyticsEventRepository {
  private readonly events = new Map<string, PersistedMarketingEvent>();

  async insert(event: PersistedMarketingEvent): Promise<boolean> {
    if (this.events.has(event.id)) return false;
    this.events.set(event.id, event);
    return true;
  }

  async countByNameSince(userId: string, eventName: PersistedMarketingEvent['name'], since: Date): Promise<number> {
    return [...this.events.values()].filter((event) => event.userId === userId && event.name === eventName && new Date(event.occurredAt) >= since).length;
  }

  all(): PersistedMarketingEvent[] {
    return [...this.events.values()];
  }
}
