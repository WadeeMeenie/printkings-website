import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Tables } from "../lib/database.types";

type CatalogueItem = Tables<"public_catalogue">;

function money(cents: number | null) {
  if (cents === null) return "Quote";
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);
}

export function ShopPage() {
  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase
      .from("public_catalogue")
      .select("*")
      .eq("category_active", true)
      .order("category_name")
      .order("product_name")
      .limit(24)
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) setError(queryError.message);
        else setItems(data ?? []);
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[.2em] text-zinc-400">Shop the system</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight">PRODUCTS BUILT TO GET YOU SEEN.</h1>
        <p className="mt-5 text-lg leading-8 text-zinc-500">Browse the real Print Kings catalogue. Supplier costs and internal SKUs stay behind the scenes.</p>
      </div>

      {loading && <p className="mt-12 text-zinc-500">Loading catalogue…</p>}
      {error && <p className="mt-12 rounded-2xl bg-red-50 p-5 text-sm text-red-700">Catalogue unavailable: {error}</p>}

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.variant_id} className="rounded-3xl border border-black/10 p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">{item.category_name}</p>
            <h2 className="mt-3 text-xl font-black">{item.variant_name ?? item.product_name}</h2>
            <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-500">{item.short_description}</p>
            <div className="mt-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-400">From</p>
                <p className="text-xl font-black">{money(item.price_cents)}</p>
              </div>
              <Link to="/quote" className="rounded-full border border-black px-4 py-2 text-xs font-black">CONFIGURE / QUOTE</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}