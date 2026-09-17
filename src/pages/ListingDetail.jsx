import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Alert from "../components/ui/Alert";
import Spinner from "../components/ui/Spinner";

const RAZORPAY_KEY_ID = "rzp_test_TZ8GBz7HJTr19b";  // ← your key_id

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function ListingDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [listing, setListing] = useState(null);
  const [address, setAddress] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    api.get(`/listings/${id}`).then((r) => setListing(r.data)).catch(() => {});
  }, [id]);

  const buy = async () => {
    if (!address.trim()) { setMsgType("warning"); return setMsg("Please enter your shipping address"); }
    try {
      setBuying(true);
      const ok = await loadRazorpay();
      if (!ok) { setMsgType("error"); return setMsg("Razorpay failed to load — check connection"); }

      const { data: order } = await api.post("/orders", { listingId: Number(id), shippingAddress: address });

      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY_ID,
        order_id: order.razorpayOrderId,
        amount: order.amountInPaise,
        currency: "INR",
        name: "SafeDeal",
        description: listing.title,
        theme: { color: "#4f46e5" },
        handler: async (res) => {
          setMsgType("info"); setMsg("Verifying payment signature...");
          const { data } = await api.post("/payments/verify", {
            razorpayOrderId: res.razorpay_order_id,
            razorpayPaymentId: res.razorpay_payment_id,
            razorpaySignature: res.razorpay_signature,
          });
          setMsgType("success"); setMsg("🔒 " + data.message);
          setTimeout(() => nav("/orders"), 2500);
        },
      });
      rzp.open();
    } catch (err) {
      setMsgType("error");
      setMsg(err.response?.data?.error || "Order failed");
    } finally { setBuying(false); }
  };

  if (!listing) return <Spinner label="Loading product..." />;

  return (
    <div className="mx-auto max-w-5xl px-4 mt-8">
      <button onClick={() => nav(-1)} className="mb-4 text-sm font-medium text-gray-400 hover:text-white">← Back to marketplace</button>
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="bg-card2">
            <img src={listing.imageUrl || "https://placehold.co/600x450/f3f4f6/9ca3af?text=No+Image"}
              alt={listing.title} className="h-64 w-full object-cover md:h-full" />
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold text-white">{listing.title}</h1>
              <Badge status={listing.status} />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-indigo-600">₹{listing.price}</p>
            <p className="mt-4 text-sm leading-relaxed text-gray-300">{listing.description}</p>

            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-gray-400">Category</dt><dd className="font-medium text-white">{listing.category}</dd>
              <dt className="text-gray-400">Condition</dt><dd className="font-medium text-white">{listing.conditionType.replace("_", " ")}</dd>
              <dt className="text-gray-400">Bill / Warranty</dt><dd className="font-medium text-white">{listing.billAvailable ? "✅ Available" : "— Not available"}</dd>
              <dt className="text-gray-400">Seller</dt><dd className="font-medium text-white">{listing.seller?.name}</dd>
            </dl>

            {listing.status === "AVAILABLE" ? (
              <div className="mt-6 rounded-xl border border-line bg-card2 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">🔒 Escrow Protected Purchase</p>
                <p className="mt-1 text-xs text-gray-400">Your money is locked safely and only released to the seller after you confirm delivery.</p>
                <div className="mt-4">
                  <Input label="Shipping address" placeholder="House no, street, city, PIN" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <Button onClick={buy} disabled={buying} size="lg" className="mt-4 w-full">
                  {buying ? "Processing..." : `Buy Now — ₹${listing.price}`}
                </Button>
                {msg && <div className="mt-3"><Alert type={msgType}>{msg}</Alert></div>}
              </div>
            ) : (
              <div className="mt-6"><Alert type="warning">This product is {listing.status.replace("_", " ").toLowerCase()} and no longer purchasable.</Alert></div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}