import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api from "../api";
import { useAuth } from "../AuthContext";
import { CATEGORIES } from "../utils/categories";
import Hero from "../components/Hero";
import TrustFeatures from "../components/TrustFeatures";
import SearchBar from "../components/SearchBar";
import CategoryNav from "../components/CategoryNav";
import ProductCard from "../components/ProductCard";
import HowItWorks from "../components/HowItWorks";
import ProtectionCards from "../components/ProtectionCards";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";

export default function Home() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [favs, setFavs] = useState(() => JSON.parse(localStorage.getItem("favs") || "[]"));

  useEffect(() => {
    api.get("/listings")
      .then((r) => setListings(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleFav = (id) => {
    const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
    setFavs(next);
    localStorage.setItem("favs", JSON.stringify(next));
  };

  const filtered = useMemo(
    () => listings.filter(
      (l) => (category === "ALL" || l.category === category) &&
             l.title.toLowerCase().includes(search.toLowerCase())
    ),
    [listings, search, category]
  );

  return (
    <>
      <Hero />
      <TrustFeatures />

      {/* Search + categories */}
      <section className="border-y border-line bg-card py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-6 text-center text-2xl font-bold text-ink">Find your next great deal</h2>
          <SearchBar search={search} setSearch={setSearch} category={category} setCategory={setCategory} categories={CATEGORIES} />
          <CategoryNav categories={CATEGORIES} category={category} setCategory={setCategory} />
        </div>
      </section>

      {/* Featured products — existing API data */}
      <section id="products" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Featured Products</h2>
            <p className="mt-1 text-sm text-muted">Discover trusted pre-owned products from our community.</p>
          </div>
          <button onClick={() => { setSearch(""); setCategory("ALL"); }}
            className="flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark">
            View All <ArrowRight size={15} />
          </button>
        </div>

        <div className="mt-7">
          {loading ? <Spinner label="Loading products..." />
            : filtered.length === 0 ? (
              <EmptyState
                icon="📦"
                title={listings.length === 0 ? "No products yet" : "No matches found"}
                subtitle={user
                  ? listings.length === 0 ? "Be the first seller — post a product!" : "Try a different search or category."
                  : "Sign in to browse the marketplace."}
                action={!user ? null : (
                  <button onClick={() => nav("/post")}
                    className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
                    Post a Product
                  </button>
                )}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 lg:gap-5">
                {filtered.map((l) => (
                  <ProductCard key={l.id} listing={l} isFav={favs.includes(l.id)} onToggleFav={toggleFav} />
                ))}
              </div>
            )}
        </div>
      </section>

      <HowItWorks />
      <ProtectionCards />
      <CTASection />
      <Footer />
    </>
  );
}