import { useEffect, useState } from "react";
import api from "../api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";

export default function MyOrders() {
  const [tab, setTab] = useState("purchases");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async (t = tab) => {
    setTab(t); setLoading(true);
    try {
      const { data } = await api.get(t === "purchases" ? "/orders/my-purchases" : "/orders/my-sales");
      setOrders(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const ship = async (id) => {
    const tracking = window.prompt("Enter courier tracking number:");
    if (!tracking) return;
    await api.put(`/orders/${id}/ship`, { trackingNumber: tracking });
    load();
  };
  const deliver = async (id) => { await api.put(`/orders/${id}/deliver`); load(); };
  const confirm = async (id) => {
    await api.put(`/orders/${id}/confirm`);
    window.alert("💰 Payment released to seller! Escrow complete.");
    load();
  };
  const dispute = async (id) => {
    const reason = window.prompt("Reason (DAMAGED / NOT_RECEIVED / OTHER):");
    if (!reason) return;
    await api.post(`/disputes/order/${id}`, { reason: reason.toUpperCase(), description: window.prompt("Describe the problem:") || "", evidenceUrl: "" });
    load();
  };

  const tabs = [{ k: "purchases", l: "🛒 My Purchases" }, { k: "sales", l: "📦 My Sales" }];

  return (
    <div className="mx-auto max-w-4xl px-4 mt-8">
      <h1 className="text-2xl font-bold text-white">My Orders</h1>
      <div className="mt-5 flex gap-2 rounded-xl border border-line bg-card p-1.5 w-fit">
        {tabs.map((t) => (
          <button key={t.k} onClick={() => load(t.k)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === t.k ? "bg-brand text-white shadow-card" : "text-gray-300 hover:bg-card2"}`}>
            {t.l}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loading ? <Spinner />
          : orders.length === 0 ? (
            <EmptyState icon={tab === "purchases" ? "🛒" : "📦"}
              title={tab === "purchases" ? "No purchases yet" : "No sales yet"}
              subtitle={tab === "purchases" ? "Browse the marketplace and make your first escrow-protected purchase." : "When someone buys your product, orders appear here."} />
          ) : orders.map((o) => (
            <Card key={o.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white">{o.listing?.title || "Product"}</h3>
                    <Badge status={o.status} />
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    Order #{o.id} • <span className="font-semibold text-white">₹{o.amount}</span>
                    {o.trackingNumber && ` • 📦 ${o.trackingNumber}`}
                  </p>
                  {o.status === "DELIVERED" && (
                    <p className="mt-1 text-xs text-gray-400">⏰ Auto-release to seller in 72h unless disputed</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {o.status === "PAID_LOCKED" && tab === "sales" && <Button size="sm" onClick={() => ship(o.id)}>📦 Ship</Button>}
                  {o.status === "SHIPPED" && <Button size="sm" variant="secondary" onClick={() => deliver(o.id)}>✅ Mark Delivered</Button>}
                  {o.status === "DELIVERED" && tab === "purchases" && (
                    <>
                      <Button size="sm" variant="success" onClick={() => confirm(o.id)}>💰 Confirm & Pay</Button>
                      <Button size="sm" variant="danger" onClick={() => dispute(o.id)}>⚠️ Dispute</Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}