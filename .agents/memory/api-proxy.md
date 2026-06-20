---
name: API proxy setup
description: How the frontend reaches the API server in dev and what the shared fetch utility is
---

## Vite proxy (dev)
`artifacts/vanguard/vite.config.ts` proxies `/api` → `http://localhost:8080` with `changeOrigin: true`.
Means: any `fetch("/api/...")` in the frontend hits the Express API server.

## Frontend API utility
`artifacts/vanguard/src/lib/api.ts` exports:
- `apiFetch<T>(path, options?)` — typed fetch, auto-attaches Bearer token if present
- `getToken()`, `setToken(token)`, `clearToken()` — localStorage key `vanguard_token`

**Why:** Centralises auth header injection and error handling. All pages should import from here.
**How to apply:** New frontend pages import `{ apiFetch }` from `@/lib/api`.
