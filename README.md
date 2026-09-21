# ReferralFlow 🚀

A competitive referral program application with weekly leaderboards, rewards, and an event-driven Automation Engine.

## Automation Engine

The implementation lives on `feature/automation-engine`:

- `src/services/automationEngine.ts` — framework-agnostic execution engine
- `src/types/automation.ts` — automation, event, action, and log contracts
- `src/components/AutomationEngineDashboard.tsx` — live stats and rule/log dashboard
- `src/pages/automation-engine.tsx` — page entry point with example data
- `tests/automationEngine.test.ts` — condition, success, and skip coverage
- `docs/AUTOMATION_GUIDE.md` — integration and route guidance

See the [Automation Guide](docs/AUTOMATION_GUIDE.md) for setup and host-router integration.
