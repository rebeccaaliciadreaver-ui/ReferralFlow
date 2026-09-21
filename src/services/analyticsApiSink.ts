import type { MarketingEventSink } from '../services/marketingAnalytics';
import type { MarketingEvent } from '../types/marketing';

export function createAnalyticsApiSink(
  fetchImpl: typeof fetch = fetch,
  endpoint = '/api/analytics/events',
): MarketingEventSink {
  return async (event: MarketingEvent) => {
    const idempotencyKey = event.idempotencyKey ?? `${event.name}:${event.occurredAt}:${crypto.randomUUID()}`;
    const response = await fetchImpl(endpoint, {
      method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': idempotencyKey },
      credentials: 'include', body: JSON.stringify({ ...event, idempotencyKey }),
    });
    if (!response.ok) throw new Error(`Analytics request failed (${response.status})`);
  };
}
