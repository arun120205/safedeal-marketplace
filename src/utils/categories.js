export const CATEGORIES = [
  { key: "ALL", label: "All Categories" },
  { key: "GADGETS", label: "Gadgets" },
  { key: "ELECTRONICS", label: "Electronics" },
  { key: "CLOTHES", label: "Fashion" },
  { key: "FURNITURE", label: "Home & Living" },
  { key: "BOOKS", label: "Books" },
  { key: "OTHERS", label: "Others" },
];

export const categoryLabel = (key) =>
  CATEGORIES.find((c) => c.key === key)?.label || key;

export const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24); if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30); if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
};