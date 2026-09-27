import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Tables } from "./database.types";

export type CartItem = {
  variantId: string;
  productName: string;
  variantName: string;
  categoryName: string;
  categorySlug: string;
  variantSlug: string;
  priceCents: number | null;
  quantity: number;
  configuration?: Record<string, unknown>;
  brandingNotes?: string;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
};

const KEY = "print-kings-cart";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) ?? "[]") as CartItem[]; }
    catch { return []; }
  });
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotalCents: items.reduce((sum, item) => sum + (item.priceCents ?? 0) * item.quantity, 0),
    add: (item, quantity = 1) => setItems(current => {
      const existing = current.find(x => x.variantId === item.variantId);
      if (existing) return current.map(x => x.variantId === item.variantId ? { ...x, quantity: x.quantity + quantity } : x);
      return [...current, { ...item, quantity }];
    }),
    remove: variantId => setItems(current => current.filter(x => x.variantId !== variantId)),
    setQuantity: (variantId, quantity) => setItems(current => quantity <= 0 ? current.filter(x => x.variantId !== variantId) : current.map(x => x.variantId === variantId ? { ...x, quantity } : x)),
    clear: () => setItems([])
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}

export function catalogueToCart(item: Tables<"public_catalogue">): Omit<CartItem, "quantity"> {
  return {
    variantId: item.variant_id!,
    productName: item.product_name ?? item.variant_name ?? "Print Kings product",
    variantName: item.variant_name ?? item.product_name ?? "Configuration",
    categoryName: item.category_name ?? "Print Kings",
    categorySlug: item.category_slug ?? "products",
    variantSlug: item.variant_slug ?? item.variant_id!,
    priceCents: item.price_cents
  };
}
