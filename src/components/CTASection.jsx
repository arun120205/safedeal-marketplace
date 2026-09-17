// ── src/components/CTASection.jsx
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-brand/20 via-card to-card px-6 py-16 text-center sm:px-12">
        <div className="absolute inset-0 grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" aria-hidden="true" />
        <div className="blob -top-16 left-1/2 h-56 w-96 -translate-x-1/2 bg-brand/20" aria-hidden="true" />
        <div className="relative">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Your deal deserves trust.</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-gray-400">
            SafeDeal makes second-hand buying and selling safer, clearer, and more reliable.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#products" className="group inline-flex items-center gap-2 rounded-full bg-card px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-200">
              Browse Products <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
            </a>
            <Link to="/post" className="rounded-full border border-line px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-card/5">Start Selling</Link>
          </div>
        </div>
      </div>
    </section>
  );
}