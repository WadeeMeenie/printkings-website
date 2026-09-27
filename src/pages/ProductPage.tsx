import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Tables } from "../lib/database.types";

type CatalogueItem = Tables<"public_catalogue">;

function money(cents: number | null) {
  if (cents === null) return "Quote";
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);
}

export function ProductPage() {
  const { categorySlug, variantSlug } = useParams();
  const [item, setItem] = useState<CatalogueItem | null>(null);
  const [related, setRelated] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!variantSlug) return;

    supabase
      .from("public_catalogue")
      .select("*")
      .eq("category_active", true)
      .eq("variant_slug", variantSlug)
      .maybeSingle()
      .then(async ({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) {
          setError(queryError.message);
          setLoading(false);
          return;
        }
        if (!data) {
          setError("Product not found.");
          setLoading(false);
          return;
        }
        setItem(data);

        const { data: relatedData } = await supabase
          .from("public_catalogue")
          .select("*")
          .eq("category_active", true)
          .eq("category_slug", data.category_slug ?? categorySlug ?? "")
          .neq("variant_id", data.variant_id)
          .order("product_name")
          .limit(4);
        if (active) setRelated(relatedData ?? []);
        setLoading(false);
      });

    return () => { active = false; };
  }, [categorySlug, variantSlug]);

  if (loading) return <main className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><p className="text-zinc-500">Loading product…</p></main>;
  if (error || !item) return <main className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><p className="rounded-2xl bg-red-50 p-5 text-red-700">{error ?? "Product not found."}</p><Link to="/shop" className="mt-6 inline-block font-bold underline">Back to shop</Link></main>;

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <Link to={`/shop?category=${item.category_slug}`} className="text-sm font-bold text-zinc-500 hover:text-black">← {item.category_name}</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <div className="flex min-h-[460px] items-center justify-center rounded-[2rem] border border-black/10 bg-zinc-50 p-10">
          <div className="text-center">
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-3xl border border-black/10 bg-white text-xs font-black uppercase tracking-widest text-zinc-400">PRINT KINGS</div>
            <p className="mt-5 text-sm text-zinc-400">Product photography will appear here once approved catalogue imagery is uploaded.</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[.2em] text-zinc-400">{item.category_name}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight lg:text-5xl">{item.variant_name ?? item.product_name}</h1>
          {item.variant_name && item.product_name !== item.variant_name && <p className="mt-2 text-lg text-zinc-500">{item.product_name}</p>}
          <p className="mt-6 text-3xl font-black">{money(item.price_cents)}</p>
          <p className="mt-1 text-xs text-zinc-400">Customer price · VAT treatment is handled by the checkout engine</p>

          <div className="mt-8 border-t border-black/10 pt-8">
            <h2 className="text-sm font-black uppercase tracking-wider">About this product</h2>
            <p className="mt-3 leading-7 text-zinc-600">{item.description ?? item.short_description ?? "Professional branded display equipment."}</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link to="/quote" className="rounded-full bg-black px-6 py-4 text-center text-sm font-black text-white">GET A QUOTE</Link>
            <Link to="/build-your-setup" className="rounded-full border border-black px-6 py-4 text-center text-sm font-black">BUILD YOUR SETUP</Link>
          </div>
          <p className="mt-4 text-xs leading-5 text-zinc-400">Need custom branding, quantities or a complete setup? We can configure the right combination for you.</p>
        </div>
      </div>

      {related.length > 0 && <section className="mt-20 border-t border-black/10 pt-12"><p className="text-xs font-black uppercase tracking-[.2em] text-zinc-400">More in {item.category_name}</p><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{related.map((relatedItem) => <Link key={relatedItem.variant_id} to={`/shop/${relatedItem.category_slug}/${relatedItem.variant_slug}`} className="rounded-3xl border border-black/10 p-5 hover:border-black/30"><p className="text-xs text-zinc-400">{relatedItem.product_name}</p><h3 className="mt-2 font-black">{relatedItem.variant_name ?? relatedItem.product_name}</h3><p className="mt-4 font-black">{money(relatedItem.price_cents)}</p></Link>)}</div></section>}
    </main>
  );
}
