# Print Kings — Product Specification

## Status
Planning draft. Implementation is blocked until business, catalogue, pricing, UX, architecture, security and brand gates are reviewed.

## Requirement format
Each requirement will use an ID and Given/When/Then acceptance criteria.

## Core requirements
### PK-HOME-001
GIVEN a first-time visitor
WHEN the homepage loads
THEN the visitor understands what Print Kings sells and can enter Build Your Setup, Shop Products or Get a Quote.

### PK-CAT-001
GIVEN a published product
WHEN its product page loads
THEN customer-safe product information, configuration, pricing and purchase/quote actions are available.

### PK-SETUP-001
GIVEN a customer starts Build Your Setup
WHEN they choose a use case
THEN the builder presents relevant setup options.

### PK-PRICE-001
GIVEN a product has a current active price version
WHEN its customer price is displayed
THEN the displayed price is derived from authoritative pricing data and never from a hardcoded UI constant.

### PK-PAY-001
GIVEN a customer attempts payment
WHEN payment completes
THEN the order becomes PAID only after trusted payment verification.

### PK-SEC-001
GIVEN a customer is authenticated
WHEN they request private order/artwork data
THEN only resources belonging to that customer are returned.

### PK-ADMIN-001
GIVEN an authorized admin
WHEN they change a price or operational state
THEN the change is persisted and auditable.

## Definition of done
Implemented → typecheck/build → automated tests → runtime verification → visual QA where applicable → security verification → documentation/state update.
