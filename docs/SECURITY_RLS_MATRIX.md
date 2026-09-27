# Print Kings — Security and RLS Matrix

## Security principles
1. Default deny.
2. Public access only to explicitly public catalogue data.
3. Customer data is owner-scoped.
4. Company data is membership-scoped.
5. Supplier and commercial data is never public.
6. Privileged writes occur through trusted server-side functions/services where appropriate.
7. Storage policies mirror database ownership.
8. Sensitive actions are audited.
9. Service-role credentials never reach the browser.

## Roles
CUSTOMER, COMPANY_MEMBER, SALES, ARTWORK, PRODUCTION, ADMIN, SUPER_ADMIN.

Role membership is explicit and verified server-side.

## Access matrix
| Resource | Public | Customer | Company | Sales | Artwork | Production | Admin |
|---|---|---|---|---|---|---|---|
| Public catalogue | Read | Read | Read | Read | Read | Read | CRUD |
| Supplier costs | No | No | No | No | No | No | Authorized |
| Pricing rules/margins | No | No | No | No | No | No | Authorized |
| Supplier data | No | No | No | No | No | No | Authorized |
| Profile | No | Own | Own | Support | No | No | Authorized |
| Company | No | Membership | Own | Authorized | No | No | CRUD |
| Addresses | No | Own | Company | Authorized | No | No | CRUD |
| Cart | No | Own | Company | No | No | No | Support |
| Orders | No | Own | Company | Sales scope | Operational scope | Production scope | CRUD |
| Quotes | No | Own | Company | Sales scope | No | No | CRUD |
| Artwork | No | Own order/quote | Company | Needed view | Assigned scope | Needed view | CRUD |
| Proofs | No | Own order/quote | Company | Needed view | Assigned scope | Needed view | CRUD |
| Payments | No | Own, safe fields | Company, safe fields | Authorized | No | Operational | Authorized |
| Shipments | No | Own | Company | Sales scope | No | Operational | CRUD |
| Audit logs | No | No | No | No | No | No | Authorized |
| Admin roles | No | No | No | No | No | No | Super Admin |

## Public catalogue boundary
Do not expose raw catalogue tables if they contain supplier/commercial fields. Use a safe view/function/API response containing only public identity, descriptions, approved customer price, public specifications, public images and verified availability.

## Ownership
Customer reads/writes are restricted by authenticated user identity. Company resources require active company membership. Never trust client-supplied user_id or company_id.

## Admin authorization
Do not rely on mutable client-provided roles. Use trusted role membership and server-side authorization.

## Storage
product-media: public/read-safe catalogue media.
artwork-private: private customer artwork with owner/staff policies.
proofs-private: private proofs with owner/staff policies.

Object paths are not authorization by themselves.

## Sensitive fields
Never expose supplier cost, true cost, target margin, internal pricing rules, internal supplier notes, service-role credentials, payment secrets or private audit data.

## Payment security
Provider secrets remain server-side. Provider events must be authenticated/verified before payment state changes.

## Audit
Audit role changes, security-sensitive changes, supplier-cost changes, pricing changes, quote price overrides, order status overrides, refunds, payment reconciliation and artwork approval overrides.

## Security testing
Test anonymous access, cross-customer access, cross-company access, staff-role isolation, direct table/API access, Storage enumeration, supplier-cost exposure, absence of secrets from the client bundle and payment webhook authorization.
