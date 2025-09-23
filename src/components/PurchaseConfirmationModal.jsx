import React, { useState } from 'react';
import { FaCrown, FaGem, FaStar, FaFire, FaBolt, FaLock, FaShieldAlt, FaCheckCircle, FaTimes, FaCreditCard } from 'react-icons/fa';
import { collection, addDoc, serverTimestamp, getDocs, query, limit, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const PurchaseConfirmationModal = ({ isOpen, onClose, product }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    discordUsername: '',
    minecraftUsername: ''
  });

  if (!isOpen || !product) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getIcon = (iconName) => {
    const iconProps = { className: "text-2xl" };
    switch (iconName) {
      case 'crown': return <FaCrown {...iconProps} className="text-yellow-500 text-2xl" />;
      case 'gem': return <FaGem {...iconProps} className="text-purple-500 text-2xl" />;
      case 'star': return <FaStar {...iconProps} className="text-blue-500 text-2xl" />;
      case 'fire': return <FaFire {...iconProps} className="text-red-500 text-2xl" />;
      case 'bolt': return <FaBolt {...iconProps} className="text-green-500 text-2xl" />;
      case 'lock': return <FaLock {...iconProps} className="text-indigo-500 text-2xl" />;
      case 'none': return null;
      default: return <FaCrown {...iconProps} className="text-yellow-500 text-2xl" />;
    }
  };

  const handleConfirmPurchase = async () => {
    // Validate required fields
    if (!formData.discordUsername.trim()) {
      toast.error('Please enter your Discord username');
      return;
    }

    if (!formData.minecraftUsername.trim()) {
      toast.error('Please enter your Minecraft username');
      return;
    }

    setLoading(true);

    try {
      // Call backend to create Razorpay order
      const createOrderResponse = await fetch('https://store-backend-chi-livid.vercel.app/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: product.price,
          currency: 'INR',
          userId: user.uid,
          items: [{
            name: product.name,
            price: product.price,
            quantity: 1,
          }],
          notes: {
            discordUsername: formData.discordUsername.trim(),
            minecraftUsername: formData.minecraftUsername.trim(),
            productName: product.name
          }
        }),
      });

      if (!createOrderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await createOrderResponse.json();

      // Initialize Razorpay payment with order from backend
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'Fade',
        description: `Purchase ${product.name}`,
        image: 'https://images-ext-1.discordapp.net/external/SeJGRXkeIpNvC26GS-5IziN8m5hUv0g0TQViJmwvX00/%3Fsize%3D1024/https/cdn.discordapp.com/icons/1296913762493923421/c609b2dfd6a28b2d7f16b02a291c08e5.webp?format=webp&width=1006&height=1006',
        handler: async function (response) {
          try {
            // Verify payment with backend
            const verifyResponse = await fetch('https://store-backend-chi-livid.vercel.app/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  userId: user.uid,
                  userEmail: user.email,
                  discordUsername: formData.discordUsername.trim(),
                  minecraftUsername: formData.minecraftUsername.trim(),
                  productName: product.name,
                  productId: product.id,
                  price: product.price,
                  originalPrice: product.originalPrice || product.price,
                  discount: product.discount || 0,
                }
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verificationResult = await verifyResponse.json();

            // Construct complete order data for success page (don't rely on backend response)
            const completeOrderData = {
              userId: user.uid,
              userEmail: user.email,
              discordUsername: formData.discordUsername.trim(),
              minecraftUsername: formData.minecraftUsername.trim(),
              productName: product.name,
              productId: product.id,
              price: product.price,
              originalPrice: product.originalPrice || product.price,
              discount: product.discount || 0,
              paymentId: verificationResult.paymentId,
              status: 'Completed',
              createdAt: new Date().toISOString()
            };

            // Store order data for success page
            localStorage.setItem('lastOrder', JSON.stringify(completeOrderData));

            // Close modal and navigate to success page
            onClose();
            navigate('/order-success', {
              state: { orderData: completeOrderData }
            });
          } catch (error) {
            console.error('Error verifying payment:', error);
            toast.error('Payment successful but failed to save order. Please contact support.');
          }
        },
        prefill: {
          email: user?.email || '',
          contact: ''
        },
        notes: {
          productName: product.name
        },
        theme: {
          color: '#CDBD9C'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast('Payment cancelled', { icon: 'ℹ️' });
          }
        }
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (razorpayError) {
        console.error('Razorpay initialization error:', razorpayError);
        if (razorpayError.message && razorpayError.message.includes('otp-credentials')) {
          toast.error('Browser extension conflict detected. Please disable cryptocurrency wallet extensions or try in incognito mode.', {
            duration: 8000,
          });
        } else {
          toast.error('Payment initialization failed. Please try again or contact support.');
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('Error initializing payment:', error);
      toast.error('Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  const IconComponent = getIcon(product.icon);
  const cardColor = product.color || 'from-blue-400 to-purple-500';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className={`bg-gradient-to-br ${cardColor} p-6 text-white relative overflow-hidden rounded-t-2xl`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-sm"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8 blur-sm"></div>
          
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-xl" />
              <span className="font-bold">Confirm Purchase</span>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-md rounded-xl mb-3 shadow-lg border border-white/20">
              {IconComponent ? (
                <div className="text-2xl text-white drop-shadow-lg">
                  {React.cloneElement(IconComponent, { className: "text-2xl text-white" })}
                </div>
              ) : (
                <div className="text-2xl text-white font-black drop-shadow-lg">
                  {product.name.charAt(0)}
                </div>
              )}
            </div>
            <h2 className="text-xl font-black mb-1 tracking-tight drop-shadow-md">
              {product.name}
            </h2>
            <p className="text-white/90 text-sm font-medium drop-shadow-sm">
              {product.description || "Premium Minecraft Rank"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Features */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              What's Included
            </h3>
            
            <div className="space-y-3 max-h-32 overflow-y-auto">
              {product.features && product.features.length > 0 ? (
                product.features.slice(0, 4).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className={`flex-shrink-0 w-5 h-5 bg-gradient-to-br ${cardColor} rounded-md flex items-center justify-center`}>
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                      {feature}
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className={`flex-shrink-0 w-5 h-5 bg-gradient-to-br ${cardColor} rounded-md flex items-center justify-center`}>
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Premium server access</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className={`flex-shrink-0 w-5 h-5 bg-gradient-to-br ${cardColor} rounded-md flex items-center justify-center`}>
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Exclusive permissions</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className={`flex-shrink-0 w-5 h-5 bg-gradient-to-br ${cardColor} rounded-md flex items-center justify-center`}>
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Priority support</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* User Information Form */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
              Account Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Discord Username *
                </label>
                <input
                  type="text"
                  name="discordUsername"
                  value={formData.discordUsername}
                  onChange={handleInputChange}
                  placeholder="e.g., username#1234"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Minecraft Username *
                </label>
                <input
                  type="text"
                  name="minecraftUsername"
                  value={formData.minecraftUsername}
                  onChange={handleInputChange}
                  placeholder="e.g., Steve123"
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Product:</span>
                <span className="text-gray-900 dark:text-white font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                <span className="text-gray-900 dark:text-white font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="text-gray-900 dark:text-white font-bold">Total:</span>
                <div className="text-right">
                  {product.discount > 0 && product.originalPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 line-through text-xs">₹{product.originalPrice}</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">₹{product.price}</span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-gray-900 dark:text-white">₹{product.price}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <FaShieldAlt className="text-blue-500 mt-0.5 flex-shrink-0 text-sm" />
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Secure payment processed through Razorpay with 256-bit SSL encryption.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleConfirmPurchase}
              disabled={loading}
              className={`w-full bg-gradient-to-r ${cardColor} hover:shadow-lg text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FaCreditCard className="text-lg" />
              <span>
                {loading ? 'Processing...' : `Pay ₹${product.price}`}
              </span>
            </button>

            <button
              onClick={onClose}
              className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseConfirmationModal;
