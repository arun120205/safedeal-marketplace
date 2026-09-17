// ── src/components/CategoryNav.jsx
import { LayoutGrid, Smartphone, Monitor, Shirt, Sofa, BookOpen, MoreHorizontal } from "lucide-react";

const icons = {
  ALL: LayoutGrid, GADGETS: Smartphone, ELECTRONICS: Monitor,
  CLOTHES: Shirt, FURNITURE: Sofa, BOOKS: BookOpen, OTHERS: MoreHorizontal,
};

export default function CategoryNav({ categories, category, setCategory }) {
  return (
    <div className="mt-5 flex gap-2.5 overflow-x-auto pb-2 lg:justify-between lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((c) => {
        const Icon = icons[c.key] || LayoutGrid;
        const active = category === c.key;
        return (
          <button key={c.key} onClick={() => setCategory(c.key)} aria-pressed={active}
            className={`flex min-w-[84px] flex-col items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-medium transition ${
              active
                ? "border-brand/40 bg-brand/10 text-brand-accent"
                : "border-line bg-card text-gray-400 hover:border-brand/30 hover:text-white"
            }`}>
            <Icon size={20} className={active ? "text-brand-accent" : "text-gray-400"} />
            {c.label}
          </button>
        );
      })}
    </div>
  );
}