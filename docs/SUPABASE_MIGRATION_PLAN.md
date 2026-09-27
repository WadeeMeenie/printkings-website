# Print Kings — Supabase Migration Plan

## Purpose
Translate the approved database specification into ordered, reviewable Supabase migrations. This document is a plan, not executable SQL.

## Principles
- One logical migration per coherent schema change.
- Never rely on manual production dashboard edits.
- Prefer additive changes before destructive changes.
- Seed reference/catalogue data separately from structural migrations.
- RLS policies are version-controlled.
- Test clean installation and upgrade paths.
- Production changes require review and backup/recovery planning.

## Migration sequence
001 extensions and foundational helpers
002 identity: profiles, companies, company_members, addresses
003 suppliers and catalogue
004 tax and commercial foundations
005 pricing and publication
006 bundles
007 Setup Builder
008 carts
009 quotes and quote versions
010 orders and status history
011 artwork and proofs
012 payments and idempotency support
013 shipping
014 discounts
015 administration and audit
016 RLS policies
017 Storage buckets and policies
018 safe public read models/views/functions

## Seed-data sequence
### Reference
- Display Mania supplier
- catalogue categories
- order/payment reference values where applicable
- admin roles
- tax policy versions
- setup types and steps

### Commercial
- September 2026 supplier price version
- all supplied supplier costs
- product/variant mappings
- bundle definitions
- pricing rules only after commercial policy approval

### Media
Load verified product imagery separately. Never fabricate product photography.

## Catalogue import requirements
Preserve supplier SKU and supplied EX VAT cost, attach the correct price version, reject duplicates, report unresolved fields, avoid unsupported claims and produce an import summary.

## Test strategy
For every migration:
1. Apply to a clean database.
2. Apply to a representative existing database.
3. Run schema and constraint tests.
4. Run RLS tests.
5. Run pricing tests.
6. Run state-transition tests.
7. Run Storage policy tests.
8. Verify recovery procedures where applicable.

## Required pre-production tests
- anonymous catalogue access
- customer ownership isolation
- company membership isolation
- staff-role isolation
- supplier-cost secrecy
- price reproducibility
- historical price preservation
- cart tamper resistance
- quote acceptance
- payment idempotency
- amount mismatch handling
- artwork ownership
- production gating
- invalid order-transition rejection
- audit logging

## Deployment order
1. Create/verify Supabase project.
2. Apply migrations to development.
3. Load reference/seed data.
4. Run automated tests.
5. Run manual security tests.
6. Review schema and policies.
7. Apply to staging.
8. Perform staging checkout/payment/artwork/order tests.
9. Prepare production backup/recovery.
10. Apply production migrations.
11. Verify tables, RLS, Storage and functions.
12. Connect production frontend only after verification.

## Rollback philosophy
Prefer forward-fix migrations. Destructive operations require explicit review, backup and recovery plan. Never make a migration destructive merely to simplify development.

## Planning status
Ready for migration implementation after review of this plan and preceding specifications.
