export type ProductImageInput = {
  productName?: string | null;
  variantName?: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
};

export function resolveMappedProductImage(storagePath?: string | null, externalUrl?: string | null): string | null {
  const normalized = (storagePath ?? "").replace(/^\/+/, "");
  if (normalized.startsWith("images/products/")) return import.meta.env.BASE_URL + normalized;
  if (externalUrl && externalUrl.startsWith("https://displaymania.co.za/")) return externalUrl;
  return null;
}

export function productImageAlt(input: ProductImageInput): string {
  return input.variantName || input.productName || input.categoryName || "Print Kings product";
}
