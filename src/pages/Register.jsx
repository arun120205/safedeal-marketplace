// ── Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await api.post("/auth/register", form);
      setOk(true);
      setTimeout(() => nav("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally { setLoading(false); }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="mx-auto max-w-md px-4 mt-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="mt-1 text-sm text-gray-400">Join SafeDeal — trade with total trust</p>
      </div>
      <Card className="p-8">
        {error && <div className="mb-5"><Alert type="error">{error}</Alert></div>}
        {ok && <div className="mb-5"><Alert type="success">Account created! Redirecting to sign in...</Alert></div>}
        <form onSubmit={submit} className="space-y-5">
          <Input label="Full name" placeholder="Priya Shah" value={form.name} onChange={set("name")} required />
          <Input label="Email address" type="email" placeholder="you@example.com" autoComplete="email" value={form.email} onChange={set("email")} required />
          <Input label="Password" type="password" placeholder="Minimum 6 characters" hint="Use at least 6 characters" value={form.password} onChange={set("password")} required minLength={6} />
          <Input label="Phone" placeholder="10-digit mobile number" value={form.phone} onChange={set("phone")} required pattern="[0-9]{10}" />
          <Input label="Address" placeholder="City, State" value={form.address} onChange={set("address")} />
          <Button type="submit" className="w-full" disabled={loading || ok}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}