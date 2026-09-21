# Analytics API integration

`src/server/analyticsEvents.ts` provides the server-side boundary for KPI events:

- Requires an authenticated user.
- Validates the event name and timestamp.
- Adds the authenticated `userId`, event ID, and server receipt time.
- Returns `201` for a new event and `200` for a duplicate.
- Provides `AnalyticsEventRepository` so the host can use Postgres, Supabase, or another database.

`src/server/inMemoryAnalyticsRepository.ts` is only a development/test adapter. It is not durable and should not be used in production.

## Host framework adapter

In an API route, resolve the session before calling the handler:

```ts
const result = await postAnalyticsEvent(
  { user: session?.user ? { id: session.user.id } : null, body: await request.json() },
  analyticsRepository,
);
return Response.json(result.body, { status: result.status });
```

Implement `AnalyticsEventRepository` with a database table containing a unique event ID and indexes on `(user_id, name, occurred_at)`. For reliable client retries, use a client-generated idempotency key as the unique key instead of generating the ID only on the server.

The repository intentionally does not choose an auth provider, server framework, or database driver because this project currently contains no backend runtime or database configuration.
