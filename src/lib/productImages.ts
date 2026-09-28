export type ProductImageInput = {
  productName?: string | null;
  variantName?: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
};

const base = "/printkings-website/images/products/";

const productImages = {
  gazebo: `${base}gazebo-pop-up-studio.webp`,
  flag: `${base}feather-flag-studio.webp`,
  rollup: `${base}rollup-banner-studio.webp`,
  counter: `${base}promo-counter-studio.webp`,
  kiosk: `${base}kiosk-studio.webp`,
  chair: `${base}branded-chair-studio.webp`,
  table: `${base}branded-table-studio.webp`,
  frame: `${base}display-frame-studio.webp`,
  backdrop: `${base}backdrop-banner-studio.webp`,
} as const;

export function resolveProductImage(input: ProductImageInput): string | null {
  const text = [input.variantName, input.productName, input.categoryName, input.categorySlug]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/kiosk|pod|sales booth/.test(text)) return productImages.kiosk;
  if (/gazebo|marquee|canopy|tent/.test(text)) return productImages.gazebo;
  if (/feather|teardrop|blade flag|beach flag|flag/.test(text)) return productImages.flag;
  if (/roll.?up|roller banner|pull.?up|banner stand/.test(text)) return productImages.rollup;
  if (/counter|reception desk|promo desk|promotion desk/.test(text)) return productImages.counter;
  if (/chair|seat|director chair/.test(text)) return productImages.chair;
  if (/table|trestle/.test(text)) return productImages.table;
  if (/backdrop|step.?and.?repeat|fabric wall|media wall/.test(text)) return productImages.backdrop;
  if (/frame|pop.?up display|collapsible display|truss/.test(text)) return productImages.frame;
  if (/banner|indoor branding/.test(text)) return productImages.backdrop;
  if (/gazebo|kiosk/.test(input.categorySlug ?? "")) return productImages.gazebo;
  if (/flag/.test(input.categorySlug ?? "")) return productImages.flag;
  if (/banner|indoor/.test(input.categorySlug ?? "")) return productImages.backdrop;
  if (/furniture/.test(input.categorySlug ?? "")) return productImages.chair;
  if (/counter|promo/.test(input.categorySlug ?? "")) return productImages.counter;
  if (/frame|component|display/.test(input.categorySlug ?? "")) return productImages.frame;

  return null;
}

export function productImageAlt(input: ProductImageInput): string {
  return input.variantName || input.productName || input.categoryName || "Print Kings product";
}
