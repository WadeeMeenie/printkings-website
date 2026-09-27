# Print Kings

Print Kings is a South African outdoor branding and event-display commerce platform.

## Current status

**Frontend foundation implemented. Backend is live and security-audited.**

The repository contains the product/business/UX/architecture specifications plus the first production storefront foundation.

## Core experience

**MAKE YOUR BRAND IMPOSSIBLE TO MISS.**

Primary journeys:
- Build Your Setup
- Shop Products
- Get a Quote

## Frontend stack

- React 19.3
- Vite 8.3
- TypeScript 7
- Tailwind CSS 4.3
- React Router 7
- Supabase JS 2.117

The versions were checked against current upstream/package sources on 2026-09-27.

## Backend

The dedicated Supabase project contains the catalogue, pricing, bundles, Setup Builder rules, cart/checkout, quotes, orders, payments, artwork/proofs, shipping, discounts and RLS foundations.

The frontend reads only customer-safe catalogue data. Checkout pricing remains server-authoritative.

## Environment

Copy `.env.example` to `.env.local` and add the Supabase publishable key.

**Never place a service-role or secret key in the browser.**

## Local development

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Documentation

See `/docs` for product, business, pricing, UX, architecture, database, security and workflow specifications.

See `/ai` for project state, decisions and change history.

See `docs/BACKEND_COMPLETION_GATE.md` for backend completion gates.

## Development rule

Read `AGENTS.md` and the relevant `/docs` and `/ai` files before making implementation changes.
