import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { DarkModeProvider } from './context/DarkModeContext';
import { AuthProvider, useAuth, isAdmin } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import LoadingScreen from './components/LoadingScreen';
import MinecraftBlocks from './components/MinecraftBlocks';
import Home from './pages/Home';
import ItemDetails from './pages/ItemDetail';
import Products from './pages/Products';
import AllProducts from './pages/AllProducts';
import Contact from './pages/Contact';
import Terms from './pages/Terms/Terms';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgetPassword';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';
import Admin from './admin/Admin';
import LikedItems from './pages/LikedItems';
import SavedAddresses from './pages/SavedAddresses';
import Cart from './pages/CartPage';
import MyOrders from './pages/MyOrders';
import ProductDetails from './pages/ProductDetails';
import EditProfile from './pages/EditProfile';
import Checkout from './pages/Checkout';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ThankYou from './pages/ThankYou';
import OrderSuccess from './pages/OrderSuccess';
import OrderCancel from './pages/OrderCancel';
import OrderPending from './pages/OrderPending';
import OrderFailed from './pages/OrderFailed';
import Refund from './pages/Terms/RefundPolicy'
import Privacy from './pages/Terms/PrivacyPolicy';
import ShippingPolicy from './pages/Terms/shipping';

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Minecraft Floating Blocks Background */}
      <MinecraftBlocks />
      
      {/* Navigation */}
      <Sidebar />

      {/* Main Content Container - Optimized for Minecraft Theme */}
      <div className="minecraft-container relative z-10">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/all" element={<AllProducts />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms-policy" element={<Terms />} />
          <Route path="/refund-policy" element={<Refund />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/liked" element={<LikedItems />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/saved-addresses" element={<SavedAddresses />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/thankyou" element={<ThankYou />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/order-cancel" element={<OrderCancel />} />
          <Route path="/order-pending" element={<OrderPending />} />
          <Route path="/order-failed" element={<OrderFailed />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                {isAdmin(user) ? <Admin /> : <Navigate to="/" />}
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <DarkModeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </DarkModeProvider>
  );
}
