# Print Kings — Production Recovery

**Date:** 29 September 2026
**Scope:** Recovery work from the live-site visual and commerce audit.

## Implemented

| Issue | Fix | Verification |
|---|---|---|
| Setup Builder blocked at required empty step 1 | Builder now loads public setup configuration after an anonymous-session bootstrap and omits empty configuration steps. The selected setup type already captures the purpose/environment choice. | Fresh local browser session: Markets loads 4 options at step 1, then 50, 30, and 13 options; full selection reaches Review without a runtime error. |
| Builder final step could not reach Review | Next-step transition now advances to `steps.length`; review header safely handles the absence of a current step. | Browser flow reaches `REVIEW YOUR SETUP.`. |
| Packages empty for signed-out visitors | Packages waits for the shared public-session bootstrap before querying bundles. | Fresh local browser session renders Corporate Setup, Event Pro, and Market Pro with prices. |
| Builder type/configuration queries returned 401 before checkout | Added `ensurePublicSession()` in `src/lib/supabase.ts`, reused by Packages, Setup Builder, and Checkout. This is a compatibility mitigation for the currently deployed RLS behavior; it does not disable RLS or expose private data. | Fresh local browser session loads public setup data before any checkout navigation. |
| Checkout delivery methods could be empty | Shipping methods now load after the same session bootstrap. | Build passes; checkout query is sequenced after session readiness. |
| Quote page hung on `Checking account…` | Added guarded error/finally handling so `session` always resolves to signed-in or signed-out. | Fresh local browser shows the sign-in gate, not the spinner. |
| `-Sided Fabric Frame` product name | Product-family cleanup no longer strips `double` from `double-sided`. | Product page heading renders `Double-Sided Fabric Frame`. |
| Duplicate related product families | Related products are now filtered deterministically by family, excluding the current family. | Product page runtime check returns deduplicated family cards. |
| No add-to-cart confirmation | Product button announces `Added to cart ✓` through an `aria-live` button state for 2.5 seconds. | Browser click updates button text and cart count. |
| Broken `?type=market` links | Home and Solutions Markets links now use the live `markets` slug. | Source and runtime routes verified. |
| Opaque/legacy logo | Added canonical transparent SVG at `public/brand/print-kings-logo.svg`, updated header/footer references, and removed obsolete PNG/WebP logo files. | SVG is present in `dist/brand/`; embedded artwork contains transparent pixels; build succeeds. |

## Validation

- `npm run build` — **passed**.
- `tsc -b` — **passed** as part of the build.
- Local browser smoke test — **passed** for Home, Packages, Builder, Quote, and Product pages.
- Local builder journey — **passed** through Review.
- Local product journey — **passed** with add-to-cart feedback and cart count increment.
- No browser console errors in the smoke test.

## Backend follow-up

The live Supabase project currently has RLS policies that call `is_admin()` for public configuration tables. The frontend mitigation starts an anonymous Supabase session before those public reads. The durable backend fix is to revise those policies so public rows are readable by `anon`/authenticated users according to the documented public catalogue boundary, without disabling RLS globally. This environment has no privileged Supabase migration credentials, so no production policy was altered directly.

The Yoco merchant identity (`PawGo`) is controlled by the deployed payment configuration/account and was not changed or guessed in frontend code.
