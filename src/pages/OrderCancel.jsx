import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  FaTimesCircle, 
  FaCopy, 
  FaDownload, 
  FaDiscord, 
  FaHome, 
  FaShoppingBag,
  FaExclamationTriangle,
  FaCrown,
  FaRocket,
  FaCreditCard,
  FaServer,
  FaTimes,
  FaCube
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import OrderProcessingAnimation from '../components/OrderProcessingAnimation';

const OrderCancel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check for order data immediately - prevent direct URL access
  const orderData = location.state?.orderData || JSON.parse(localStorage.getItem('lastOrder') || 'null');
  
  // Block rendering if no order data
  if (!orderData) {
    toast.error('No order data found. Please complete a purchase first.');
    navigate('/products');
    return null;
  }

  const [showProcessingAnimation, setShowProcessingAnimation] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);

  const handleAnimationComplete = () => {
    setShowProcessingAnimation(false);
    
    // Trigger animations after processing animation
    setTimeout(() => setAnimationStep(1), 300);
    setTimeout(() => setAnimationStep(2), 600);
    setTimeout(() => setAnimationStep(3), 900);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', {
      icon: '📋',
      style: {
        background: '#374151',
        color: 'white',
      }
    });
  };

  const downloadOrderDetails = () => {
    if (!orderData) return;
    
    const orderText = `
FADE STORE - ORDER CANCELLATION
═══════════════════════════════════════

ORDER DETAILS
Order ID: order_${orderData.paymentId || 'N/A'}
Product: ${orderData.productName}
Price: ₹${orderData.price}
Status: CANCELLED
Date: ${new Date(orderData.createdAt || new Date()).toLocaleString()}

CUSTOMER INFORMATION
Email: ${orderData.userEmail}
Minecraft Username: ${orderData.minecraftUsername}
Discord Username: ${orderData.discordUsername || 'Not provided'}

CANCELLATION NOTICE
Your order has been cancelled. If you were charged, the refund will be processed within 3-5 business days.

NEXT STEPS
1. Check your email for cancellation confirmation
2. Contact support if you have any questions
3. Browse our products to place a new order

Thank you for choosing FADE Store!
    `;
    
    const blob = new Blob([orderText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FADE-Order-Cancelled-${orderData.paymentId || 'unknown'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Order details downloaded!', {
      icon: '📥',
      style: {
        background: '#374151',
        color: 'white',
      }
    });
  };

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show processing animation first
  if (showProcessingAnimation) {
    return <OrderProcessingAnimation onComplete={handleAnimationComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className={`text-center mb-12 transform transition-all duration-1000 ${animationStep >= 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-2xl shadow-red-500/25">
                <FaTimesCircle className="text-3xl text-white" />
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-lg">
              Order Cancelled
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Your order has been cancelled. Any charges will be refunded within 3-5 business days.
            </p>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            
            {/* Left Column - Order Details */}
            <div className={`transform transition-all duration-1000 delay-300 ${animationStep >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-lg border border-gray-700/50 shadow-2xl shadow-black/25 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/25">
                      <FaShoppingBag className="text-white text-sm" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Order Details</h2>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-red-400 mb-1">ORDER ID</p>
                      <p className="text-sm font-mono text-white bg-black/50 px-3 py-2 rounded border border-gray-700/30">
                        order_{orderData.paymentId || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-400 mb-1">AMOUNT</p>
                      <p className="text-2xl font-bold text-red-400">₹{orderData.price}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-purple-400 mb-1">PRODUCT</p>
                      <p className="text-sm font-semibold text-white">{orderData.productName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-cyan-400 mb-1">DATE & TIME</p>
                      <p className="text-sm text-gray-300">
                        {new Date(orderData.createdAt || new Date()).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-yellow-400 mb-1">MINECRAFT USERNAME</p>
                    <p className="text-sm font-semibold text-white">{orderData.minecraftUsername}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-orange-400 mb-1">STATUS</p>
                    <p className="text-sm font-bold text-red-400 bg-red-500/20 px-3 py-2 rounded border border-red-500/30">
                      CANCELLED
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-lg border border-red-500/30 shadow-xl shadow-red-500/10 p-4 hover:border-red-400/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/25">
                      <FaTimes className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Order Cancelled</h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300">
                    Your order has been successfully cancelled.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-lg border border-yellow-500/30 shadow-xl shadow-yellow-500/10 p-4 hover:border-yellow-400/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/25">
                      <FaCreditCard className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Refund Processing</h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300">
                    Refund will be processed within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Cancellation Info */}
            <div className="space-y-6">
              
              {/* Cancellation Notice */}
              <div className={`transform transition-all duration-1000 delay-500 ${animationStep >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-lg border border-gray-700/50 shadow-2xl shadow-black/25 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                    <h2 className="text-xl font-semibold text-white">Cancellation Notice</h2>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500 shadow-lg shadow-red-500/25">
                          <FaExclamationTriangle className="text-white text-sm" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm mb-2">Order Cancelled</h4>
                        <p className="text-xs text-gray-300 mb-3">
                          Your order has been cancelled and will not be processed. If you were charged, a refund will be issued automatically.
                        </p>
                        <div className="space-y-2 text-xs text-gray-300">
                          <p>• Refund processing time: 3-5 business days</p>
                          <p>• You will receive an email confirmation</p>
                          <p>• Contact support for any questions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className={`transform transition-all duration-1000 delay-700 ${animationStep >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-lg border border-blue-500/30 shadow-2xl shadow-blue-500/10 overflow-hidden hover:border-blue-400/50 transition-all duration-300">
                  <div className="px-6 py-4 border-b border-blue-500/30 bg-gradient-to-r from-blue-900/30 to-indigo-900/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <FaCube className="text-white text-sm" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">What's Next?</h2>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                        <div>
                          <h4 className="text-white font-semibold text-sm mb-1">Check Your Email</h4>
                          <p className="text-gray-300 text-xs">You'll receive a cancellation confirmation email shortly.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                        <div>
                          <h4 className="text-white font-semibold text-sm mb-1">Wait for Refund</h4>
                          <p className="text-gray-300 text-xs">If charged, your refund will be processed within 3-5 business days.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                        <div>
                          <h4 className="text-white font-semibold text-sm mb-1">Browse Products</h4>
                          <p className="text-gray-300 text-xs">Explore our Minecraft ranks and place a new order anytime.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={downloadOrderDetails}
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors"
            >
              <FaDownload />
              Download Details
            </button>

            <a
              href="https://discord.gg/9KUjJQRm9e"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors"
            >
              <FaDiscord />
              Contact Support
            </a>

            <Link
              to="/products"
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors"
            >
              <FaShoppingBag />
              Browse Products
            </Link>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <FaHome />
              Back to Home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderCancel;
