# Automation Engine

The engine is event-driven and intentionally framework-agnostic. It supports six stages:

1. **Trigger detection**: selects enabled automations matching `event` and optional `entity`.
2. **Context analysis**: reads nested event fields such as `user.plan`.
3. **Decision logic**: evaluates all conditions with AND semantics.
4. **Action execution**: awards LP, sends a message, updates status, or creates a referral.
5. **State sync**: mutates the configured entity store and increments `runCount`.
6. **Logging and analytics**: records `success`, `skipped`, and `failed` executions.

## Usage

```ts
const engine = new AutomationEngine(store);
await engine.process({
  event: 'challenge.completed',
  entity: 'challenge',
  entityId: 'user-123',
  data: { completed: true },
});
```

Rules should be persisted by the host application. `AutomationEngine` is the execution layer; authentication, authorization, durable storage, retries, and queue delivery belong at the integration boundary.

## Route integration

Mount `src/pages/automation-engine.tsx` at `/automation-engine` in the host router. The repository previously contained no router or application shell, so this branch provides the page and dashboard without inventing a framework-specific routing setup.

## Commands

```bash
npm install
npm test
npm run typecheck
```
