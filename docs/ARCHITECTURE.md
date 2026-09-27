# Print Kings — Architecture

## Planned stack
- React
- Vite
- TypeScript
- Tailwind CSS
- Supabase
- Yoco
- Supabase Storage

The exact dependency versions are selected during repository initialization and verified against current official documentation before implementation.

## Layers
Presentation/UI → application/domain logic → data/services → Supabase/Yoco.

## Principles
- Business logic is not duplicated between UI components.
- Pricing calculations are authoritative on the server/domain layer.
- Public catalogue reads are separated from protected commerce/admin operations.
- Setup Builder rules are data-driven.
- Payments are verified server-side.
- File access is authorization-controlled.
- Keep the MVP modular so future visual configuration can be added without rewriting commerce.

## Production readiness
Every vertical slice must pass typecheck/build/tests, runtime verification, visual QA where applicable, and security review before being considered complete.
