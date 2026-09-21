create table if not exists marketing_events (
  id text primary key,
  user_id text not null,
  name text not null check (name in ('user.signed_up', 'challenge.completed', 'referral.link_sent', 'marketing.channel_engaged')),
  channel text,
  occurred_at timestamptz not null,
  received_at timestamptz not null default now(),
  metadata jsonb,
  idempotency_key text not null,
  unique (user_id, idempotency_key)
);
create index if not exists marketing_events_kpi_idx on marketing_events (user_id, name, occurred_at);
