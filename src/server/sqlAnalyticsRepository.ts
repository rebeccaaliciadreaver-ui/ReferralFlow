import type { AnalyticsEventName, AnalyticsEventRepository, PersistedMarketingEvent } from './analyticsEvents';

export interface SqlResult { rowCount?: number; rows?: Array<{ count?: string | number }>; }
export type SqlQuery = (sql: string, params: unknown[]) => Promise<SqlResult>;

/** Framework- and driver-neutral repository. Supply your database client's query function. */
export class SqlAnalyticsRepository implements AnalyticsEventRepository {
  constructor(private readonly query: SqlQuery) {}

  async insert(event: PersistedMarketingEvent): Promise<boolean> {
    const result = await this.query(
      `insert into marketing_events
        (id, user_id, name, channel, occurred_at, received_at, metadata, idempotency_key)
       values ($1, $2, $3, $4, $5, $6, $7, $8)
       on conflict (user_id, idempotency_key) do nothing`,
      [event.id, event.userId, event.name, event.channel ?? null, event.occurredAt,
        event.receivedAt, event.metadata ? JSON.stringify(event.metadata) : null, event.idempotencyKey],
    );
    return (result.rowCount ?? 0) > 0;
  }

  async countByNameSince(userId: string, eventName: AnalyticsEventName, since: Date): Promise<number> {
    const result = await this.query(
      'select count(*) as count from marketing_events where user_id = $1 and name = $2 and occurred_at >= $3',
      [userId, eventName, since.toISOString()],
    );
    return Number(result.rows?.[0]?.count ?? 0);
  }
}
