export type ProductImageInput = {
  productName?: string | null;
  variantName?: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
};

/**
 * Print Kings has one canonical storefront image source:
 * committed assets under public/images/products.
 *
 * externalUrl remains accepted for backwards-compatible callers, but is
 * deliberately ignored so supplier/Dropbox URLs can never become a second
 * storefront source of truth.
 */
export function resolveMappedProductImage(
  storagePath?: string | null,
  _externalUrl?: string | null,
): string | null {
  const normalized = (storagePath ?? "").replace(/^\/+/, "");
  if (!normalized.startsWith("images/products/")) return null;
  return (
    import.meta.env.BASE_URL +
    normalized.split("/").map(encodeURIComponent).join("/")
  );
}

export function productImageAlt(input: ProductImageInput): string {
  return input.variantName || input.productName || input.categoryName || "Print Kings product";
}
