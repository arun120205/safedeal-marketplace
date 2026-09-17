// ── src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import { Heart, Tag, Clock } from "lucide-react";
import { categoryLabel, timeAgo } from "../utils/categories";

const cond = {
  NEW: "bg-green-500/15 text-green-400",
  LIKE_NEW: "bg-brand/100/15 text-blue-400",
  GOOD: "bg-brand/15 text-brand-accent",
  USED: "bg-card20/15 text-gray-400",
};

export default function ProductCard({ listing, isFav, onToggleFav }) {
  return (
    <Link to={`/listing/${listing.id}`} className="group block">
      <article className="h-full overflow-hidden rounded-2xl border border-line bg-card shadow-card transition duration-200 group-hover:-translate-y-1 group-hover:border-brand/40 group-hover:shadow-card-hover">
        <div className="relative aspect-[4/3] overflow-hidden bg-card2">
          <img
            src={listing.imageUrl || "https://placehold.co/400x300/161a23/64748b?text=SafeDeal"}
            alt={listing.title} loading="lazy"
            className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
          />
          <span className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-semibold backdrop-blur ${cond[listing.conditionType] || "bg-card20/15 text-gray-400"}`}>
            {listing.conditionType?.replace("_", " ")}
          </span>
          <button
            onClick={(e) => { e.preventDefault(); onToggleFav(listing.id); }}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"} aria-pressed={isFav}
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur transition hover:scale-110">
            <Heart size={15} className={isFav ? "fill-red-500 text-red-500" : "text-gray-300"} />
          </button>
        </div>
        <div className="p-3.5">
          <h3 className="truncate text-sm font-semibold text-white">{listing.title}</h3>
          <p className="mt-1 text-lg font-bold text-brand-accent">₹{listing.price}</p>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-muted">
            <span className="flex items-center gap-1"><Tag size={11} />{categoryLabel(listing.category)}</span>
            <span className="flex items-center gap-1"><Clock size={11} />{timeAgo(listing.createdAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}