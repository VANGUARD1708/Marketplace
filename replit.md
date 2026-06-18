# Vanguard

A trusted marketplace and community platform — profiles, feed, marketplace, services, jobs, courses, chat, wallet, escrow, verification, company pages, AI, governance, and delivery.

## Run & Operate

- `pnpm --filter @workspace/vanguard run dev` — run the frontend (port auto-assigned)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Wouter (routing), Tailwind CSS, shadcn/ui components
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/vanguard/src/pages/` — all page components (20 pages, placeholder content)
- `artifacts/vanguard/src/components/layout/AppLayout.tsx` — sidebar navigation
- `artifacts/api-server/src/routes/` — all API route stubs (20 modules)
- `lib/db/src/schema/` — all 33 database table definitions
- `lib/api-spec/openapi.yaml` — OpenAPI spec (only /healthz for now)

## Modules (Phase Order)

| Phase | Module |
|-------|--------|
| 1 | Auth, Profiles, Trust, Followers |
| 2 | Feed, Posts, Reviews |
| 3 | Marketplace, Chat |
| 4 | Jobs, Services |
| 5 | Wallet, Escrow |
| 6 | Verification, Certificates |
| 7 | Companies |
| 8 | AI |
| 9 | Governance |
| 10 | Delivery Tracking |

## DO NOT BUILD YET

- International Payments
- Inheritance System
- Advanced Analytics
- Multi Currency
- Global Trust Network

## Architecture decisions

- Every module has a dedicated page, API route file, and DB schema file — build one at a time
- All API routes return `501 Not Implemented` until a phase is started
- DB schema files define tables with Drizzle ORM but no tables are created until `pnpm --filter @workspace/db run push` is run
- Never regenerate the entire project — add one module at a time

## Product

Vanguard is a full-featured trust-based marketplace: users buy/sell products, offer services, post jobs, teach courses, hold escrow, get verified, and build reputation via a trust score.

## User preferences

- Build placeholders first, then implement one module at a time
- Never regenerate the entire project

## Gotchas

- Run `pnpm --filter @workspace/db run push` after adding new DB tables
- Run codegen after any OpenAPI spec change: `pnpm --filter @workspace/api-spec run codegen`
- The `DATABASE_URL` env var must be set before the API server starts
