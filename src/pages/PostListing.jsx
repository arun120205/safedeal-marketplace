import { useState } from "react";
import api from "../api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

// shared dark field styling
const field =
  "block w-full rounded-xl border border-line bg-card2 px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export default function PostListing() {
  const [form, setForm] = useState({ title: "", description: "", category: "ELECTRONICS", price: "", conditionType: "GOOD", billAvailable: false });
  const [image, setImage] = useState(null);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => fd.append(k, form[k]));
      if (image) fd.append("image", image);
      const { data } = await api.post("/listings", fd);
      setResult(data);
      setMsgType("success");
      setMsg(data.message);
    } catch (err) {
      setMsgType("error");
      setMsg(err.response?.data?.error || "Failed to create listing");
    } finally { setLoading(false); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  return (
    <div className="mx-auto max-w-lg px-4 mt-10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">Post a Product</h1>
        <p className="mt-1 text-sm text-muted">Our AI Guardian reviews every listing for safety 🛡️</p>
      </div>
      <Card className="p-8">
        <div className="space-y-5">
          {msg && <Alert type={msgType}>{msg}</Alert>}
          {result?.aiCheck && (
            <div className="rounded-xl border border-brand/30 bg-brand/10 p-4 text-sm">
              <p className="font-semibold text-brand-accent">🤖 AI Guardian: {result.aiCheck.verdict}</p>
              <p className="mt-1 text-gray-300">{result.aiCheck.reason}</p>
              {result.aiCheck.imageCheck && result.aiCheck.imageCheck !== "NO_IMAGE_PROVIDED" &&
                result.aiCheck.imageCheck !== "IMAGE_ANALYSIS_UNAVAILABLE" && (
                <p className="mt-2 text-xs text-gray-400">🖼️ Image check: {result.aiCheck.imageCheck}</p>
              )}
            </div>
          )}
          <form onSubmit={submit} className="space-y-5">
            <Input label="Title" placeholder="e.g. Dell Monitor 24 inch" value={form.title} onChange={set("title")} required />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Description</label>
              <textarea rows={3} placeholder="Condition, age, accessories included..."
                value={form.description} onChange={set("description")} className={field} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Category</label>
                <select value={form.category} onChange={set("category")} className={field}>
                  {["ELECTRONICS", "CLOTHES", "GADGETS", "FURNITURE", "BOOKS", "OTHERS"].map((c) => (
                    <option key={c} value={c} className="bg-card2 text-white">{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">Condition</label>
                <select value={form.conditionType} onChange={set("conditionType")} className={field}>
                  {["NEW", "LIKE_NEW", "GOOD", "USED"].map((c) => (
                    <option key={c} value={c} className="bg-card2 text-white">{c.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
            </div>

            <Input label="Price (₹)" type="number" min="1" placeholder="6000" value={form.price} onChange={set("price")} required />

            <label className="flex items-center gap-2.5 text-sm text-gray-300">
              <input type="checkbox" checked={form.billAvailable} onChange={set("billAvailable")}
                className="h-4 w-4 rounded border-line bg-card2 accent-blue-500" />
              Original bill / warranty available
            </label>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Product photo</label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}
                className="block w-full text-sm text-gray-400 file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-dark" />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Submitting for AI review..." : "Post Product"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}