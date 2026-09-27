# Print Kings — Supabase Database Specification

## 1. Database goals

The database is the authoritative transactional and commercial layer for Print Kings. It must preserve catalogue history, pricing history, customer ownership, order snapshots, quote versions, artwork permissions, payment state and audit history.

Principles:
- PostgreSQL/Supabase-native design.
- Relational integrity through foreign keys and constraints.
- Exact monetary representation.
- Version commercial data instead of overwriting it.
- Snapshot transaction economics at order/quote acceptance.
- RLS is mandatory for customer-owned data.
- Supplier costs and internal commercial fields are never public.
- Status history is append-only.
- Critical payment/order transitions are server-authoritative.

## 2. Identity and access

### profiles
Extends authenticated users.
Fields:
- id UUID PK / references auth.users
- first_name
- last_name
- phone
- created_at
- updated_at

### companies
Business/customer organisations.
Fields:
- id
- name
- registration_number nullable
- vat_number nullable
- phone
- email
- notes_internal nullable
- created_at
- updated_at

### company_members
Links users to companies.
Fields:
- id
- company_id FK
- user_id FK
- role
- created_at

### addresses
Reusable billing/shipping addresses.
Fields:
- id
- user_id nullable
- company_id nullable
- label
- recipient_name
- company_name nullable
- address_line_1
- address_line_2 nullable
- suburb/city/province/postal_code/country
- phone nullable
- created_at
- updated_at

Constraint: an address must belong to an allowed owner context.

## 3. Catalogue

### suppliers
- id
- name
- active
- notes_internal
- created_at
- updated_at

### categories
- id
- parent_id nullable FK categories
- name
- slug unique
- description
- sort_order
- active

### products
Customer-facing product family.
- id
- category_id FK
- name
- slug unique
- short_description
- description
- active
- merchandising_priority nullable
- created_at
- updated_at

### product_variants
Purchasable configuration/variant.
- id
- product_id FK
- name
- sku_public nullable
- supplier_id FK
- supplier_sku
- unit_of_measure
- dimensions_json nullable
- weight_grams nullable
- branding_status
- artwork_requirements_json nullable
- included_items_json nullable
- stock_status
- active
- created_at
- updated_at

Unique supplier_id + supplier_sku for active catalogue mapping.

### product_images
- id
- product_id FK
- variant_id nullable FK
- storage_path or public media reference
- alt_text
- sort_order
- is_primary
- active

Public media must not share private customer-artwork storage.

### product_features
- id
- product_id FK
- feature_name
- feature_value
- sort_order

## 4. Supplier commercial data

### supplier_price_versions
- id
- supplier_id FK
- source_name
- source_date
- effective_from
- effective_until nullable
- currency
- vat_treatment
- status
- notes
- created_by
- created_at

### supplier_costs
- id
- supplier_price_version_id FK
- variant_id FK
- supplier_cost_minor
- currency
- created_at

A supplier cost is immutable after approval. Corrections create a new version/record.

## 5. Pricing

### pricing_rules
- id
- name
- priority
- scope_type
- product_id nullable
- variant_id nullable
- category_id nullable
- company_id nullable
- target_margin_basis_points nullable
- fixed_price_minor nullable
- minimum_price_minor nullable
- maximum_discount_basis_points nullable
- rounding_policy
- effective_from
- effective_until nullable
- active
- created_by
- created_at
- updated_at

### direct_cost_types
- id
- name
- active

### direct_cost_rules
- id
- type_id FK
- scope_type
- scope_id nullable
- calculation_type
- amount_minor nullable
- percentage_basis_points nullable
- effective_from
- effective_until nullable
- active

### price_publications
Tracks approved customer-facing prices.
- id
- variant_id FK
- pricing_rule_id FK
- supplier_cost_id FK
- true_cost_minor
- selling_price_ex_vat_minor
- vat_rate_basis_points
- selling_price_inc_vat_minor
- effective_from
- effective_until nullable
- status
- approved_by
- approved_at

