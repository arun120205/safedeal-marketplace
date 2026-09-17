import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { useAuth } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/post", label: "Post" },
    { to: "/orders", label: "Orders" },
    { to: "/wallet", label: "Wallet" },
  ];

  const cls = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive ? "bg-brand/15 text-brand-accent" : "text-gray-300 hover:bg-card/5 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Main">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-indigo-600 text-white shadow-glow">
            <Shield size={18} strokeWidth={2.2} />
          </span>
          <span className="text-[17px] font-extrabold tracking-tight text-white">SafeDeal</span>
        </Link>

        {user && (
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => <NavLink key={l.to} to={l.to} className={cls} end={l.to === "/"}>{l.label}</NavLink>)}
            {user.role === "ADMIN" && <NavLink to="/admin" className={cls}>Admin</NavLink>}
          </div>
        )}

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="text-sm text-muted">Hi, <b className="text-white">{user.name}</b></span>
              <button onClick={() => { logout(); nav("/login"); }}
                className="rounded-full bg-card px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-200">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white">Login</Link>
              <Link to="/register" className="rounded-full bg-card px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-200">Sign Up</Link>
            </>
          )}
        </div>

        {user && (
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}
            className="rounded-lg p-2 text-gray-300 hover:bg-card/5 md:hidden">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
      </nav>

      {user && open && (
        <div className="space-y-1 border-t border-line px-4 py-3 md:hidden">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className={cls} end={l.to === "/"}>{l.label}</NavLink>
          ))}
          {user.role === "ADMIN" && <NavLink to="/admin" onClick={() => setOpen(false)} className={cls}>Admin</NavLink>}
          <button onClick={() => { logout(); nav("/login"); }}
            className="w-full rounded-full px-4 py-2 text-left text-sm font-semibold text-red-400 hover:bg-red-500/10">Logout</button>
        </div>
      )}
    </header>
  );
}