import { postAnalyticsEvent, startOfWeek } from './analyticsEvents';
import type { AnalyticsEventRepository, AnalyticsRequest, AnalyticsResponse, AnalyticsEventName } from './analyticsEvents';

export async function postAnalyticsRoute(request: AnalyticsRequest, repository: AnalyticsEventRepository): Promise<AnalyticsResponse> {
  return postAnalyticsEvent(request, repository);
}

export async function getWeeklyKpis(
  userId: string,
  repository: AnalyticsEventRepository,
  eventNames: readonly AnalyticsEventName[],
  now = new Date(),
): Promise<Record<string, number>> {
  const since = startOfWeek(now);
  const entries = await Promise.all(eventNames.map(async (name) => [name, await repository.countByNameSince(userId, name, since)] as const));
  return Object.fromEntries(entries);
}
