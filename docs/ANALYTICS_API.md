# Analytics API integration

The production path is now available without locking the project to a server framework:

- `src/server/analyticsEvents.ts` validates authenticated events and idempotency keys.
- `src/server/sqlAnalyticsRepository.ts` adapts any parameterized SQL client.
- `src/server/analyticsRoutes.ts` exposes POST handling and weekly KPI aggregation.
- `src/services/analyticsApiSink.ts` sends browser events with credentials and retry-safe keys.
- `docs/marketing_events.sql` defines the table, uniqueness constraint, and KPI index.

## Route wiring

```ts
const repository = new SqlAnalyticsRepository((sql, params) => db.query(sql, params));
const result = await postAnalyticsRoute(
  {
    user: session?.user ? { id: session.user.id } : null,
    body: await request.json(),
    idempotencyKey: request.headers.get('idempotency-key') ?? undefined,
  },
  repository,
);
return Response.json(result.body, { status: result.status });
```

For the dashboard, call `getWeeklyKpis(user.id, repository, ['user.signed_up', 'challenge.completed', 'referral.link_sent'])` and map the result to the configured targets. Use a database transaction or an atomic `ON CONFLICT` insert in production, as provided by the SQL adapter.
