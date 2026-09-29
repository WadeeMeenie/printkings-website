export type ProductImageInput = {
  productName?: string | null;
  variantName?: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
};

function localProductPhotoFromExternalUrl(externalUrl?: string | null): string | null {
  if (!externalUrl) return null;
  try {
    const url = new URL(externalUrl);
    if (url.hostname !== "www.dropbox.com" && url.hostname !== "dropbox.com") return null;
    const rawName = url.pathname.split("/").filter(Boolean).pop();
    if (!rawName) return null;
    const filename = decodeURIComponent(rawName);
    return import.meta.env.BASE_URL + "images/products/" + encodeURIComponent(filename);
  } catch {
    return null;
  }
}

export function resolveMappedProductImage(storagePath?: string | null, externalUrl?: string | null): string | null {
  const normalized = (storagePath ?? "").replace(/^\/+/, "");
  if (normalized.startsWith("images/products/")) return import.meta.env.BASE_URL + normalized.split("/").map(encodeURIComponent).join("/");
  const localDropboxPhoto = localProductPhotoFromExternalUrl(externalUrl);
  if (localDropboxPhoto) return localDropboxPhoto;
  if (externalUrl && externalUrl.startsWith("https://displaymania.co.za/")) return externalUrl;
  return null;
}

export function productImageAlt(input: ProductImageInput): string {
  return input.variantName || input.productName || input.categoryName || "Print Kings product";
}
