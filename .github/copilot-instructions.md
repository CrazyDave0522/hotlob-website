# Copilot Instructions for Hotlob Website

This repository is a Next.js 16 (App Router) TypeScript site using Tailwind CSS, Supabase, and the Google Places (New) API. Use this file to orient AI coding agents to the project's structure, conventions, and developer workflows.

**Big Picture**
- **Framework**: `app/` directory (Next.js App Router). Most top-level pages are server components; client components live under `app/.../components` and include `"use client"`.
- **Data flow**: Server components fetch data via `lib/*` helpers (e.g., `lib/getStores.ts`, `lib/google-places.ts`). Cached Place details go into Supabase `place_cache`; reviews live in `curated_reviews` and `review_photos` tables.
- **Background jobs**: Cron/API endpoints refresh Google Places data (`POST /api/stores/refresh` and `POST /api/stores/{storeId}/refresh`). Those routes live in `app/api/stores/.../route.ts` and are protected using `CRON_SECRET` via `lib/serverEnv.ts`.

**Key Files & Where to Look**
- `app/` : page layouts, routes, and client components.
- `app/api/` : route handlers. Example: `app/api/send-catering-email/route.ts` and `app/api/stores/refresh/route.ts`.
- `lib/google-places.ts` : canonical Place Details / reviews / photos fetch and normalization logic. Use this for any Places-related work.
- `lib/supabaseClient.ts` : Supabase client (client-side anon key). Server-only secrets are accessed through `lib/serverEnv.ts`.
- `scripts/refresh-places.mjs` : helper script used during development to trigger/inspect refresh behavior.
- `lib/email-templates/` : HTML email templates used by `send-catering-email`.

**Auth & Secrets**
- Server-only secrets: `GMAPS_API_KEY`, `CRON_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` — see `lib/serverEnv.ts`. NEVER import `lib/serverEnv.ts` in client components.
- API refresh routes expect `Authorization: Bearer {CRON_SECRET}`. Example curl:

```
curl -X POST -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/stores/refresh
```

**Developer Workflows (use these commands)**
- Install: `pnpm install`
- Dev server: `pnpm dev` (runs `next dev`)
- Build: `pnpm build` and `pnpm start` for production
- Tests: `pnpm test` (uses Vitest)
- Lint: `pnpm lint` (uses ESLint)
- Local Places helper: `pnpm refresh-places` (runs `scripts/refresh-places.mjs`)

**Project-specific Conventions**
- App Router semantics: prefer server components for data fetching in `app/page.tsx` and children; promote components to client only when they use state/effects or browser-only APIs.
- API handlers are Next Route Handlers (`route.ts`) using typed `NextRequest`/`NextResponse` and server-side libs. Keep heavy network operations server-side.
- Supabase usage: `lib/supabaseClient.ts` uses public anon keys for client code. For service-role operations use server-only keys and `serverEnv`.
- Google Places (New) usage: HTTP requests set `X-Goog-Api-Key` and `X-Goog-FieldMask` as in `lib/google-places.ts`. Follow the field masks used there for correct responses.

**Patterns & Examples the agent should follow**
- When adding a new server route, check existing patterns in `app/api/stores/*/route.ts` for: auth via `getCronSecret()`, error handling, upserting into Supabase, and small delays to avoid QPS limits.
- When touching Places logic, reuse `fetchPlaceDetails`, `fetchPlaceReviews`, and `fetchPlacePhotos` to keep normalization consistent.
- Client components that need images use Next `Image` optimization and assets under `public/images`.

**Safety & Do's / Don'ts**
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` or `GMAPS_API_KEY` to client bundles. Use `lib/serverEnv.ts` getters on the server.
- Avoid importing server-only modules into client code (this will break bundling and reveal secrets).

**Where to learn more / references**
- Start with `README.md` at repo root for project-level context and db schema expectations.
- Inspect `lib/google-places.ts`, `app/api/stores/refresh/route.ts`, and `scripts/refresh-places.mjs` to understand the refresh workflow.

If anything here is unclear or you want more granularity (examples for feature X, testing steps, or local debug tips), tell me which area to expand.
