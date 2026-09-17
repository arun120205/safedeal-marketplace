// ── src/components/ProtectionCards.jsx
import { Link } from "react-router-dom";
import { Shield, Banknote, Check } from "lucide-react";
import Button from "./ui/Button";

const cards = [
  {
    icon: Shield, title: "Buyer Protection", tag: "Buy without worrying.",
    items: ["Secure payment held in escrow", "Verified seller profiles", "Delivery tracking on every order", "72-hour inspection window", "Dispute protection with AI-assisted review"],
    cta: "Browse Products", to: "/#products", variant: "primary",
  },
  {
    icon: Banknote, title: "Seller Protection", tag: "Sell with confidence.",
    items: ["Payment secured before you ship", "Buyer verification on every order", "Delivery tracking confirmation", "Clear, evidence-based dispute process", "Automatic payment release after 72h"],
    cta: "Start Selling", to: "/post", variant: "outline",
  },
];

export default function ProtectionCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {cards.map((c) => (
          <div key={c.title} className="card-float rounded-2xl border border-line bg-card p-8 transition hover:border-brand/30 hover:shadow-card-hover">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand-accent">
              <c.icon size={24} />
            </span>
            <h3 className="mt-5 text-xl font-bold text-white">{c.title}</h3>
            <p className="mt-1 text-sm text-muted">{c.tag}</p>
            <ul className="mt-5 space-y-2.5">
              {c.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <Check size={16} className="mt-0.5 shrink-0 text-green-400" /> {item}
                </li>
              ))}
            </ul>
            <Link to={c.to} className="mt-7 inline-block">
              <Button variant={c.variant}>{c.cta}</Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}