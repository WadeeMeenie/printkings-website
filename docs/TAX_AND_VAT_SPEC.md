# Print Kings — Tax and VAT Specification

## Purpose
Define how South African VAT is represented and applied without hardcoding today's tax assumptions into historical transactions.

## Tax policy model
Create versioned tax-policy records containing jurisdiction, tax name, tax code, rate in basis points, effective dates, pricing convention, active status, source and approval metadata.

The application must resolve the tax policy applicable to the transaction date.

## VAT representation
Catalogue and selling prices are stored EX VAT unless explicitly marked otherwise. VAT is calculated from the applicable tax policy. Orders and quotes snapshot the applied policy/rate and calculated VAT amount.

Never recalculate historical transactions using the current tax rate.

## Precision
Persist monetary values as integer South African cents or an equivalent exact decimal representation. Persist VAT rates exactly. Never use binary floating-point values for financial persistence.

## Calculation
1. Resolve applicable tax policy.
2. Resolve trusted product/service price.
3. Apply permitted discounts.
4. Determine taxable amount.
5. Calculate VAT using the transaction rounding policy.
6. Store taxable amount, rate, VAT amount and total.

The calculation must be deterministic.

## Tax treatment
The schema supports explicit tax treatment per product/service/charge so future non-standard cases can be represented without rewriting history.

Do not infer customer-sale VAT from supplier VAT treatment.

## Quotes and orders
Quotes and orders snapshot tax policy/version, applicable rate, taxable amount, VAT amount and total. Historical transactions remain unchanged if tax policy changes.

## Delivery and services
Delivery, artwork, setup, rush and other service charges have explicit tax treatment.

## Admin
Authorized admins can create future tax-policy versions, inspect active/current policy, schedule changes, view history and preview impact.

## Validation
Block publication/checkout when no applicable tax policy exists, tax rate is invalid, currency/tax treatment is inconsistent, or totals do not reconcile.

## South African implementation note
Production must use the legally applicable South African VAT rate for the relevant transaction date. The database design deliberately avoids freezing a rate into application code.

The September 2026 catalogue source remains EX VAT as supplied.

## Acceptance criteria
- Tax policy is versioned.
- Historical transactions retain their original tax calculation.
- Supplier VAT treatment is separate from customer-sale VAT treatment.
- VAT calculation is deterministic.
- Future policy changes can be scheduled.
- Checkout cannot proceed without a valid tax policy.
