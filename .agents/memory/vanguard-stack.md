---
name: Vanguard stack and conventions
description: Tech stack, ports, auth, and the module-at-a-time build rule for the Vanguard platform
---

## Ports (dev)
- Vanguard frontend: 24130
- API server: 8080
- Mockup sandbox: 8081

## Auth
- JWT stored in localStorage key `vanguard_token`
- Middleware: `requireAuth` from `artifacts/api-server/src/middlewares/auth.ts` — reads `Authorization: Bearer <token>`
- Token helpers: `hashPassword`, `verifyPassword`, `createAccessToken`, `verifyAccessToken` in `artifacts/api-server/src/lib/auth.ts`

## AI modules (already implemented, do NOT stub)
Located at `artifacts/api-server/src/ai/`:
- `guardian.ts` — `analyzeUser`, `analyzeListing`, `analyzeTransaction` (rule-based)
- `trustScore.ts` — `calculateTrustScore` (weighted formula)
- `fraudRules.ts` — `FRAUD_RULES` constants
- `riskAnalyzer.ts` — `analyzeRisk`

## User preference
Build one module at a time. Never regenerate the entire project.

**Why:** User explicitly stated this. Regenerating breaks existing modules and loses context.
**How to apply:** Identify the single gap/module to fill, write only those files, typecheck, then stop.
