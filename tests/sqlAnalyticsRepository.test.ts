import { describe, expect, it, vi } from 'vitest';
import { SqlAnalyticsRepository } from '../src/server/sqlAnalyticsRepository';

describe('SQL analytics repository', () => {
  it('uses parameterized SQL and returns inserted status', async () => {
    const query = vi.fn().mockResolvedValue({ rowCount: 1 });
    const repository = new SqlAnalyticsRepository(query);
    const inserted = await repository.insert({ id: 'evt-1', userId: 'user-1', name: 'user.signed_up', occurredAt: '2026-09-21T12:00:00.000Z', receivedAt: '2026-09-21T12:00:01.000Z', idempotencyKey: 'signup-1234' });
    expect(inserted).toBe(true);
    expect(query.mock.calls[0][1]).toContain('user-1');
    expect(query.mock.calls[0][0]).toContain('on conflict');
  });

  it('maps aggregate counts to numbers', async () => {
    const query = vi.fn().mockResolvedValue({ rows: [{ count: '7' }] });
    const repository = new SqlAnalyticsRepository(query);
    expect(await repository.countByNameSince('user-1', 'user.signed_up', new Date('2026-09-21T00:00:00.000Z'))).toBe(7);
  });
});
