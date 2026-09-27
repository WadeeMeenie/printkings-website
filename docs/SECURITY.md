# Print Kings — Security Plan

## Authentication
Supabase Auth for customer/admin authentication.

## Authorization
Use role-based access plus Row Level Security.

## Customer boundary
A customer can only read/write resources explicitly belonging to that customer or permitted public resources.

## Admin boundary
Admin roles are explicit. Do not rely on hidden UI controls as authorization.

## Commercial secrecy
Supplier costs, margins, internal pricing rules and operational notes must never be exposed to anonymous/public clients.

## Storage
Private customer artwork/proof storage with ownership-aware policies. Public product images use a separate public/read path.

## Payments
Payment verification occurs server-side. Never trust a browser redirect as proof of payment.

## Audit
Record sensitive administrative changes including pricing, order status, permissions, refunds and other financially meaningful actions.

## Secrets
No payment, Supabase service-role or other private secret may be committed to Git or exposed to client bundles.
