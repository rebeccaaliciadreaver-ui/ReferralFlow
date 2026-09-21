import type { MarketingEvent } from '../types/marketing';

export const ANALYTICS_EVENT_NAMES = [
  'user.signed_up',
  'challenge.completed',
  'referral.link_sent',
  'marketing.channel_engaged',
] as const;

export type AnalyticsEventName = typeof ANALYTICS_EVENT_NAMES[number];

export interface AuthenticatedUser {
  id: string;
}

export interface PersistedMarketingEvent extends MarketingEvent {
  id: string;
  userId: string;
  receivedAt: string;
}

export interface AnalyticsEventRepository {
  insert(event: PersistedMarketingEvent): Promise<boolean>;
  countByNameSince(userId: string, eventName: AnalyticsEventName, since: Date): Promise<number>;
}

export interface AnalyticsRequest {
  user: AuthenticatedUser | null;
  body: unknown;
}

export interface AnalyticsResponse {
  status: number;
  body: Record<string, unknown>;
}

export function isAnalyticsEventName(value: unknown): value is AnalyticsEventName {
  return typeof value === 'string' && (ANALYTICS_EVENT_NAMES as readonly string[]).includes(value);
}

export function validateMarketingEvent(body: unknown): Pick<MarketingEvent, 'name' | 'channel' | 'occurredAt' | 'metadata'> {
  if (!body || typeof body !== 'object') throw new Error('Request body must be an object');
  const event = body as Record<string, unknown>;
  if (!isAnalyticsEventName(event.name)) throw new Error('Unsupported analytics event');
  if (typeof event.occurredAt !== 'string' || Number.isNaN(Date.parse(event.occurredAt))) throw new Error('occurredAt must be an ISO date');
  if (event.metadata !== undefined && (!event.metadata || typeof event.metadata !== 'object' || Array.isArray(event.metadata))) throw new Error('metadata must be an object');
  return {
    name: event.name,
    occurredAt: event.occurredAt,
    channel: typeof event.channel === 'string' ? event.channel as MarketingEvent['channel'] : undefined,
    metadata: event.metadata as MarketingEvent['metadata'],
  };
}

export async function postAnalyticsEvent(request: AnalyticsRequest, repository: AnalyticsEventRepository): Promise<AnalyticsResponse> {
  if (!request.user) return { status: 401, body: { error: 'Authentication required' } };
  try {
    const event = validateMarketingEvent(request.body);
    const accepted = await repository.insert({
      ...event,
      id: crypto.randomUUID(),
      userId: request.user.id,
      receivedAt: new Date().toISOString(),
    });
    return { status: accepted ? 201 : 200, body: { accepted, duplicate: !accepted } };
  } catch (error) {
    return { status: 400, body: { error: error instanceof Error ? error.message : 'Invalid event' } };
  }
}

export function startOfWeek(now = new Date()): Date {
  const start = new Date(now);
  const daysSinceMonday = (start.getDay() + 6) % 7;
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - daysSinceMonday);
  return start;
}
