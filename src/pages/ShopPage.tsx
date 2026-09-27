import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Tables } from "../lib/database.types";
import { useEffect as useImageEffect, useState as useImageState } from "react";

type CatalogueItem = Tables<"public_catalogue">;

const PAGE_SIZE = 24;

function money(cents: number | null) {
  if (cents === null) return "Quote";
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);
}

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") ?? "all";
  const query = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "name";

  const [items, setItems] = useState<CatalogueItem[]>([]);
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageMap, setImageMap] = useImageState<Record<string,string>>({});

  useEffect(() => {
    let active = true;
    supabase
      .from("public_catalogue")
      .select("category_name,category_slug")
      .eq("category_active", true)
      .order("category_name")
      .then(({ data }) => {
        if (!active) return;
        const unique = new Map<string, { name: string; slug: string }>();
        (data ?? []).forEach((row) => {
          if (row.category_slug && row.category_name) unique.set(row.category_slug, { name: row.category_name, slug: row.category_slug });
        });
        setCategories([...unique.values()]);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setItems([]);
    setHasMore(true);

    let request = supabase
      .from("public_catalogue")
      .select("*")
      .eq("category_active", true);

    if (category !== "all") request = request.eq("category_slug", category);
    if (query.trim()) {
      const term = query.trim().replace(/,/g, " ");
      request = request.or(`product_name.ilike.%${term}%,variant_name.ilike.%${term}%,short_description.ilike.%${term}%`);
    }

    if (sort === "price-low") request = request.order("price_cents", { ascending: true, nullsFirst: false });
    else if (sort === "price-high") request = request.order("price_cents", { ascending: false, nullsFirst: false });
    else request = request.order("product_name").order("variant_name");

    request.range(0, PAGE_SIZE - 1).then(({ data, error: queryError }) => {
      if (!active) return;
      if (queryError) setError(queryError.message);
      else {
        setItems(data ?? []);
        setHasMore((data?.length ?? 0) === PAGE_SIZE);
      }
      setLoading(false);
    });

    return () => { active = false; };
  }, [category, query, sort]);

  useImageEffect(()=>{(async()=>{const ids=items.map(x=>x.variant_id).filter(Boolean);if(!ids.length){setImageMap({});return}const {data}=await supabase.from("product_images").select("variant_id,external_url,sort_order,is_primary,approved").in("variant_id",ids).eq("approved",true).order("is_primary",{ascending:false}).order("sort_order");const map:Record<string,string>={};for(const x of data??[]){if(x.variant_id&&x.external_url&&!map[x.variant_id])map[x.variant_id]=x.external_url}setImageMap(map)})()},[items]);

  const visibleItems = useMemo(() => items, [items]);

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    let request = supabase
      .from("public_catalogue")
      .select("*")
      .eq("category_active", true);

    if (category !== "all") request = request.eq("category_slug", category);
    if (query.trim()) {
      const term = query.trim().replace(/,/g, " ");
      request = request.or(`product_name.ilike.%${term}%,variant_name.ilike.%${term}%,short_description.ilike.%${term}%`);
    }

    if (sort === "price-low") request = request.order("price_cents", { ascending: true, nullsFirst: false });
    else if (sort === "price-high") request = request.order("price_cents", { ascending: false, nullsFirst: false });
    else request = request.order("product_name").order("variant_name");

    const from = items.length;
    const { data, error: queryError } = await request.range(from, from + PAGE_SIZE - 1);
    if (queryError) setError(queryError.message);
    else {
      setItems((current) => [...current, ...(data ?? [])]);
      setHasMore((data?.length ?? 0) === PAGE_SIZE);
    }
    setLoadingMore(false);
  }

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "all" || (key === "q" && !value.trim())) next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[.2em] text-zinc-400">Shop the system</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight">PRODUCTS BUILT TO GET YOU SEEN.</h1>
        <p className="mt-5 text-lg leading-8 text-zinc-500">Browse the real Print Kings catalogue. Supplier costs and internal SKUs stay behind the scenes.</p>
      </div>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="flex-1">
            <span className="sr-only">Search products</span>
            <input value={query} onChange={(e) => updateFilter("q", e.target.value)} placeholder="Search gazebos, flags, counters…" className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black" />
          </label>
          <select value={category} onChange={(e) => updateFilter("category", e.target.value)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm">
            <option value="all">All categories</option>
            {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
          <select value={sort} onChange={(e) => updateFilter("sort", e.target.value)} className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm">
            <option value="name">Sort: Name</option>
            <option value="price-low">Price: Low to high</option>
            <option value="price-high">Price: High to low</option>
          </select>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => updateFilter("category", "all")} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${category === "all" ? "bg-brand-500 text-white" : "border border-black/10 bg-white hover:border-brand-500 hover:text-brand-600"}`}>All</button>
          {categories.map((item) => <button key={item.slug} onClick={() => updateFilter("category", item.slug)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${category === item.slug ? "bg-brand-500 text-white" : "border border-black/10 bg-white hover:border-brand-500 hover:text-brand-600"}`}>{item.name}</button>)}
        </div>
      </section>

      {loading && <p className="mt-12 text-zinc-500">Loading catalogue…</p>}
      {error && <p className="mt-12 rounded-2xl bg-red-50 p-5 text-sm text-red-700">Catalogue unavailable: {error}</p>}

      {!loading && !error && visibleItems.length === 0 && (
        <div className="mt-12 rounded-3xl border border-dashed border-black/15 p-12 text-center">
          <h2 className="text-2xl font-black">Nothing matched that search.</h2>
          <p className="mt-2 text-sm text-zinc-500">Try another product, category or search term.</p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item) => {
          if (!item.variant_id) return null;
          return (
          <article key={item.variant_id} className="group rounded-3xl border border-black/10 p-6 transition hover:-translate-y-1 hover:border-black/25 hover:shadow-lg">
            <div className="mb-5 flex h-52 items-center justify-center overflow-hidden rounded-2xl bg-zinc-50">{imageMap[item.variant_id] ? <img src={imageMap[item.variant_id]} alt="" className="h-full w-full object-contain" loading="lazy"/> : <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">PRINT KINGS</span>}</div><p className="text-xs font-bold uppercase tracking-wider text-zinc-400">{item.category_name}</p>
            <h2 className="mt-3 text-xl font-black">{item.variant_name ?? item.product_name}</h2>
            {item.variant_name && item.product_name !== item.variant_name && <p className="mt-1 text-sm font-medium text-zinc-500">{item.product_name}</p>}
            <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-500">{item.short_description}</p>
            <div className="mt-7 flex items-end justify-between gap-4">
              <div><p className="text-xs text-zinc-400">From</p><p className="text-xl font-black">{money(item.price_cents)}</p></div>
              <Link to={`/shop/${item.category_slug}/${item.variant_slug}`} className="rounded-full bg-black px-4 py-2 text-xs font-black text-white transition hover:bg-brand-500 hover:text-white">VIEW PRODUCT</Link>
            </div>
          </article>
          );
        })}
      </div>

      {hasMore && !loading && visibleItems.length > 0 && (
        <div className="mt-10 text-center">
          <button onClick={loadMore} disabled={loadingMore} className="rounded-full border border-black px-6 py-3 text-sm font-black disabled:opacity-50">{loadingMore ? "Loading…" : "LOAD MORE"}</button>
        </div>
      )}
    </main>
  );
}
