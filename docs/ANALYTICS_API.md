# Analytics API integration

The analytics flow now supports production-safe retries:

1. `createAnalyticsApiSink()` posts events to `/api/analytics/events` with credentials and an `Idempotency-Key`.
2. The server requires an authenticated user and validates the event payload.
3. The repository persists the event using `(user_id, idempotency_key)` as the duplicate boundary.
4. KPI aggregation uses `countByNameSince()` and `startOfWeek()`.

`docs/marketing_events.sql` contains the database schema and indexes. Implement `AnalyticsEventRepository` with your database driver, then adapt your framework route:

```ts
const result = await postAnalyticsEvent(
  { user: session?.user ? { id: session.user.id } : null, body: await request.json(), idempotencyKey: request.headers.get('idempotency-key') ?? undefined },
  analyticsRepository,
);
return Response.json(result.body, { status: result.status });
```

The in-memory repository remains for tests only. Do not use it in production.
