import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useCart } from "../lib/cart";

export function CheckoutResultPage({ kind }: { kind: "success" | "cancelled" | "failed" }) {
  const [params] = useSearchParams();
  const { clear } = useCart();
  const id = params.get("payment_id");

  useEffect(() => {
    if (kind === "success") clear();
  }, [kind]);

  const success = kind === "success";
  const cancelled = kind === "cancelled";

  return (
    <main className="status-layout checkout-result-page">
      <div className={`status-icon ${success ? "success" : "attention"}`} aria-hidden="true">
        {success ? "✓" : "!"}
      </div>

      <p className="eyebrow">{success ? "Order submitted" : "Checkout status"}</p>

      <h1>
        {success ? "PAYMENT SUBMITTED." : cancelled ? "PAYMENT CANCELLED." : "PAYMENT DIDN'T COMPLETE."}
      </h1>

      <p>
        {success
          ? "Thank you. Your payment has been sent to Yoco and your order is now being verified. Print Kings will only mark the order as paid after trusted payment confirmation."
          : cancelled
            ? "No payment was confirmed. Your cart has been kept so you can return to checkout and try again."
            : "No successful payment was confirmed. Your cart has been kept so you can return to checkout and try again."}
      </p>

      {success && (
        <div className="result-notice">
          <strong>WHAT HAPPENS NEXT</strong>
          <span>1. Yoco confirms the payment.</span>
          <span>2. Print Kings verifies the payment.</span>
          <span>3. Your order moves into fulfilment.</span>
        </div>
      )}

      {id && <small>Payment reference: {id}</small>}

      <div className="status-actions">
        <Link to={success ? "/shop" : "/checkout"} className="button button-dark">
          {success ? "CONTINUE SHOPPING" : "RETURN TO CHECKOUT"} <span>↗</span>
        </Link>
        <Link to="/quote" className="text-link">Get a quote <span>↗</span></Link>
      </div>
    </main>
  );
}