## 6. Bundles/packages

### bundles
- id
- name
- slug unique
- description
- bundle_type
- pricing_mode
- pricing_rule_id nullable
- fixed_price_ex_vat_minor nullable
- active
- effective_from
- effective_until nullable
- created_at
- updated_at

### bundle_items
- id
- bundle_id FK
- variant_id FK
- quantity
- required
- sort_order

A bundle never duplicates product data. It references catalogue variants.

## 7. Setup Builder

### setup_types
- id
- name
- slug
- description
- active
- sort_order

### setup_steps
- id
- setup_type_id FK
- step_key
- title
- description
- sort_order
- active

### setup_options
- id
- step_id FK
- variant_id nullable
- bundle_id nullable
- option_key
- label
- description
- sort_order
- active

Constraint: option must resolve to a valid purchasable product/variant or bundle where applicable.

### setup_rules
- id
- setup_type_id FK
- condition_json
- action_json
- priority
- active

Rules determine recommended/required/hidden options without hardcoding business logic into React.

## 8. Cart

### carts
- id
- user_id nullable
- session_id nullable
- currency
- status
- created_at
- updated_at

### cart_items
- id
- cart_id FK
- variant_id nullable
- bundle_id nullable
- quantity
- configuration_json nullable
- unit_price_ex_vat_minor
- vat_rate_basis_points
- created_at
- updated_at

Cart prices are recalculated by trusted server logic before checkout.

## 9. Orders

### orders
- id
- order_number unique
- user_id nullable
- company_id nullable
- billing_address_snapshot JSON
- shipping_address_snapshot JSON
- currency
- status
- subtotal_ex_vat_minor
- discount_ex_vat_minor
- delivery_ex_vat_minor
- taxable_amount_minor
- vat_amount_minor
- total_inc_vat_minor
- source_type
- accepted_quote_id nullable
- payment_status
- created_at
- updated_at

Addresses are snapshotted so later address edits cannot rewrite historical orders.

### order_items
- id
- order_id FK
- variant_id nullable
- bundle_id nullable
- product_name_snapshot
- variant_name_snapshot
- supplier_sku_snapshot nullable
- quantity
- unit_cost_snapshot_minor nullable
- unit_true_cost_snapshot_minor nullable
- unit_price_ex_vat_minor
- discount_ex_vat_minor
- vat_rate_basis_points
- vat_amount_minor
- line_total_inc_vat_minor
- configuration_snapshot JSON nullable

### order_status_history
Append-only:
- id
- order_id FK
- from_status nullable
- to_status
- reason nullable
- actor_user_id nullable
- created_at

## 10. Quotes

### quotes
- id
- quote_number unique
- user_id nullable
- company_id nullable
- status
- valid_until
- currency
- subtotal_ex_vat_minor
- discount_ex_vat_minor
- delivery_ex_vat_minor
- taxable_amount_minor
- vat_amount_minor
- total_inc_vat_minor
- notes_customer nullable
- notes_internal nullable
- created_by
- created_at
- updated_at

### quote_versions
- id
- quote_id FK
- version_number
- created_by
- created_at
- status
- snapshot_json

### quote_items
- id
- quote_version_id FK
- variant_id nullable
- bundle_id nullable
- product_name_snapshot
- variant_name_snapshot
- quantity
- unit_price_ex_vat_minor
- discount_ex_vat_minor
- configuration_snapshot JSON nullable

Accepted quotes must identify the exact accepted version.

## 11. Artwork

### artwork_files
- id
- order_id FK
- order_item_id nullable
- uploaded_by
- storage_path
- original_filename
- mime_type
- size_bytes
- checksum nullable
- status
- created_at

### artwork_reviews
- id
- artwork_file_id FK
- reviewer_id
- status
- notes
- created_at

