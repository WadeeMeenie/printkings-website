import { Link, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useCart } from "../lib/cart";
export function CheckoutResultPage({kind}:{kind:"success"|"cancelled"|"failed"}){
 const [params]=useSearchParams();const {clear}=useCart();const id=params.get("payment_id");
 useEffect(()=>{if(kind==="success")clear()},[kind,clear]);
 const copy=kind==="success"?["PAYMENT SUBMITTED.","Your payment is being verified by the payment provider. Your order will only move to PAID after trusted webhook verification."]:kind==="cancelled"?["PAYMENT CANCELLED.","No payment was confirmed. Your cart has been kept so you can return to checkout and try again."]:["PAYMENT DID NOT COMPLETE.","No successful payment was confirmed. Your cart has been kept so you can return to checkout and try again."];
 return <main className="page max-w-3xl"><p className="eyebrow">Checkout status</p><h1 className="mt-3 text-5xl font-black">{copy[0]}</h1><p className="mt-5 text-lg leading-8 text-zinc-500">{copy[1]}</p>{id&&<p className="mt-5 text-xs text-zinc-400">Payment reference: {id}</p>}<div className="mt-8 flex gap-3"><Link to={kind==="success"?"/shop":"/checkout"} className="pill-dark">{kind==="success"?"SHOP PRODUCTS":"RETURN TO CHECKOUT"}</Link><Link to="/quote" className="pill-light">GET A QUOTE</Link></div></main>
}