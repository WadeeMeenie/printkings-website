# Print Kings — AI State

## Current phase
PHASE 1 — FULL CUSTOMER-FACING FRONTEND PASS

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
- Database-driven Setup Builder interaction
- Authenticated quote persistence
- Local persistent cart with server sync at checkout
- Checkout/Yoco handoff and payment result states
- Authentication/customer account entry
- Packages and Solutions pages
- Product image read pipeline for approved external imagery
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
1. Run the production build through the new GitHub Actions workflow and fix any TypeScript/build failures.
2. Perform browser runtime QA for Home → Shop → Product → Cart and Home → Builder → Cart/Quote.
3. Configure Yoco production secrets/domain and run a test-mode payment E2E.
4. Add approved real product imagery; the live database currently has zero approved product images.
5. Add customer order/account history and admin operations after the core storefront is runtime-verified.

Do not skip runtime verification as features are added.
