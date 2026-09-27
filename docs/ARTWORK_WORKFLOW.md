# Print Kings — Artwork Workflow

## Customer uploads
Initial supported formats should include PNG/JPG/JPEG/PDF/SVG where appropriate to the product and production workflow.

## Lifecycle
Uploaded → Under Review → Proof Ready → Customer Approval → Approved → Production.

## Storage
Use private Supabase Storage buckets/policies for customer artwork and proofs. Public product media is separate.

## Security
Customers can access only files belonging to their own orders/quotes. Admin roles receive only the access required for their work.

## Production rule
Artwork approval is a meaningful business state. Production must not begin for artwork-dependent orders until the required approval state is reached.
