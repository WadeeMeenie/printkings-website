# Print Kings — Catalogue Import Specification

## Purpose
Define how the September 2026 reseller catalogue is transformed into production data.

## Import stages
1. Create supplier record: Display Mania.
2. Create price version for September 2026 with valid-until 31 October 2026.
3. Create customer-facing product families.
4. Create variants for size/configuration differences.
5. Map every supplier SKU to exactly one product/variant.
6. Store supplier cost EX VAT against the price version.
7. Add verified dimensions/weight/specifications only.
8. Attach verified product media.
9. Add branding/artwork requirements only after verification.
10. Mark records active only after data validation.

## Product-family rules
- Gazebos: family by construction/type; size is a variant.
- Banner flags: family by flag shape/type; height and single/double are variants.
- Tablecloths: family by cloth type; dimensions/fit are variants.
- Pull-ups/X-banners: family by display type; size/style are variants.
- Banner walls and fabric frames: family by system; dimensions are variants.
- Components sold by running metre, square metre or unit remain purchasable variants with explicit units.
- Packages are bundle entities, not ordinary products.

## Required product fields
- id
- name
- slug
- category_id
- family
- description
- short_description
- active
- supplier_id
- supplier_sku
- price_version_id
- supplier_cost_ex_vat
- pricing_rule_id
- dimensions
- weight
- unit_of_measure
- branding_available
- artwork_requirements
- included_items
- stock_status
- lead_time
- warranty
- media
- SEO metadata

## Required validation
Reject import rows when:
- supplier SKU is missing
- cost is missing or invalid
- category is unresolved
- variant identity is ambiguous
- money is represented as floating-point application data
- required commercial source/version is missing

Do not reject a row merely because optional marketing/specification information is unknown; leave it unverified and flag it for enrichment.

## Customer-safe data boundary
Public catalogue responses may expose:
- product name
- description
- specifications
- media
- customer price
- branding information that has been verified
- availability state when verified

Never expose:
- supplier cost
- target margin
- true cost
- internal supplier notes
- pricing rules
- internal procurement information

## Catalogue QA
Before publication:
- every supplier SKU maps once
- no duplicate active SKU mapping
- every active product has a category
- every displayed price points to an active price version
- customer price calculation is reproducible
- images match the actual product
- unsupported claims are removed
- stock is not implied unless verified
