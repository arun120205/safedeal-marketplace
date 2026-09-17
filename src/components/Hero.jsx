import { Link } from "react-router-dom";
import { Shield, ShieldCheck, Lock, ArrowRight, Check, Smartphone, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* blue horizon glow like the reference */}
      <div className="absolute left-1/2 top-24 h-72 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-brand/25 blur-[110px]" aria-hidden="true" />
      <div className="absolute inset-0 grid-pattern [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,black,transparent)]" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-20">
        {/* badge */}
        <div className="fade-up inline-flex items-center gap-2 rounded-full border border-line bg-card px-1.5 py-1.5 pr-4 shadow-card">
          <span className="rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold text-white">New</span>
          <span className="text-xs font-medium text-gray-300">AI-Protected Escrow Marketplace</span>
        </div>

        {/* headline */}
        <h1 className="fade-up-2 mt-7 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl">
          Buy &amp; Sell with
          <br />
          <span className="text-gradient">Confidence</span>
        </h1>

        <p className="fade-up-2 mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Secure second-hand transactions with protected payments, verified users,
          and trusted deals — every rupee held in escrow until delivery is confirmed.
        </p>

        {/* CTAs */}
        <div className="fade-up-3 mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#products"
            className="group inline-flex items-center gap-2 rounded-full bg-card px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-200">
            Browse Products
            <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
          </a>
          <Link to="/post"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-dark">
            <Shield size={16} /> Start Selling
          </Link>
        </div>

        {/* mini trust row */}
        <div className="fade-up-3 mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {["Escrow Protected", "AI Fraud Detection", "Razorpay Secured"].map((t) => (
            <span key={t} className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
              <Check size={13} className="text-brand-accent" strokeWidth={3} /> {t}
            </span>
          ))}
        </div>

        {/* ── floating dark app-mockup ── */}
        <div className="fade-up-3 relative mx-auto mt-16 max-w-2xl">
          <div className="absolute -inset-x-6 top-10 bottom-0 rounded-[2rem] bg-gradient-to-b from-brand/20 to-transparent blur-2xl" aria-hidden="true" />

          <div className="relative rounded-2xl border border-line bg-card text-left shadow-card-hover">
            {/* mock navbar */}
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <span className="flex items-center gap-2 text-sm font-bold text-white">
                <Shield size={15} className="text-brand" /> SafeDeal
              </span>
              <div className="flex items-center gap-3 text-[11px] text-muted">
                <TrendingUp size={13} className="text-green-400" />
                <span className="hidden sm:inline">Live Marketplace</span>
                <span className="rounded-full bg-brand/15 px-2.5 py-1 text-[10px] font-bold text-brand-accent">Escrow ON</span>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {/* product card */}
              <div className="rounded-xl border border-line bg-card2 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand/30 to-indigo-600/30">
                    <Smartphone size={20} className="text-brand-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white">iPhone 13 (128GB)</p>
                    <p className="text-base font-bold text-white">₹28,000</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-brand to-indigo-500" />
                </div>
                <p className="mt-2 text-[10px] text-muted">Escrow progress — 2 of 3 steps done</p>
              </div>

              {/* escrow checklist */}
              <div className="rounded-xl border border-line bg-card2 p-3.5">
                <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-muted">Protection Status</p>
                {[
                  { l: "Payment locked in escrow", done: true },
                  { l: "Seller notified — Ship Now", done: true },
                  { l: "Delivery confirmation", done: false },
                ].map((s) => (
                  <div key={s.l} className="flex items-center gap-2 py-1 text-[11px]">
                    <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold ${
                      s.done ? "bg-green-500 text-white" : "border border-line bg-surface text-gray-300"}`}>
                      {s.done ? "✓" : ""}
                    </span>
                    <span className={s.done ? "text-gray-200" : "text-gray-400"}>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* floating badge */}
          <div className="absolute -right-3 -top-4 hidden items-center gap-2 rounded-xl border border-line bg-card2/95 px-3.5 py-2.5 shadow-card-hover backdrop-blur sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/15 text-brand-accent">
              <Lock size={15} />
            </span>
            <div>
              <p className="text-[11px] font-bold text-white">₹28,000 Secured ✓</p>
              <p className="text-[10px] text-muted">locked in platform wallet</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}