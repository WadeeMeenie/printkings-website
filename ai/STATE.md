# Print Kings — AI State

## Current phase
PHASE 1 — FRONTEND FOUNDATION

## Repository
WadeeMeenie/printkings-website
Default branch: main

## Backend
Dedicated Supabase project:
- Project ref: vmjapprncqkyabcabqfa
- Region: eu-west-1
- PostgreSQL 17
- Security Advisor: 0 findings

Implemented backend domains:
- Identity/company/address foundation
- 85-product customer catalogue
- Versioned supplier costs and published prices
- Tax policy
- Cart and authoritative checkout pricing
- Quotes and quote-to-order conversion
- Orders and order state machine
- Payments/Yoco boundary
- Shipping methods and shipments
- Discounts
- Audit logs
- Bundles and bundle price resolution
- 8 Setup Builder types
- 776 active Setup Builder options
- 96 active recommendation rules
- Artwork/review/proof/approval workflow
- Private artwork/proof Storage buckets

## Frontend
Implemented:
- React 19.3
- Vite 8.3
- TypeScript 7
- Tailwind CSS 4.3
- React Router 7
- Supabase JS 2.117
- Generated `src/lib/database.types.ts`
- Supabase client using browser-safe publishable key
- Homepage foundation
- Shop page connected to `public.public_catalogue`
- Setup Builder journey shell
- Quote request shell
- Responsive base styling
- Environment template

## Important security boundary
The browser may use only the Supabase publishable key. It must never contain service-role or provider secret keys.

Client-side prices are advisory. Checkout remains server-authoritative.

## Known production gates
- Yoco secrets/domain/webhook verification still required.
- Standard delivery rate is not activated.
- Discount codes remain commercial-control gated.
- Quote/order and payment flows need test-mode end-to-end verification.
- Migration history still needs a clean repository-side reconciliation for DDL performed after the original migration set.
- Frontend still needs full product detail, cart, authentication, checkout, customer orders, real Setup Builder interactions and admin UI.

## Next gate
Build the real customer catalogue experience:
1. Category navigation/filtering
2. Product detail pages
3. Product image pipeline
4. Cart state
5. Setup Builder database-driven interaction
6. Quote submission persistence
7. Authentication/customer account
8. Checkout/Yoco integration

Do not skip runtime verification as features are added.