### proofs
- id
- artwork_file_id FK
- version_number
- storage_path
- created_by
- status
- created_at

### artwork_approvals
- id
- proof_id FK
- approved_by
- approved_at
- decision
- notes

## 12. Payments

### payments
- id
- order_id FK
- provider
- provider_reference
- amount_minor
- currency
- status
- verified_at
- verification_source
- raw_provider_reference JSONB where appropriate and safe
- created_at
- updated_at

Provider redirects/webhooks are not trusted merely because a browser reaches a success page. Payment status must be verified server-side.

## 13. Shipping

### shipments
- id
- order_id FK
- carrier nullable
- service nullable
- tracking_number nullable
- status
- shipping_cost_minor
- dispatched_at nullable
- delivered_at nullable
- created_at
- updated_at

## 14. Discounts

### discounts
- id
- name
- discount_type
- value
- scope_type
- start_at
- end_at
- max_redemptions nullable
- stacking_policy
- active
- created_by
- created_at

### discount_codes
- id
- discount_id FK
- code unique
- active

### discount_redemptions
- id
- discount_id FK
- code_id nullable
- order_id FK
- amount_minor
- redeemed_at

## 15. Administration

### admin_roles
- id
- name
- description

Roles planned:
SUPER_ADMIN, ADMIN, SALES, ARTWORK, PRODUCTION.

### admin_users
- user_id PK/FK
- role_id FK
- active
- created_at

Role permissions should be enforced server-side and complemented by RLS.

## 16. Audit

### audit_logs
- id
- actor_user_id nullable
- action
- entity_type
- entity_id
- before_json nullable
- after_json nullable
- reason nullable
- created_at

Use for commercial changes, permission changes, order/payment actions and other security-sensitive operations.

## 17. RLS model

Customer-owned resources must be restricted by authenticated identity.

Customer can read/write only appropriate rows for their own:
- profile
- company membership
- addresses
- carts
- quotes
- orders
- artwork submissions
- proofs/approval records
- payments belonging to their orders where exposure is appropriate
- shipments belonging to their orders

Public anonymous access is limited to explicitly public catalogue/media data.

Supplier costs, pricing rules, true costs, internal notes, admin roles and audit logs are never publicly readable.

Admin access must be role-aware and explicit. Do not create blanket authenticated-user policies.

## 18. Storage

Recommended separate buckets:
- product-media: public/read-safe catalogue imagery
- artwork-private: private customer artwork
- proofs-private: private proof files

Storage policies must mirror ownership and admin permissions.

## 19. Database constraints

Enforce at database level where practical:
- non-negative quantities
- non-negative monetary values unless an explicitly signed adjustment field is required
- valid status transitions through trusted functions/services
- unique supplier SKU mapping
- unique slugs
- valid effective-date ranges
- quote version uniqueness
- order number uniqueness
- discount-code uniqueness
- foreign-key integrity

## 20. Transaction boundaries

Critical operations should be atomic, including:
- checkout/order creation
- quote acceptance to order conversion
- payment confirmation
- price publication
- order status transition
- artwork approval transition

Use server-side functions/services where multiple writes must succeed or fail together.

## 21. Database functions to plan

Likely trusted functions/services:
- calculate_product_price
- calculate_bundle_price
- validate_cart_for_checkout
- create_order_from_cart
- accept_quote_version
- record_verified_payment
- transition_order_status
- calculate_order_totals
- publish_price
- validate_discount

Exact implementation should be designed during migration work and tested before production use.

## 22. Migration policy

Migrations must be:
- ordered
- reversible where practical
- reviewed before production
- safe against accidental destructive changes
- accompanied by seed/reference-data strategy

Never use the production database as an experimental schema editor without a migration trail.

## 23. Planning status

This is a schema specification, not executable SQL. It intentionally precedes Supabase implementation so relationships, ownership and commercial boundaries can be reviewed before migrations are created.
