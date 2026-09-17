// ── Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      nav("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-md px-4 mt-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-400">Sign in to your SafeDeal account</p>
      </div>
      <Card className="p-8">
        {error && <div className="mb-5"><Alert type="error">{error}</Alert></div>}
        <form onSubmit={submit} className="space-y-5">
          <Input label="Email address" type="email" placeholder="you@example.com" autoComplete="email"
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" placeholder="••••••••" autoComplete="current-password"
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          New to SafeDeal? <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">Create an account</Link>
        </p>
      </Card>
    </div>
  );
}