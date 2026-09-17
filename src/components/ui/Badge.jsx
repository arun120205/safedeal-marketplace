const colors = {
  PAYMENT_PENDING: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/30",
  PAID_LOCKED: "bg-amber-500/10 text-amber-400 ring-amber-500/30",
  SHIPPED: "bg-brand/100/10 text-blue-400 ring-blue-500/30",
  DELIVERED: "bg-purple-500/10 text-purple-400 ring-purple-500/30",
  RELEASED: "bg-green-500/10 text-green-400 ring-green-500/30",
  DISPUTED: "bg-red-500/10 text-red-400 ring-red-500/30",
  REFUNDED: "bg-pink-500/10 text-pink-400 ring-pink-500/30",
  AVAILABLE: "bg-green-500/10 text-green-400 ring-green-500/30",
  SOLD: "bg-card20/10 text-gray-400 ring-gray-500/30",
  APPROVE: "bg-green-500/10 text-green-400 ring-green-500/30",
  FLAG: "bg-amber-500/10 text-amber-400 ring-amber-500/30",
  SKIPPED: "bg-card20/10 text-gray-400 ring-gray-500/30",
  OPEN: "bg-red-500/10 text-red-400 ring-red-500/30",
  DAMAGED: "bg-red-500/10 text-red-400 ring-red-500/30",
  NOT_RECEIVED: "bg-orange-500/10 text-orange-400 ring-orange-500/30",
  OTHER: "bg-card20/10 text-gray-400 ring-gray-500/30",
};

export default function Badge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset
      ${colors[status] || "bg-card20/10 text-gray-400 ring-gray-500/30"}`}>
      {status?.replace(/_/g, " ")}
    </span>
  );
}