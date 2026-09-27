# Print Kings — Pricing Model

## Source
September 2026 Display Mania reseller price list. All supplied costs are EX VAT and are valid until 31 October 2026 subject to stock.

## Pricing layers
Supplier cost → true cost → target gross margin → selling price EX VAT → VAT → customer-facing price INC VAT.

## Gross margin
Selling price = true cost / (1 - target gross margin).

Example: R5,000 true cost at 30% gross margin = R7,142.86 EX VAT.

30% markup is not 30% gross margin.

## Required data
- supplier
- supplier SKU
- supplier cost EX VAT
- cost version
- valid from
- valid until
- true cost components
- target margin
- selling price EX VAT
- VAT rate
- selling price INC VAT
- pricing status

## Rules
- Never hardcode commercial prices in React components.
- Never overwrite historical price versions.
- Admin pricing changes must be auditable.
- Product availability and pricing are separate concerns.
- Bulk/custom pricing may use quote-specific pricing rather than public catalogue pricing.
