import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PostListing from "./pages/PostListing";
import ListingDetail from "./pages/ListingDetail";
import MyOrders from "./pages/MyOrders";
import Wallet from "./pages/Wallet";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Protected><Home /></Protected>} />
          <Route path="/post" element={<Protected><PostListing /></Protected>} />
          <Route path="/listing/:id" element={<Protected><ListingDetail /></Protected>} />
          <Route path="/orders" element={<Protected><MyOrders /></Protected>} />
          <Route path="/wallet" element={<Protected><Wallet /></Protected>} />
          <Route path="/admin" element={<Protected><AdminPanel /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}