export type ProductImageInput = {
  productName?: string | null;
  variantName?: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
};

/**
 * Resolves only curated, repository-hosted product imagery. Supplier reference URLs
 * are deliberately not rendered by the storefront; approved assets are copied into
 * public/images/products and mapped through product_images.storage_path.
 */
export function resolveMappedProductImage(storagePath?: string | null): string | null {
  const normalized = (storagePath ?? "").replace(/^\/+/, "");
  if (!normalized.startsWith("images/products/")) return null;
  return `${import.meta.env.BASE_URL}${normalized}`;
}

export function productImageAlt(input: ProductImageInput): string {
  return input.variantName || input.productName || input.categoryName || "Print Kings product";
}
