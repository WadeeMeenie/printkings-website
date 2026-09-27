# Print Kings — Pricing Engine Specification

## Purpose
The pricing engine converts supplier/commercial costs into controlled customer prices without hardcoding financial logic into the storefront. Pricing must be reproducible, versioned, auditable and independent from the React UI.

## Money rules
All monetary values must use exact integer minor units (South African cents) or an equivalent exact decimal representation. Never use binary floating-point values for persisted money. Every monetary record must explicitly identify EX VAT, VAT amount, or INC VAT. VAT rate must be configurable by tax-policy version rather than permanently assumed in application code.

## Cost layers
### Supplier Cost
Amount supplied by the supplier for a supplier SKU/variant under a specific supplier price version.

### True Cost
Supplier cost plus applicable direct costs attributable to the sale, such as inbound freight, payment processing, artwork/production charges, packaging, or other directly attributable costs.

### Selling Price
Customer-facing price calculated from the applicable pricing rule and true cost.

## Gross-margin calculation
Gross margin = (Selling Price - True Cost) / Selling Price.

For a target gross margin: Selling Price EX VAT = True Cost / (1 - Target Gross Margin).

Example only: True cost R5,000 at 30% gross margin produces R7,142.86 EX VAT. A 30% markup is NOT equivalent to a 30% gross margin.

## Pricing rule hierarchy
1. Quote-specific negotiated price
2. Customer/company-specific contract price
3. Product-variant override
4. Product-family/category pricing rule
5. Global default pricing rule
6. Explicit package/bundle pricing rule

The selected rule must be recorded with the resulting price.

## Pricing rules
Support rule name, active/inactive, priority, target gross margin, fixed EX VAT override where permitted, minimum selling price, maximum discount, rounding policy, effective dates, and applicable product/category/family/customer/company.

Target margin is configurable, not a universal permanent constant.

## Price versions
Every supplier-cost change creates a new supplier cost/price-version record. Never overwrite historical supplier costs.

A price version contains source name, source date, effective dates, currency, VAT treatment, notes, and import/approval metadata.

Historical orders continue using their captured prices after a new price version becomes active.

## Customer price snapshots
When an order or accepted quote is created, capture product/variant, supplier-cost snapshot where commercially appropriate, true-cost snapshot where commercially appropriate, selling price EX VAT, VAT rate, VAT amount, selling price INC VAT, discount, and pricing-rule/version reference.

Later catalogue price changes must never rewrite existing order economics.

## VAT
VAT is calculated from the applicable tax policy. Store taxable amount, VAT rate, VAT amount and total so historical transactions remain reconstructable without relying on today's tax setting.

## Rounding
Rounding must be deterministic:
1. Calculate exact commercial price.
2. Apply configured price rounding.
3. Store final EX VAT unit price.
4. Calculate line extension from stored unit price and quantity.
5. Calculate VAT according to transaction policy.
6. Store final totals.

The same calculation must produce the same result in server and admin tooling.

## Discounts
Discounts are explicit records. Support percentage, fixed amount, product, category, bundle, quote-specific, customer/company-specific and discount-code discounts.

Every discount requires eligibility rules, effective period, limits, stacking policy and audit information. A discount must not silently reduce a transaction below an enforced minimum selling price unless an authorized admin explicitly permits it.

## Bundles/packages
A package is a first-class commercial object containing customer-facing name, description, included product variants, quantities, optional components, package-specific pricing rule, active period and merchandising information.

Two pricing modes are supported:
- Calculated bundle: sum component true costs and apply package margin rule.
- Fixed bundle: use an approved fixed EX VAT package price.

The system still retains underlying component economics for reporting.

## Quotes
Quotes may override normal catalogue pricing. Capture customer/company, quote items, quantities, negotiated unit prices, discounts, VAT, delivery charges, validity period, notes, approval/user and quote version.

Once accepted, quote pricing becomes the source for the resulting order.

## Configurable products
Every paid option must have an explicit price effect. Final configured pricing must be reproducible and snapshotted into cart/order/quote. Do not calculate final configuration pricing solely in browser JavaScript.

## Delivery and service charges
Delivery remains separate from product selling price. Supported charge types can include delivery, artwork service, setup/assembly, rush production and other approved service charges. Each charge has its own price source and tax treatment.

## Admin controls
Authorized admins can create price versions, import supplier costs, activate pricing rules, set target margins, create product overrides, configure rounding and VAT policy, create package prices, inspect price history, preview prices, inspect expected gross margin and approve commercial changes.

Supplier cost and margin information must never be available to normal customers.

## Price preview
Admin preview should show:
Supplier Cost + Direct Costs = True Cost
True Cost + Target Margin = Selling Price EX VAT
Selling Price EX VAT + VAT = Customer Price INC VAT

The preview must distinguish calculations from the currently published customer price.

## Commercial safeguards
Prevent publication when supplier cost, target margin, VAT/tax policy or valid price version is missing; when resulting price violates configured minimums; when currency is inconsistent; when a bundle contains inactive/unresolved variants; or when a quote/order references an invalid price state.

Do not automatically publish supplier price updates without validation.

## Audit trail
Audit supplier-cost imports, price-version creation, pricing-rule changes, margin changes, fixed-price overrides, bundle-price changes, discounts, quote overrides and manual adjustments. Record actor, timestamp, affected entity, previous value, new value and reason where required.

## Reporting
Support revenue EX VAT, revenue INC VAT, VAT collected, supplier cost, true cost, gross profit, gross margin, discount value, product profitability, bundle profitability, quote profitability and profitability by customer/company.

Reporting uses captured transaction economics, not today's catalogue prices.

## Initial Print Kings policy
The September 2026 supplier list is the initial commercial source. The previously discussed 30% gross-margin calculation is an example/default candidate only, NOT the frozen final Print Kings margin policy. Target margin must therefore remain configurable from day one.

No customer-facing selling prices should be permanently hardcoded until the commercial policy is approved.

## Implementation boundary
Pricing belongs in trusted/server-side application logic and database functions where appropriate. The browser may display trusted results but must not be the authority for final order pricing, discounts, VAT, payment amount, margin, supplier cost or quote conversion.

Final customer payment amounts must be independently validated before payment/order completion.
