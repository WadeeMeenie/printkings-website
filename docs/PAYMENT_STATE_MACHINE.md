# Print Kings — Payment State Machine

## Purpose
Define payment lifecycle independently from order lifecycle. Payment state is controlled by trusted payment-provider verification and server-side application logic.

## Payment states

### INITIATED
A payment attempt has been created for a known order amount/currency.

### PENDING
The provider has not yet supplied sufficient verified information to mark the payment successful.

### VERIFIED
The provider has independently confirmed the expected payment amount and currency.

### FAILED
The payment attempt failed or was definitively rejected.

### EXPIRED
The payment attempt expired without successful verification.

### CANCELLED
The payment attempt was cancelled.

### REFUND_PENDING
A refund has been initiated but is not confirmed complete.

### REFUNDED
The refund has been confirmed.

### PARTIALLY_REFUNDED
Only part of the captured payment has been refunded.

### DISPUTED
The provider has reported a dispute/chargeback event requiring handling.

## Valid transitions

| From | To | Authority |
|---|---|---|
| INITIATED | PENDING | Payment created |
| INITIATED | VERIFIED | Trusted provider verification succeeds immediately |
| PENDING | VERIFIED | Trusted provider verification succeeds |
| PENDING | FAILED | Provider reports definitive failure |
| PENDING | EXPIRED | Payment attempt expires |
| PENDING | CANCELLED | Authorized cancellation |
| VERIFIED | REFUND_PENDING | Authorized refund initiated |
| REFUND_PENDING | REFUNDED | Provider confirms full refund |
| REFUND_PENDING | PARTIALLY_REFUNDED | Provider confirms partial refund |
| PARTIALLY_REFUNDED | REFUND_PENDING | Another refund initiated |
| PARTIALLY_REFUNDED | REFUNDED | Remaining amount refunded |
| VERIFIED | DISPUTED | Provider reports dispute |
| DISPUTED | VERIFIED | Dispute resolved without loss, if provider semantics permit |
| DISPUTED | REFUND_PENDING | Resolution requires refund |

## Payment verification requirements
A payment can become VERIFIED only when trusted server-side verification establishes:
- provider identity
- provider transaction/reference identity
- expected order identity
- expected currency
- expected amount or approved partial-payment policy
- provider success/settlement semantics appropriate to the payment method

A browser redirect, query parameter or client-side success flag is not sufficient.

## Idempotency
Provider events may be delivered multiple times. Verification handling must be idempotent by provider + provider reference/event identity.

Repeated successful events must not:
- create duplicate payments
- duplicate orders
- duplicate order status transitions
- duplicate notifications

## Amount mismatch
If provider amount differs from the expected amount:
- do not mark the payment VERIFIED automatically
- retain the provider evidence
- flag for controlled handling
- never silently change the order total

## Multiple payment attempts
An order may have multiple payment attempts, but only valid verified payment records may satisfy the order's payment requirement.

The order should reference the payment attempt/transaction that actually satisfied payment.

## Payment and order relationship
Payment state does not equal order state.

Examples:
- Payment VERIFIED → order may become PAID after order-level validation.
- Payment FAILED → order may remain PENDING_PAYMENT or become CANCELLED according to policy.
- Payment REFUNDED → order does not automatically become CANCELLED; its commercial/production state is handled separately.
- Payment DISPUTED → order enters an operational review path without inventing a new order state unless explicitly designed.

## Refund rules
Refunds require:
- authorized actor/service
- order/payment reference
- amount
- reason
- provider verification
- audit record

Refund amount cannot exceed the refundable captured amount.

## Security
Payment provider secrets and server credentials remain server-side only. Never expose private keys in React bundles, database public tables or client logs.

## Acceptance criteria
- Client redirects cannot mark payments verified.
- Provider events are idempotent.
- Amount/currency mismatches are blocked from automatic verification.
- Multiple attempts are handled without duplicate fulfillment.
- Refunds are auditable.
- Payment and order states remain separate.
