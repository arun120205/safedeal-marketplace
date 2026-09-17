// ── src/components/TrustFeatures.jsx
import { ShieldCheck, BadgeCheck, Scale, HeartHandshake } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Secure Payments", desc: "Your money is protected in escrow until delivery" },
  { icon: BadgeCheck, title: "Verified Users", desc: "Real profiles and trusted community members" },
  { icon: Scale, title: "Buyer & Seller Protection", desc: "Fair dispute support and resolution" },
  { icon: HeartHandshake, title: "Trusted Transactions", desc: "Safe, transparent, 72h-inspected deals" },
];

export default function TrustFeatures() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        {features.map((f) => (
          <div key={f.title} className="card-float rounded-2xl border border-line bg-card p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand-accent">
              <f.icon size={20} />
            </span>
            <h3 className="mt-3.5 text-sm font-semibold text-white">{f.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}