import { useEffect, useState } from "react";
import api from "../api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Alert from "../components/ui/Alert";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";

export default function AdminPanel() {
  const [disputes, setDisputes] = useState(null);
  const [logs, setLogs] = useState([]);
  const [msg, setMsg] = useState("");
  const [investigating, setInvestigating] = useState(null);

  const load = async () => {
    const [d, l] = await Promise.all([api.get("/disputes/admin/open"), api.get("/agent/logs")]);
    setDisputes(d.data); setLogs(l.data);
  };

  useEffect(() => { load(); }, []);

  const investigate = async (id) => {
    setInvestigating(id);
    setMsg("🤖 AI Agent investigating... gathering order data, history, ledger and analyzing evidence (10–20 sec)");
    try {
      const { data } = await api.post(`/agent/disputes/${id}/investigate`);
      setMsg(`🤖 AI Recommendation: ${data.recommendation} (${data.confidence} confidence)\n\n${data.reasoning}`);
      load();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.error || "Investigation failed"));
    } finally { setInvestigating(null); }
  };

  const resolve = async (id, refundBuyer) => {
    await api.put(`/disputes/admin/${id}/resolve?refundBuyer=${refundBuyer}`);
    setMsg(refundBuyer ? "💸 Dispute resolved — buyer refunded." : "💰 Dispute resolved — seller paid.");
    load();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 mt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">🛡️ Admin Panel</h1>
        <Badge status={disputes?.length ? "DISPUTED" : "AVAILABLE"} />
      </div>
      {msg && <div className="mt-4"><Alert type="info">{msg}</Alert></div>}

      <h3 className="mt-8 text-lg font-bold text-white">⚖️ Open Disputes</h3>
      <div className="mt-4 space-y-4">
        {disputes === null ? <Spinner />
          : disputes.length === 0 ? (
            <EmptyState icon="🎉" title="No open disputes" subtitle="Every order is happily delivered. Great platform health!" />
          ) : disputes.map((d) => (
            <Card key={d.id} className="p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-semibold text-white">Dispute #{d.id} — Order #{d.order?.id} (₹{d.order?.amount})</p>
                  <p className="mt-1 text-sm text-gray-300"><Badge status={d.reason} /> {d.description}</p>
                  {d.evidenceUrl && (
                    <a href={d.evidenceUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500">View evidence 📸</a>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                <Button size="sm" variant="secondary" onClick={() => investigate(d.id)} disabled={investigating === d.id}>
                  {investigating === d.id ? "🤖 Investigating..." : "🤖 AI Investigate"}
                </Button>
                <Button size="sm" variant="danger" onClick={() => resolve(d.id, true)}>💸 Refund Buyer</Button>
                <Button size="sm" variant="success" onClick={() => resolve(d.id, false)}>💰 Release to Seller</Button>
              </div>
            </Card>
          ))}
      </div>

      <h3 className="mt-10 text-lg font-bold text-white">🤖 AI Agent Logs</h3>
      <p className="text-xs text-gray-400">Full audit trail — every AI decision is recorded</p>
      <div className="mt-4 space-y-2.5">
        {logs.map((l) => (
          <Card key={l.id} className="p-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{l.agentType.replace("_", " ")}</span>
              <Badge status={l.verdict} />
            </div>
            <p className="mt-1.5 text-sm text-gray-300">{l.reasoning}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}