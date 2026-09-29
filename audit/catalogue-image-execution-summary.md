# Print Kings catalogue image execution summary

## Completed scope

The live catalogue contained **85 variants**. All 85 were researched against official Display Mania sources and passed through an exact-SKU identity gate before any image could be attached.

| Outcome | Count | Treatment |
| --- | ---: | --- |
| Exact SKU + direct official source + visual QA passed | **27** | Locally hosted WebP assets and approved database mappings inserted. |
| Exact SKU but visual source rejected | **1** | Left unmapped: FF097 / 50mm Double-Sided Fabric Frame 2000x1000mm. The direct image did not confidently show the portrait variant. |
| Not eligible for automatic attachment | **57** | Left unassigned; storefront renders the product-name placeholder. |
| Total | **85** | No generic category image was assigned. |

## Verification outcome

The source workflow reported 30 `EXACT`, 34 `HIGH_CONFIDENCE`, 7 `AMBIGUOUS`, and 14 `UNVERIFIED` results. The stricter local exact-SKU gate accepted **28** identity candidates and downgraded 2 research `EXACT` results because their official SKU evidence was missing or did not exactly match the catalogue SKU.

After direct source collection and visual review, 27 candidate images passed. The value-steel gazebo source URL recorded by initial research had become unavailable; the same official product page supplied current official replacement references, which were reviewed and documented.

## Production changes applied

- Created **27 local WebP files** under `public/images/products/`.
- Inserted **27 approved `product_images` mappings** with unique local `storage_path` values.
- Verified the database has `27` approved mapping rows, `27` local static paths, `0` external URLs, and `27` distinct paths.
- Updated Shop, Product Page, Cart, and Setup Builder to render only `storage_path` values under `images/products/`.
- Removed all prior generic studio image fallbacks and the corresponding generic product asset files.
- Confirmed every approved static asset returns HTTP 200 with an image MIME type in local preview.
- Checked a mapped product image in Shop, product detail, and Cart. The local validation cart was cleared afterward.

## Decisions that deliberately protect accuracy

- **No visually similar substitution:** 57 unresolved variants stay on the placeholder rather than borrowing category imagery.
- **No raw supplier URLs in production:** source URLs remain in audit evidence only; production uses local files.
- **No uncertain portrait frame image:** the FF097 mapping was withheld despite exact SKU evidence.
- **Limited family-master use:** only for documented size-only variation within the same exact SKU-verified product family; each decision is recorded in the asset QA note.

## Evidence artifacts

| Artifact | Purpose |
| --- | --- |
| `catalogue-inventory.csv` / `.json` | Snapshot of live catalogue identity before image work. |
| `display-mania-reference-results.json` | Complete unmodified official-reference workflow output. |
| `catalogue-image-identity-matrix.md` | All 85 records, source URLs, confidence, and exact-gate outcome. |
| `manual-review-image-exceptions.md` | Detailed queue of variants not approved for automatic attachment. |
| `approved-product-image-assets.md` / `.csv` / `.json` | Approved local asset map, source page, QA notes, checksums, and output details. |
| `rejected-product-image-assets.json` | Visual QA rejection record for FF097. |
| `insert_approved_product_images.sql` | Reproducible idempotent insert plan used for approved mappings. |
| `PRODUCT_IMAGE_GOVERNANCE.md` | Ongoing operating procedure and content rules. |

## Remaining work

The 57 unresolved entries need one of: a supplier-provided exact SKU/photo, a verified official product-page variation record, or a newly created neutral representation grounded in verified specifications. Until then, their product-name placeholder is intentional and correct.
