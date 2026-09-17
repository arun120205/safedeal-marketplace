// ── src/components/Footer.jsx
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-indigo-600 text-white">
                <Shield size={18} />
              </span>
              <span className="text-lg font-extrabold text-white">SafeDeal</span>
            </div>
            <p className="mt-2 text-xs font-medium tracking-wide text-gray-400">Buy • Sell • Trust</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
              Your trusted marketplace for protected second-hand transactions.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Marketplace</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white">Marketplace</Link></li>
              <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
              <li><Link to="/post" className="hover:text-white">Post a Listing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Account</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-400">
              <li><Link to="/orders" className="hover:text-white">Orders</Link></li>
              <li><Link to="/wallet" className="hover:text-white">Wallet</Link></li>
              <li><span className="cursor-default">Help &amp; Support</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-line pt-6 text-center text-xs text-gray-300">
          © {new Date().getFullYear()} SafeDeal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}