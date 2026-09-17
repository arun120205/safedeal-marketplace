import { useEffect, useState } from "react";
import api from "../api";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";

export default function Wallet() {
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    api.get("/wallet").then((r) => setWallet(r.data)).catch(() => {});
  }, []);

  if (!wallet) return <Spinner label="Loading wallet..." />;

  return (
    <div className="mx-auto max-w-2xl px-4 mt-8">
      <h1 className="text-2xl font-bold text-white">Wallet</h1>

      <div className="mt-5 rounded-2xl bg-indigo-600 p-8 text-center text-white">
        <p className="text-sm font-medium opacity-80">Available Balance</p>
        <p className="mt-1 text-5xl font-extrabold tracking-tight">₹{wallet.balance}</p>
        <p className="mt-3 text-xs opacity-70">Escrow earnings credited after delivery confirmation</p>
      </div>

      <h3 className="mt-8 text-lg font-bold text-white">Transaction History</h3>
      <div className="mt-4 space-y-2.5">
        {wallet.transactions.length === 0 ? (
          <EmptyState icon="💰" title="No transactions yet" subtitle="Your escrow payments, releases and refunds will appear here." />
        ) : wallet.transactions.map((t) => (
          <Card key={t.id} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">
                {t.type.replace("_", " ")}{t.order ? ` — Order #${t.order.id}` : ""}
              </p>
              <p className="truncate text-xs text-gray-400">{t.note}</p>
            </div>
            <p className={`shrink-0 text-sm font-bold ${t.amount > 0 ? "text-green-600" : "text-red-600"}`}>
              {t.amount > 0 ? "+" : ""}₹{t.amount}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}