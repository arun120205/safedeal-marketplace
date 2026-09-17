export default function Alert({ type = "info", children }) {
  const styles = {
    error: "bg-red-50 text-red-700 border-red-200",
    success: "bg-green-50 text-green-700 border-green-200",
    info: "bg-indigo-50 text-indigo-700 border-indigo-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
  };
  const icons = { error: "⚠️", success: "✅", info: "ℹ️", warning: "⚠️" };
  return (
    <div role="alert" className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
      <span aria-hidden="true">{icons[type]}</span>
      <span className="whitespace-pre-line">{children}</span>
    </div>
  );
}