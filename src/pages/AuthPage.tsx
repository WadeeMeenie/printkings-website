import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

export function AuthPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(params.get("next") ?? "/");
    });
  }, [navigate, params]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true); setMessage("");
    const result = mode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    setBusy(false);
    if (result.error) { setMessage(result.error.message); return; }
    if (mode === "signup" && !result.data.session) {
      setMessage("Account created. Check your email to confirm your address, then sign in.");
      return;
    }
    navigate(params.get("next") ?? "/");
  }

  return <main className="mx-auto max-w-lg px-5 py-16 lg:px-8">
    <p className="eyebrow">Print Kings account</p>
    <h1 className="mt-3 text-5xl font-black tracking-tight">{mode === "signin" ? "WELCOME BACK." : "CREATE YOUR ACCOUNT."}</h1>
    <p className="mt-5 leading-7 text-zinc-500">Accounts keep quotes, carts and orders securely linked to you.</p>
    <form onSubmit={submit} className="mt-10 grid gap-4">
      {mode === "signup" && <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="field" />}
      <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="field" />
      <input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (8+ characters)" className="field" />
      {message && <p className="rounded-2xl bg-zinc-100 p-4 text-sm text-zinc-700">{message}</p>}
      <button disabled={busy} className="pill-dark">{busy ? "PLEASE WAIT…" : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}</button>
    </form>
    <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(""); }} className="mt-6 text-sm font-bold underline">
      {mode === "signin" ? "Create an account" : "Already have an account? Sign in"}
    </button>
    <Link to="/shop" className="mt-5 block text-sm text-zinc-500">← Continue shopping</Link>
  </main>;
}
