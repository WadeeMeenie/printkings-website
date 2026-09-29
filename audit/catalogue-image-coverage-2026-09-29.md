# Print Kings Catalogue Image Coverage — 2026-09-29

## Final database verification

- Catalogue variants: **85**
- Variants with at least one image reference: **85**
- Variants without an image reference: **0**
- Existing approved images: **27**
- Supplier/reference images: **58**
- Approved images overwritten: **0**

The image-reference completion work was performed without replacing existing approved imagery. New supplier/reference images remain `approved=false` until visual QA/approval.

## Completion

All 85 catalogue variants now have an image reference available to the storefront's existing image resolver.

The final ten previously unresolved variants were mapped:

- FS072 — Lollipop A4 Square Base
- FS073 — Lollipop A3 Square Base
- ID325 — Pop-Up Expo Table 1000x400x800mm
- OD286 — Premium Parasol 2m
- OD297 — Prism 2.1m Ground Spikes
- OD304 — Everyday Value Parasol 2m
- OD306 — Prism 2.1m Indoor Base
- OD319 — Flame Lantern 1.8m Indoor Base
- PR357 — Airtek Mesh Fence 2x1m
- PR358 — Airtek Mesh Fence 3x1m

These are reference mappings, not automatic approvals.

## Safety rule

Existing `approved=true` images must not be replaced or downgraded by catalogue-image research.

## Source strategy

1. Display Mania first.
2. Match product family, configuration, dimensions and physical construction.
3. If Display Mania does not expose a usable image, use a Google-discovered supplier/equivalent reference.
4. Reject category-only lookalikes when the physical configuration cannot be established.
5. Keep references unapproved until visual QA.
