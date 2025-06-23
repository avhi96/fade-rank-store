import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { DarkModeProvider } from './context/DarkModeContext';
import { AuthProvider, useAuth, isAdmin } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Products from './pages/Products';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import LikedItems from './pages/LikedItems';
import Cart from './pages/CartPage';
import MyOrders from './pages/MyOrders';
import ProductDetails from './pages/ProductDetails';
import EditProfile from './pages/EditProfile';

export default function App() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <DarkModeProvider>
      <AuthProvider>
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
          {/* Sidebar */}
<div className="hidden md:block fixed top-0 left-0 h-full w-64 z-40 border-r border-gray-300 dark:border-gray-700">

            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-0 md:ml-64 overflow-y-auto w-full">
            <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-8 mx-auto">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/liked" element={<LikedItems />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/admin" element={
                  <PrivateRoute>
                    {isAdmin(user) ? <Admin /> : <Navigate to="/" />}
                  </PrivateRoute>
                } />
              </Routes>
            </div>
          </div>
        </div>
      </AuthProvider>
    </DarkModeProvider>
  );
}
