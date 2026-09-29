# Print Kings product image governance

## Purpose

This workflow prevents catalogue imagery from becoming generic, misleading, or operationally untraceable. A product image is attached only when it identifies the **same physical product variant** as the Print Kings catalogue record.

> **Core rule:** a polished image is not a substitute for verified product identity. If identity or visual suitability cannot be established, show the product-name placeholder and keep the item out of automated image assignment.

## Current implementation

- **Catalogue scope:** 85 product variants.
- **Approved local assets:** 27 exact-SKU-verified, visually reviewed WebP files.
- **Database mapping:** each approved image has one unique `product_images` row with `approved = true`, `is_primary = true`, a local `storage_path`, and no `external_url`.
- **Storefront behaviour:** Shop, product detail, cart, and Setup Builder resolve only paths beginning `images/products/`; unmapped items render the existing product-name placeholder.
- **Source evidence:** the full 85-SKU evidence matrix and manual-review queue live in [`audit/`](../audit/).

## Source priority

1. **Existing approved Print Kings asset** that is already mapped to the exact SKU/variant.
2. **Official Display Mania product image** on an exact-SKU verified Display Mania product page, where its use is authorized for the Print Kings catalogue.
3. **New original neutral product representation** created from verified manufacturer specifications and reference material, if supplier imagery cannot be used. It must not add unverified features, branding, or configuration claims.
4. **Name placeholder only** when none of the above can be defended.

Do **not** use Google-image results, marketplace thumbnails, supplier-category placeholders, AI-generated product substitutes, or a shared category image as a shortcut for unverified variants.

## Identity and approval gate

A candidate may enter visual QA only when all checks pass:

| Gate | Requirement |
| --- | --- |
| Catalogue identity | `product_id`, `variant_id`, product name, and variant name agree with the current catalogue export. |
| SKU identity | The official Display Mania SKU exactly equals the Print Kings supplier SKU/variant SKU. Similar names, dimensions, or silhouettes are not enough. |
| Source page | A traceable official `displaymania.co.za` product page is recorded. |
| Source image | A direct official source image is recorded; raw source URLs are retained for audit, not rendered by production. |
| Visual QA | The asset visibly matches product family, configuration, construction, sizing/orientation where material, and any relevant single/double-sided state. |
| Local delivery | The approved asset is stored under `public/images/products/` as WebP and mapped through `product_images.storage_path`. |

### Limited master-image exception

A single official family master can serve closely related variants **only** when the evidence shows that the only difference is documented scale and the image does not suggest a materially different configuration. Record this decision in the visual-QA note. Do not use a master image across different material, shape, base, sidedness, hardware, or silhouette variants.

## Asset and database conventions

| Concern | Rule |
| --- | --- |
| Local file path | `public/images/products/<safe-category>-<variant-sku>.webp` |
| Database path | `images/products/<safe-category>-<variant-sku>.webp` |
| Database source | `product_images` only; `external_url` remains `NULL` for production catalogue assets. |
| Primary image | One approved primary image per mapped variant unless a separately verified gallery is needed. |
| Alt text | Plain product/variant name, e.g. `Bow Flag 2m Single product image`. |
| Evidence | Record official page URL, source image URL, product/SKU evidence, visual QA decision, local path, and file checksum in the audit mapping. |
| Accessibility | Use a meaningful `alt` value; never use a supplier URL as alt text. |

## Procedure for new or changed products

1. **Export the live catalogue inventory** with product ID, variant ID, SKU, names, category, and route slugs.
2. **Search official sources by exact SKU first.** Use exact product name only to find a page, not to upgrade confidence.
3. **Record the evidence** in the mapping file: official page URL, official SKU, direct image URLs, verified attributes, and rejected near-matches.
4. **Apply the exact-SKU gate.** Downgrade any candidate with a missing/different supplier SKU, even if it looks correct.
5. **Collect local review copies** of only strict candidates. Do not place them in `public/` before visual approval.
6. **Visually inspect each source** against the verified variant. Reject uncertain orientation, configuration, or product-family matches.
7. **Create local WebP output** without cropping or altering product features. Confirm file dimensions and re-encoding quality.
8. **Insert an idempotent `product_images` mapping** using `product_id`, `variant_id`, local `storage_path`, `approved = true`, `is_primary = true`, and `external_url = NULL`.
9. **Test all paths:** Shop cards, product detail gallery, cart, Setup Builder option tile, and direct static asset URLs.
10. **Update audit documentation** and keep non-approved rows in the manual-review queue.

## When no reliable image exists

Leave the product unassigned. The storefront deliberately displays a product-name placeholder plus “Product image coming soon.” This is preferable to showing the wrong gazebo, banner, frame, chair, or counter.

If a new original image is required, create a neutral, unbranded representation only from verified attributes, then subject it to the same visual review and database mapping procedure. Never infer dimensions, construction, sidedness, accessory bundle, or colour from adjacent catalogue items.

## Ongoing review

- Re-audit mapped imagery after any supplier SKU, product-name, or product-configuration change.
- Remove or unapprove a mapping immediately if a supplier changes the product page or a visual mismatch is discovered.
- Confirm commercial reuse rights for official supplier imagery with the supplier agreement or rights holder before expanding the approved image set.
- Keep the current evidence artifacts with the release so later catalogue work can distinguish verified mapping from unverified research.
