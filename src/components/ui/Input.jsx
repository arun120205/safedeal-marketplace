export default function Input({ label, error, hint, className = "", ...props }) {
  return (
    <div className={className}>
     {label && <label className="mb-1.5 block text-sm font-semibold text-gray-400">{label}</label>}
      <input
        className={`block w-full rounded-xl border bg-card2 px-3.5 py-2.5 text-sm text-white placeholder:text-gray-400
          transition focus:outline-none focus:ring-2
          ${error
            ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
            : "border-line focus:border-brand focus:ring-brand/20"}`}
        {...props}
      />
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}