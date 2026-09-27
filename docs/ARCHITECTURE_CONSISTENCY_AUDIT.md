# Print Kings — Architecture Consistency Audit

## Audit scope
Reviewed the current planning documents for product requirements, catalogue, pricing model/engine, database schema, security, UX, Setup Builder, order workflow, artwork workflow and application architecture.

## Result
Planning is internally coherent enough to proceed to the migration-design stage, but several issues must be resolved before executable SQL is written.

## Findings and resolutions

### A-001 — Tax policy is referenced but not modeled
**Severity: High**
The pricing engine requires configurable tax-policy/version data, while the schema only stores VAT rate snapshots and supplier VAT treatment.

**Required resolution:** add `tax_policies` (and, if needed, `tax_policy_versions`) with rate, jurisdiction, effective dates and active status. Orders, quotes and published prices snapshot the applied tax policy/rate.

### A-002 — Pricing hierarchy needs explicit bundle precedence
**Severity: Medium**
Bundles are first-class commercial objects, but the pricing hierarchy currently places the bundle rule after the global default. This can make bundle pricing ambiguous.

**Required resolution:** define separate resolution paths for ordinary variants and bundles. A bundle's explicit fixed/calculated bundle price must win over generic product/category rules for that bundle.

### A-003 — Direct-cost scope is underspecified
**Severity: Medium**
The schema has `direct_cost_rules.scope_type/scope_id`, but the pricing engine allows costs such as payment processing and inbound freight whose scope may be transaction-specific.

**Required resolution:** support both reusable direct-cost rules and transaction-level direct-cost entries. Order/quote economics must be able to snapshot actual direct costs used.

### A-004 — Discount value type is ambiguous
**Severity: Medium**
The discount schema has `value` without defining units.

**Required resolution:** use explicit `discount_type` plus either `percentage_basis_points` or `amount_minor`, never an ambiguous generic value.

### A-005 — Cart pricing should not be authoritative
**Severity: High**
`cart_items.unit_price_ex_vat_minor` is useful as a cached display value, but the checkout source of truth must be recalculated from current eligible pricing.

**Required resolution:** mark cart prices as non-authoritative cache/snapshot data. Checkout must recalculate and validate every item before order creation.

### A-006 — Order status model needs a formal transition matrix
**Severity: High**
The workflow permits skipped stages but the schema does not yet define which transitions are valid.

**Required resolution:** create a canonical order-status transition matrix, including quote-origin orders, payment failure/cancellation, artwork-not-required paths, refunds/cancellations and production exceptions.

### A-007 — Artwork workflow needs quote-stage support
**Severity: Medium**
The security plan and database allow artwork to relate to orders, while artwork may also be required during quote preparation.

**Required resolution:** allow artwork files to attach to either a quote/version or order/item, with ownership preserved when converting a quote into an order.

### A-008 — Setup Builder option ownership needs a database constraint
**Severity: Medium**
`setup_options` allows both `variant_id` and `bundle_id` to be nullable.

**Required resolution:** enforce exactly one target for a purchasable option, unless a future non-purchasable informational option type is explicitly introduced.

### A-009 — Public pricing publication needs stronger uniqueness rules
**Severity: Medium**
The schema allows overlapping `price_publications` unless constrained.

**Required resolution:** enforce one effective published price for a variant at a given point in time, using date-range constraints/indexing plus an approval status model.

### A-010 — Product data needs explicit branding/artwork model
**Severity: Medium**
The schema currently uses JSON for branding status and artwork requirements. That is acceptable for flexible metadata, but the MVP needs structured fields for whether artwork is required, optional or unavailable.

**Required resolution:** define controlled enums/statuses for branding and artwork requirement, while retaining JSON for product-specific technical instructions.

### A-011 — Payment state and order state must remain separate
**Severity: High**
The order workflow uses `PAID` as an order state while the schema separately stores payment status. These must not drift.

**Required resolution:** define payment as an independent state machine. Order transitions into PAID only from a verified payment event according to the payment policy.

### A-012 — Supplier SKU visibility must be explicitly separated
**Severity: Medium**
`product_variants` contains `supplier_sku`, while public catalogue reads must exclude it.

**Required resolution:** expose customer catalogue through a safe view/API shape rather than selecting the raw table broadly from the client.

## Consistency decisions

1. Public product price is derived from approved pricing data, not React constants.
2. Supplier costs are private.
3. Historical order economics are immutable snapshots.
4. Bundle pricing is independent from ordinary product pricing.
5. Cart values are provisional until checkout validation.
6. Quote acceptance preserves the exact accepted quote version.
7. Artwork can be associated with quotes as well as orders where required.
8. Payment verification is independent from browser navigation.
9. RLS protects ownership; server-side functions enforce privileged commercial operations.
10. Setup Builder recommendations remain data-driven.

## Pre-migration gate
Before executable Supabase migrations are created, the following artifacts should be added:
- `docs/ORDER_STATE_MACHINE.md`
- `docs/PAYMENT_STATE_MACHINE.md`
- `docs/TAX_AND_VAT_SPEC.md`
- `docs/SECURITY_RLS_MATRIX.md`
- `docs/SUPABASE_MIGRATION_PLAN.md`

After those are reviewed, the schema can be translated into ordered SQL migrations and seed data.

## Audit status
**PASS WITH REQUIRED REFINEMENTS** — no architectural blocker was found, but the High-severity findings above must be resolved before implementation.
