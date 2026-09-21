import { describe, expect, it } from 'vitest';
import { InMemoryAnalyticsRepository } from '../src/server/inMemoryAnalyticsRepository';
import { postAnalyticsEvent, startOfWeek } from '../src/server/analyticsEvents';

describe('analytics events API', () => {
  it('rejects unauthenticated requests', async () => {
    const result = await postAnalyticsEvent({ user: null, body: {} }, new InMemoryAnalyticsRepository());
    expect(result.status).toBe(401);
  });

  it('validates and persists an authenticated event', async () => {
    const repository = new InMemoryAnalyticsRepository();
    const result = await postAnalyticsEvent({ user: { id: 'user-1' }, body: { name: 'user.signed_up', occurredAt: '2026-09-21T12:00:00.000Z' } }, repository);
    expect(result.status).toBe(201);
    expect(repository.all()).toHaveLength(1);
    expect(await repository.countByNameSince('user-1', 'user.signed_up', startOfWeek(new Date('2026-09-21T12:00:00.000Z')))).toBe(1);
  });

  it('rejects unsupported event names', async () => {
    const result = await postAnalyticsEvent({ user: { id: 'user-1' }, body: { name: 'admin.deleted', occurredAt: new Date().toISOString() } }, new InMemoryAnalyticsRepository());
    expect(result.status).toBe(400);
  });
});
