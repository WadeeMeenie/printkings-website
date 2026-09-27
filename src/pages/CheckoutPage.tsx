import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useCart } from "../lib/cart";
import type { Json } from "../lib/database.types";

type ShippingMethod = { id: string; slug: string; name: string };
type AddressForm = {
  recipient_name: string;
  line1: string;
  city: string;
  province: string;
  postal_code: string;
};

const money = (c: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(c / 100);

export function CheckoutPage() {
  const { items, subtotalCents } = useCart();
  const [session, setSession] = useState<boolean | null>(null);
  const [guestAuthError, setGuestAuthError] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [shippingMethod, setShippingMethod] = useState("collection");
  const [address, setAddress] = useState<AddressForm>({
    recipient_name: "",
    line1: "",
    city: "",
    province: "",
    postal_code: "",
  });
  const [prepared, setPrepared] = useState<{ amount_cents: number; redirect_url: string } | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      if (error) {
        setGuestAuthError("We could not start your secure checkout session.");
        setSession(false);
        return;
      }
      if (data.session) {
        setSession(true);
        return;
      }

      const { error: anonymousError } = await supabase.auth.signInAnonymously();
      if (!active) return;
      if (anonymousError) {
        setGuestAuthError("Guest checkout is not enabled on this store yet. Please try again shortly.");
        setSession(false);
      } else {
        setSession(true);
      }
    })();
    supabase
      .from("shipping_methods")
      .select("id,slug,name")
      .eq("status", "ACTIVE")
      .order("name")
      .then(({ data, error: queryError }) => {
        if (!queryError) setMethods(data ?? []);
      });
    return () => { active = false; };
  }, []);

  if (!items.length)
    return (
      <main className="empty-page checkout-empty">
        <h1 className="text-4xl font-black">YOUR CART IS EMPTY.</h1>
        <Link to="/shop" className="mt-6 inline-block underline font-bold">
          Back to shop
        </Link>
      </main>
    );

  if (session === null) return <main className="page"><div className="loading-state"><span className="loader" />Checking account…</div></main>;

  if (!session)
    return (
      <main className="auth-gate checkout-gate">
        <p className="eyebrow">Secure checkout</p>
        <h1 className="mt-3 text-5xl font-black">GUEST CHECKOUT.</h1>
        <p className="mt-5 text-zinc-500">No account is required. We’ll keep your cart saved on this device for your next visit.</p>
        {guestAuthError && <p className="notice-error mt-6">{guestAuthError}</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={() => window.location.reload()} className="pill-dark">TRY AGAIN</button>
          <Link to="/account?next=/checkout" className="pill-light">ALREADY HAVE AN ACCOUNT? SIGN IN</Link>
        </div>
      </main>
    );

  const needsAddress = shippingMethod !== "collection";
  const setAddressField = (key: keyof AddressForm, value: string) =>
    setAddress((current) => ({ ...current, [key]: value }));

  async function pay(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setPrepared(null);

    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Please sign in again.");

      if (needsAddress && (!address.recipient_name || !address.line1 || !address.city || !address.province || !address.postal_code)) {
        throw new Error("Enter the delivery address before continuing.");
      }

      let { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", u.user.id)
        .eq("status", "ACTIVE")
        .maybeSingle();

      let cartId = cart?.id;

      if (!cartId) {
        const r = await supabase.from("carts").insert({ user_id: u.user.id, currency: "ZAR" }).select("id").single();
        if (r.error) throw r.error;
        if (!r.data) throw new Error("Cart could not be created.");
        cartId = r.data.id;
      } else {
        const r = await supabase.from("cart_items").delete().eq("cart_id", cartId);
        if (r.error) throw r.error;
      }

      const ids = items.map((x) => x.variantId);
      const p = await supabase.from("public_catalogue").select("variant_id,price_cents").in("variant_id", ids);
      if (p.error) throw p.error;

      const priceMap = new Map((p.data ?? []).map((x) => [x.variant_id, x.price_cents]));
      const rows = items.map((x) => ({
        cart_id: cartId!,
        product_variant_id: x.variantId,
        quantity: x.quantity,
        unit_price_cents: priceMap.get(x.variantId) ?? 0,
        currency: "ZAR",
        configuration: (x.configuration ?? {}) as Json,
        branding_notes: x.brandingNotes ?? null,
      }));

      const ir = await supabase.from("cart_items").insert(rows);
      if (ir.error) throw ir.error;

      let shippingAddressId: string | null = null;

      if (needsAddress) {
        const ar = await supabase
          .from("addresses")
          .insert({
            user_id: u.user.id,
            type: "SHIPPING",
            country_code: "ZA",
            recipient_name: address.recipient_name,
            line1: address.line1,
            city: address.city,
            province: address.province,
            postal_code: address.postal_code,
          })
          .select("id")
          .single();

        if (ar.error) throw ar.error;
        shippingAddressId = ar.data.id;
      }

      const { data: checkout, error: fnError } = await supabase.functions.invoke("create-yoco-checkout", {
        body: {
          cart_id: cartId,
          customer_notes: notes,
          shipping_method_slug: shippingMethod,
          shipping_address_id: shippingAddressId,
        },
      });

      if (fnError) throw fnError;
      if (!checkout?.redirect_url || typeof checkout.amount_cents !== "number") {
        throw new Error("Payment checkout is not available yet. Yoco production configuration may still be pending.");
      }

      setPrepared({ amount_cents: checkout.amount_cents, redirect_url: checkout.redirect_url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page checkout-page">
      <div className="page-title-row"><div><p className="eyebrow">Checkout / Secure payment</p>
      <h1>READY TO GO.</h1></div><span className="checkout-trust">Secure checkout · ZAR</span></div>

      <div className="checkout-grid">
        <form onSubmit={pay} className="checkout-form">
          <label className="text-sm font-bold">Delivery method</label>
          <select
            value={shippingMethod}
            onChange={(e) => {
              setShippingMethod(e.target.value);
              setPrepared(null);
            }}
            className="field mt-2"
            disabled={busy}
          >
            {methods.map((method) => (
              <option key={method.id} value={method.slug}>
                {method.name}
              </option>
            ))}
          </select>

          {needsAddress && (
            <div className="mt-6 space-y-3">
              <p className="text-sm font-bold">Delivery address</p>
              <input value={address.recipient_name} onChange={(e) => setAddressField("recipient_name", e.target.value)} placeholder="Recipient name" className="field" />
              <input value={address.line1} onChange={(e) => setAddressField("line1", e.target.value)} placeholder="Street address" className="field" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={address.city} onChange={(e) => setAddressField("city", e.target.value)} placeholder="City" className="field" />
                <input value={address.province} onChange={(e) => setAddressField("province", e.target.value)} placeholder="Province" className="field" />
              </div>
              <input value={address.postal_code} onChange={(e) => setAddressField("postal_code", e.target.value)} placeholder="Postal code" className="field" inputMode="numeric" />
            </div>
          )}

          <label className="mt-6 block text-sm font-bold">Order notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Branding, timing, special requirements…"
            className="field mt-2 min-h-36"
          />

          {error && <p className="notice-error mt-4">{error}</p>}

          {prepared ? (
            <button
              type="button"
              onClick={() => window.location.assign(prepared.redirect_url)}
              className="mt-6 w-full pill-dark"
            >
              PAY {money(prepared.amount_cents)} WITH YOCO
            </button>
          ) : (
            <button disabled={busy} className="mt-6 w-full pill-dark">
              {busy ? "PREPARING SECURE PAYMENT…" : "CALCULATE FINAL TOTAL"}
            </button>
          )}

          <p className="mt-4 text-xs leading-5 text-zinc-400">
            The server recalculates the authoritative product prices, tax, shipping and discount before creating the Yoco payment.
          </p>
        </form>

        <aside className="checkout-summary">
          <p className="eyebrow">Summary</p>
          {items.map((i) => (
            <div key={i.variantId} className="mt-4 flex justify-between gap-3 text-sm">
              <span>{i.variantName} × {i.quantity}</span>
              <strong>{i.priceCents === null ? "Quote" : money(i.priceCents * i.quantity)}</strong>
            </div>
          ))}
          <div className="mt-6 flex justify-between border-t border-black/10 pt-5">
            <span>Catalogue subtotal</span>
            <strong>{money(subtotalCents)}</strong>
          </div>
          {prepared && (
            <div className="mt-4 flex justify-between border-t border-black/10 pt-4">
              <span className="font-bold">Server final total</span>
              <strong>{money(prepared.amount_cents)}</strong>
            </div>
          )}
          <p className="mt-3 text-xs leading-5 text-zinc-400">
            {prepared
              ? "Final total validated. Continue to Yoco when you are ready."
              : "Shipping, tax and discounts are recalculated by the server before payment."}
          </p>
        </aside>
      </div>
    </main>
  );
}
