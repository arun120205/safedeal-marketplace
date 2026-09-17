export default function Card({ className = "", children, ...props }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-card ${className}`} {...props}>
      {children}
    </div>
  );
}