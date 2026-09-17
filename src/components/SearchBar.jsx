// ── src/components/SearchBar.jsx
import { Search } from "lucide-react";

export default function SearchBar({ search, setSearch, category, setCategory, categories }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for products, brands, or categories..."
          aria-label="Search products"
          className="w-full rounded-full border border-line bg-card py-3.5 pl-11 pr-4 text-sm text-white focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
        />
      </div>
      <button className="rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-dark">Search</button>
      <select
        value={category} onChange={(e) => setCategory(e.target.value)}
        aria-label="Filter by category"
        className="rounded-full border border-line bg-card px-5 py-3.5 text-sm font-medium text-white focus:border-brand focus:outline-none"
      >
        {categories.filter((c) => c.key !== "ALL").map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
      </select>
    </div>
  );
}