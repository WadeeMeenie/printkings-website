# Print Kings — Order Workflow

## Canonical lifecycle
QUOTE → PENDING PAYMENT → PAID → ARTWORK REQUIRED → ARTWORK REVIEW → PROOF SENT → AWAITING APPROVAL → APPROVED → PRODUCTION → READY → DISPATCHED → DELIVERED.

Orders may skip stages when a stage is not applicable.

## Payment rule
The client must never be trusted to declare payment successful. Payment provider confirmation must be verified server-side before the order becomes PAID.

## Order data
Order identity, customer/company, line items, configured setup, pricing snapshot, payment state, artwork state, production state, shipping state and audit history must be retained.

## History
Status changes should create immutable order-status-history records containing actor, previous state, new state, timestamp and optional reason.
