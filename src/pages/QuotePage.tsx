export function QuotePage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
      <p className="text-xs font-black uppercase tracking-[.2em] text-zinc-400">Assisted sales</p>
      <h1 className="mt-3 text-5xl font-black tracking-tight">GET A QUOTE.</h1>
      <p className="mt-5 text-lg leading-8 text-zinc-500">For bulk, custom, large-format or complete branded setups, we will configure the requirement and price it properly.</p>
      <form className="mt-12 grid gap-5" onSubmit={(event) => event.preventDefault()}>
        <input className="rounded-2xl border border-black/10 px-5 py-4 outline-none focus:border-black" placeholder="Your name" />
        <input className="rounded-2xl border border-black/10 px-5 py-4 outline-none focus:border-black" type="email" placeholder="Email address" />
        <input className="rounded-2xl border border-black/10 px-5 py-4 outline-none focus:border-black" placeholder="Company / organisation" />
        <textarea className="min-h-40 rounded-2xl border border-black/10 px-5 py-4 outline-none focus:border-black" placeholder="Tell us what you need" />
        <button type="submit" className="rounded-full bg-black px-7 py-4 text-sm font-black text-white">REQUEST QUOTE</button>
      </form>
    </main>
  );
}