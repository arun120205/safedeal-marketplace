// ── src/components/HowItWorks.jsx
import { PackagePlus, Lock, Truck, SearchCheck, BadgeCheck } from "lucide-react";
import SectionHead from "./SectionHead";

const steps = [
  { icon: PackagePlus, title: "Product Listed", desc: "Seller lists the product with photos, price and details." },
  { icon: Lock, title: "Payment Secured", desc: "Buyer pays — money locks safely in the platform escrow wallet." },
  { icon: Truck, title: "Product Shipped", desc: "Seller sees “Payment Secured ✓” and ships with a tracking reference." },
  { icon: SearchCheck, title: "Delivery + Inspection", desc: "Buyer confirms delivery. A 72-hour inspection window opens." },
  { icon: BadgeCheck, title: "Transaction Completed", desc: "No dispute? Money auto-releases. Dispute? AI-assisted admin review decides fairly." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden border-y border-line bg-card/40 py-20">
      <div className="blob -left-24 top-10 h-72 w-72 bg-brand/10" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          eyebrow="The SafeDeal Process"
          title="How SafeDeal keeps your transaction safe"
          subtitle="Every deal follows the same protected 5-step escrow journey — transparent for both sides."
        />
        <div className="relative mt-14 grid gap-5 lg:grid-cols-5">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent lg:block" aria-hidden="true" />
          {steps.map((s, i) => (
            <div key={i} className="card-float relative rounded-2xl border border-line bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand-accent">
                  <s.icon size={21} />
                </span>
                <span className="text-3xl font-extrabold text-white/5">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-4 text-sm font-bold text-white">{s.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}