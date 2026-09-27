# Print Kings — Database Plan

## Core domains
profiles, companies, addresses, categories, products, product_variants, product_images, suppliers, supplier_products, supplier_costs, price_versions, pricing_rules, bundles, bundle_items, setup_types, setup_steps, setup_options, setup_rules, carts, cart_items, orders, order_items, order_status_history, quotes, quote_items, artwork_files, artwork_reviews, proofs, artwork_approvals, payments, shipments, discounts, admin_roles, audit_logs.

## Principles
- Separate public catalogue data from internal commercial data.
- Use foreign keys and constraints for integrity.
- Snapshot commercially relevant order values at purchase/quote time.
- Version supplier costs.
- Keep order status history.
- Store money using integer minor units or another precise representation; never use floating point for financial arithmetic.
- Use timestamps consistently and retain auditability.

## Public/private boundary
Public clients may read only published catalogue/content data. Supplier costs, margin rules, internal notes and operational data are protected by RLS/server-side boundaries.
