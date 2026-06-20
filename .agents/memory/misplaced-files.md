---
name: Misplaced React files in api-server
description: A previous agent put JSX/React files under api-server/src/pages/; they cause TS errors and should be deleted
---

## Problem
`artifacts/api-server/src/pages/component/guardian/Trustbadge.tsx` was placed in the API server by a previous agent.
The API server has no JSX support in its tsconfig, so these files produce TS17004 and TS2307 errors.

## Fix
`rm -rf artifacts/api-server/src/pages/` — the entire `pages/` directory under api-server is wrong.
The correct home for TrustBadge is `artifacts/vanguard/src/components/guardian/TrustBadge.tsx`.

**Why:** If you ever see TSX/JSX errors about missing `--jsx` flag in the api-server typecheck, check for stray .tsx files in api-server/src.
