# Backend Completion Gate — Print Kings

## Completed in this backend phase
- Versioned catalogue and pricing
- Cart and authoritative server checkout
- Shipping methods/rules and shipment records
- Server-side discount validation
- Audit log foundation
- Bundle item composition
- Bundle price resolution
- Setup Builder recommendation rules
- Quote-to-order conversion function
- Yoco checkout Edge Function
- Signed Yoco webhook boundary
- Artwork/proof workflow and private Storage
- RLS/security controls

## Bundle pricing verification
Current calculated EX VAT bundle values from the September 2026 published catalogue:
- Starter Setup: R9,151.57
- Market Pro: R14,127.78
- Event Pro: R15,409.21
- Corporate Setup: R17,993.45
- Signature Setup: Quote

VAT is resolved from the current published ZA VAT policy rather than hardcoding the bundle tax rate.

## Quote conversion
Accepted quotes can be converted exactly once into an order. The order retains the accepted quote snapshot, quote reference, quoted line values and a new payment attempt.

## Remaining backend gate
- Generate/maintain a clean migration history for the iterative DDL performed after the initial migration set.
- Complete end-to-end checkout/Yoco test-mode verification once Yoco credentials are configured.
- Add frontend-generated Supabase types.
- Then begin storefront implementation.

## Production restrictions
- Do not activate Standard Delivery until a verified shipping rate is supplied.
- Do not activate discount codes without explicit commercial approval.
- Do not enable live Yoco payments until secrets, webhook registration and domain verification are complete.
