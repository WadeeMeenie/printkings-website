# Print Kings — Order State Machine

## Purpose
Define the canonical lifecycle and valid transitions for every Print Kings order. The state machine is authoritative for operational workflow; the UI must render it rather than invent its own lifecycle.

## Order states

### DRAFT
Internal/order-construction state before the order is finalized.

### PENDING_PAYMENT
Order exists and payment is expected. Amount and currency are locked for the payment attempt.

### PAID
A payment amount matching the expected transaction has been independently verified.

### ARTWORK_REQUIRED
One or more order items require customer artwork before production can proceed.

### ARTWORK_REVIEW
Submitted artwork is being checked.

### PROOF_SENT
A production proof has been issued and is awaiting customer decision.

### AWAITING_APPROVAL
Customer approval is required before production.

### APPROVED
All required artwork/proofs have reached the required approval state.

### PRODUCTION
Order has entered production.

### READY
Production is complete and the order is ready for collection/dispatch.

### DISPATCHED
Shipment has been handed to the carrier or otherwise dispatched.

### DELIVERED
Delivery has been confirmed.

### CANCELLED
Order is cancelled and will not proceed through production.

### REFUND_PENDING
A refund has been requested/authorized but is not yet confirmed complete.

### REFUNDED
Required refund has been confirmed.

## Canonical transitions

| From | To | Requirement |
|---|---|---|
| DRAFT | PENDING_PAYMENT | Order totals validated and payment initiated |
| PENDING_PAYMENT | PAID | Server-side payment verification succeeds |
| PENDING_PAYMENT | CANCELLED | Payment expires/fails and order is cancelled |
| PAID | ARTWORK_REQUIRED | Required artwork is missing |
| PAID | ARTWORK_REVIEW | Artwork already supplied and review required |
| PAID | APPROVED | No artwork/proof approval is required |
| ARTWORK_REQUIRED | ARTWORK_REVIEW | Required artwork submitted |
| ARTWORK_REVIEW | PROOF_SENT | Proof created and sent |
| ARTWORK_REVIEW | ARTWORK_REQUIRED | Artwork rejected/missing correction |
| PROOF_SENT | AWAITING_APPROVAL | Customer proof notification issued |
| AWAITING_APPROVAL | APPROVED | Customer approval recorded |
| AWAITING_APPROVAL | ARTWORK_REVIEW | Customer requests correction |
| APPROVED | PRODUCTION | Production release conditions satisfied |
| PRODUCTION | READY | Production completed and QA passed |
| READY | DISPATCHED | Shipment/dispatch recorded |
| DISPATCHED | DELIVERED | Delivery confirmed |
| PAID | REFUND_PENDING | Authorized refund initiated |
| PRODUCTION | REFUND_PENDING | Exception/refund policy explicitly permits |
| REFUND_PENDING | REFUNDED | Refund provider confirmation received |

## Quote-origin orders
An accepted quote creates an order using the exact accepted quote version.

Normal path:
QUOTE ACCEPTED → DRAFT/PENDING_PAYMENT → PAID → remaining workflow.

The order must retain the accepted quote and version identifiers.

## Skip rules
The workflow may skip irrelevant stages:
- no artwork required: PAID → APPROVED
- artwork supplied before payment: PAID → ARTWORK_REVIEW
- no proof required: ARTWORK_REVIEW → APPROVED when policy permits
- collection instead of shipping: READY → DELIVERED may require an explicit collection confirmation rather than DISPATCHED

Skipping a stage is not permission to bypass its business requirement.

## Payment rules
- Browser success pages never transition an order to PAID.
- Verified provider event/verification is required.
- Amount and currency must match the expected payment.
- Duplicate provider events must be idempotent.
- Underpayment does not produce PAID.
- Overpayment requires explicit handling and must not silently alter order totals.

## Artwork rules
An artwork-dependent order cannot enter PRODUCTION until required artwork/proof approvals are complete.

## Production rules
Only authorized operational roles/services can release an APPROVED order into PRODUCTION.

## Shipping rules
Only READY orders may normally enter DISPATCHED.
Tracking data should be captured when available.

## Cancellation/refund rules
Cancellation/refund behavior depends on production state and commercial policy. The system must not assume every paid order can be freely cancelled after production starts.

## Transition authorization
- Customer: submit artwork, approve proofs, accept/confirm customer actions where applicable.
- Sales/Admin: quote/order commercial changes and authorized cancellations.
- Artwork: artwork review/proof actions.
- Production: production release/completion.
- System/payment service: verified payment transitions.
- Shipping/operations: dispatch/delivery transitions.

## Transition implementation
Every transition must:
1. Validate current state.
2. Validate actor/service authorization.
3. Validate required prerequisites.
4. Perform the state change atomically.
5. Append immutable order_status_history.
6. Record audit information where sensitive.
7. Emit the appropriate notification/event after successful commit.

## Idempotency
Repeated requests for an already-completed transition must not create duplicate payments, duplicate orders, duplicate shipment records or conflicting history.

## UI behavior
The frontend should derive available actions from server-returned order state and permitted transitions. It must never decide that an order is production-ready solely from local state.

## Operational exceptions
Future implementation may add explicit exception states/events for failed production, damaged goods, carrier exceptions and returns. Do not overload the normal lifecycle with undocumented free-form statuses.

## Acceptance criteria
- Every transition is validated server-side.
- Invalid transitions are rejected.
- History is append-only.
- Payment verification is authoritative.
- Artwork gates production.
- Quote version is retained.
- Cancellation/refund actions are auditable.
- Repeated events are idempotent.
