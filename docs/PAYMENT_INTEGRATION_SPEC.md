# Print Kings — Payment Integration Specification

## Scope
Authoritative checkout/payment boundary between Print Kings, Supabase and Yoco Checkout API.

## Flow
1. Authenticated customer starts checkout.
2. Print Kings recalculates cart lines from the current published customer price.
3. Tax is calculated server-side.
4. Order and payment attempt are created transactionally.
5. Yoco checkout is created server-side in ZAR cents.
6. Customer completes payment on Yoco.
7. Yoco sends a signed payment webhook.
8. Print Kings verifies timestamp, signature, payment reference, amount and currency.
9. Payment becomes VERIFIED only after successful verification.
10. Order becomes PAID only after a VERIFIED payment exists for the exact order total.

## Yoco contract
- Checkout endpoint: POST /api/checkouts.
- Base URL: https://payments.yoco.com/api.
- Amount is integer minor units.
- Currency is ZAR.
- Idempotency-Key is the Print Kings payment UUID.
- Checkout metadata carries Print Kings order/payment references.
- Webhook uses webhook-id, webhook-timestamp and webhook-signature.

## Security
- Yoco secret key is server-only.
- Webhook verification uses the raw request body and HMAC-SHA256.
- Webhook timestamp is rejected outside the configured replay window.
- Duplicate events are idempotent.
- Amount/currency mismatches never mark an order paid.
- Browser redirects never authorize payment.

## Current production blockers
- Shipping calculation is not implemented; the current checkout layer explicitly records shipping as pending implementation and must not be treated as production-ready.
- Configure YOCO_SECRET_KEY, YOCO_WEBHOOK_SECRET and PRINT_KINGS_APP_URL as Edge Function secrets.
- Register the Yoco webhook against the deployed yoco-webhook function and store its signing secret securely.
- Verify the production domain with Yoco before live payments.
- Complete Yoco test-mode end-to-end checkout tests before enabling live payments.
