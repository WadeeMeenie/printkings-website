# Print Kings — Agent Operating Rules

## Mission
Build Print Kings as a production-grade South African outdoor branding and event-display commerce platform.

## Non-negotiables
- Do not start implementation from assumptions. Read the applicable docs first.
- Treat /docs and /ai as the project source of truth.
- Preserve supplier costs and internal commercial data from public clients.
- Use data-driven catalogue, pricing, bundles, setup recommendations and order states.
- Never hardcode supplier pricing into UI components.
- Verify builds, tests, runtime behaviour and security after meaningful changes.
- Do not claim work is complete without evidence.
- Do not invent product specifications, supplier pricing, stock, delivery promises or brand colours.
- Customer-facing copy must use Print Kings names, not supplier SKU terminology unless intentionally exposed.
- Keep MVP scope controlled. Do not introduce AI/3D/AR features before the core commerce workflow works.

## Preferred execution loop
Requirement → plan → implement → build → test → runtime verify → visual QA → security verify → document → commit → update /ai/STATE.md.

## Current phase
Frontend implementation.

The initial customer-facing application is being built against the existing Supabase backend. The first functional pass covers Home, Shop, Product Pages, Setup Builder, Packages, Solutions, Cart, authenticated Quotes, Checkout/Yoco handoff, authentication and checkout result states.

External payment secrets and approved product imagery remain environment/content configuration rather than reasons to fake functionality.
