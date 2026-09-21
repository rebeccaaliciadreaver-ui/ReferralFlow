# Marketing page and KPI tracking

The marketing page is available at `src/pages/marketing.tsx`. It accepts a `UserProfile`, so the greeting is populated from the authenticated user instead of a hard-coded name.

## Host integration

Mount `MarketingRoute` at the host application's marketing route and pass the logged-in profile:

```tsx
<MarketingRoute profile={{ id: user.id, displayName: user.name, avatarUrl: user.avatarUrl }} />
```

The three one-click KPI trackers emit these events:

- `user.signed_up` — target 50 per week
- `challenge.completed` — target 200 per week
- `referral.link_sent` — target 80 per week

Channel activity emits `marketing.channel_engaged` with the channel ID. The included analytics service is an in-memory adapter suitable for the UI; connect `trackMarketingEvent` to your durable analytics provider at the application boundary before production. The page intentionally does not fabricate historical metrics.
