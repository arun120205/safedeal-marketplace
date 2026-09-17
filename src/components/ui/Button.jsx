const styles = {
  primary: "bg-brand text-white hover:bg-brand-dark focus-visible:outline-brand shadow-lg shadow-brand/25",
  light: "bg-card text-white hover:bg-gray-200 focus-visible:outline-white",
  secondary: "bg-card2 text-gray-200 hover:bg-line focus-visible:outline-gray-500",
  outline: "border border-line bg-transparent text-gray-200 hover:bg-card2 focus-visible:outline-gray-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
  success: "bg-green-600 text-white hover:bg-green-700 focus-visible:outline-green-600",
  ghost: "text-brand-accent hover:bg-brand/10 focus-visible:outline-brand",
};

export default function Button({ variant = "primary", size = "md", className = "", children, ...props }) {
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-base" };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}