// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCrown, FaGem, FaStar, FaFire, FaBolt, FaLock, FaTimes, FaShoppingCart, FaEnvelope, FaUser, FaUsers } from 'react-icons/fa';
import { collection, addDoc, serverTimestamp, getDocs, query, limit, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Products = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [discordRanks, setDiscordRanks] = useState([]);
  const [ranksLoading, setRanksLoading] = useState(true);
  useEffect(() => {
    fetchAdminRanks();
  }, []);

  const fetchAdminRanks = async () => {
    try {
      setRanksLoading(true);
      
      // Fetch all admin-added ranks from Firebase and sort by price (high to low)
      const ranksSnap = await getDocs(collection(db, 'products'));
      const adminRanks = ranksSnap.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .sort((a, b) => b.price - a.price); // Sort by price high to low

      setDiscordRanks(adminRanks);
    } catch (error) {
      console.error('Error fetching ranks:', error);
      toast.error('Failed to load ranks');
      setDiscordRanks([]);
    } finally {
      setRanksLoading(false);
    }
  };

  const getIcon = (iconName) => {
    const iconProps = { className: "text-4xl" };
    switch (iconName) {
      case 'crown': return <FaCrown {...iconProps} className="text-yellow-500 text-4xl" />;
      case 'gem': return <FaGem {...iconProps} className="text-purple-500 text-4xl" />;
      case 'star': return <FaStar {...iconProps} className="text-blue-500 text-4xl" />;
      case 'fire': return <FaFire {...iconProps} className="text-red-500 text-4xl" />;
      case 'bolt': return <FaBolt {...iconProps} className="text-green-500 text-4xl" />;
      case 'lock': return <FaLock {...iconProps} className="text-indigo-500 text-4xl" />;
      case 'none': return null;
      default: return <FaCrown {...iconProps} className="text-yellow-500 text-4xl" />;
    }
  };

  const handleDirectPurchase = async (rank) => {
    setLoading(true);

    try {
      // Initialize Razorpay payment directly
      const options = {
        key: 'rzp_live_RJWzpQal9wjEC7', // Replace with your Razorpay key ID
        amount: rank.price * 100, // Amount in paise (multiply by 100)
        currency: 'INR',
        name: 'Fade',
        description: `Purchase ${rank.name}`,
        image: 'https://images-ext-1.discordapp.net/external/SeJGRXkeIpNvC26GS-5IziN8m5hUv0g0TQViJmwvX00/%3Fsize%3D1024/https/cdn.discordapp.com/icons/1296913762493923421/c609b2dfd6a28b2d7f16b02a291c08e5.webp?format=webp&width=1006&height=1006',
        handler: async function (response) {
          try {
            let assignedCode = null;

            // Try to assign a code for this rank
            try {
              // Find an available code for this rank
              const availableCodesQuery = query(
                collection(db, 'rankCodes'),
                where('rankId', '==', rank.id),
                where('isUsed', '==', false),
                limit(1)
              );
              
              const availableCodesSnap = await getDocs(availableCodesQuery);
              
              if (!availableCodesSnap.empty) {
                const codeDoc = availableCodesSnap.docs[0];
                assignedCode = codeDoc.data().code;
                
                // Mark the code as used
                await updateDoc(doc(db, 'rankCodes', codeDoc.id), {
                  isUsed: true,
                  usedAt: serverTimestamp(),
                  usedBy: user?.uid || null,
                  userEmail: user?.email || ''
                });
              }
            } catch (codeError) {
              console.error('Error assigning code:', codeError);
              // Continue with order creation even if code assignment fails
            }

            // Payment successful, create order in Firebase
            const orderData = {
              userId: user?.uid || null,
              userEmail: user?.email || '',
              productName: rank.name,
              productId: rank.id,
              price: rank.price,
              originalPrice: rank.originalPrice || rank.price,
              discount: rank.discount || 0,
              status: 'Completed',
              paymentId: response.razorpay_payment_id,
              paymentSignature: response.razorpay_signature || null,
              assignedCode: assignedCode,
              createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'productOrders'), orderData);

            // Store order data for success page
            localStorage.setItem('lastOrder', JSON.stringify({
              ...orderData,
              createdAt: new Date().toISOString() // Convert timestamp for storage
            }));

            // Navigate to success page
            navigate('/order-success', { 
              state: { orderData: {
                ...orderData,
                createdAt: new Date().toISOString()
              }}
            });
          } catch (error) {
            console.error('Error saving order:', error);
            toast.error('Payment successful but failed to save order. Please contact support.');
          }
        },
        prefill: {
          email: user?.email || '',
          contact: ''
        },
        notes: {
          productName: rank.name
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

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initializing payment:', error);
      toast.error('Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col py-12 px-4">
      <div className="max-w-7xl mx-auto w-full">
        {/* Clean Product Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          {/* Minecraft Ranks Button */}
          <div className="flex justify-center mb-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 hover:border-green-400 text-green-400 hover:text-green-300 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 backdrop-blur-sm"
            >
              <FaCrown className="text-sm" />
              Minecraft Ranks
            </Link>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-4">
            <span className="text-gradient bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Minecraft Ranks
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Premium server ranks with exclusive features
          </p>
        </div>

        {/* Loading State */}
        {ranksLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading Discord ranks...</p>
          </div>
        ) : discordRanks.length === 0 ? (
          <div className="text-center py-20">
            <FaCrown className="text-6xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">No Ranks Available</h3>
            <p className="text-gray-500 dark:text-gray-500 mb-6">Admin hasn't added any Minecraft ranks yet</p>
            <Link
              to="/products/all"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <FaShoppingCart />
              Browse All Products
            </Link>
          </div>
        ) : (
          /* Professional Product Cards Grid */
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {discordRanks.map((rank, index) => {
              const IconComponent = getIcon(rank.icon);
              const cardColor = rank.color || 'from-blue-400 to-purple-500';
              
              return (
                <div 
                  key={rank.id}
                  className="group relative animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Ultra Professional Card */}
                  <div className="relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-500/10 dark:hover:shadow-gray-900/20 w-full overflow-hidden group backdrop-blur-sm">
                    
                    {/* Popular Badge */}
                    {rank.popular && (
                      <div className="absolute top-4 right-4 z-20">
                        <div className={`bg-gradient-to-r ${cardColor} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                          ⭐ POPULAR
                        </div>
                      </div>
                    )}

                    {/* Premium Card Header with Admin Color */}
                    <div className={`bg-gradient-to-br ${cardColor} p-10 text-white relative overflow-hidden`}>
                      {/* Enhanced Decorative Elements */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/8 rounded-full -translate-y-20 translate-x-20 blur-sm"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16 blur-sm"></div>
                      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white/3 rounded-full -translate-x-12 -translate-y-12 blur-lg"></div>
                      
                      <div className="relative z-10 text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-white/15 backdrop-blur-md rounded-3xl mb-6 shadow-2xl border border-white/20 group-hover:scale-110 transition-transform duration-500">
                          {IconComponent ? (
                            <div className="text-4xl text-white drop-shadow-lg">
                              {React.cloneElement(IconComponent, { className: "text-4xl text-white" })}
                            </div>
                          ) : (
                            <div className="text-4xl text-white font-black drop-shadow-lg">
                              {rank.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <h3 className="text-3xl font-black mb-3 tracking-tight drop-shadow-md">
                          {rank.name}
                        </h3>
                        <p className="text-white/95 text-base font-semibold drop-shadow-sm leading-relaxed max-w-xs mx-auto">
                          {rank.description || "Premium Minecraft Rank"}
                        </p>
                      </div>
                    </div>

                    {/* Premium Card Content */}
                    <div className="p-10">
                      {/* Enhanced Price Section */}
                      <div className="text-center mb-10">
                        <div className="flex items-baseline justify-center gap-3 mb-6">
                          <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                            ₹{rank.price}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-xl font-semibold">/month</span>
                        </div>
                        {rank.discount > 0 && rank.originalPrice && (
                          <div className="flex items-center justify-center gap-4 mb-6">
                            <span className="text-gray-400 text-xl line-through font-medium">
                              ₹{rank.originalPrice}
                            </span>
                            <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                              Save {rank.discount}%
                            </div>
                          </div>
                        )}
                        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent opacity-50"></div>
                      </div>

                      {/* Premium Features Section */}
                      <div className="mb-10">
                        <h4 className="text-gray-800 dark:text-gray-200 font-bold mb-8 text-center uppercase tracking-widest text-sm">
                          Premium Features
                        </h4>
                        <div className="space-y-5">
                          {rank.features && rank.features.length > 0 ? (
                            rank.features.slice(0, 4).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-5 group/feature p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                                <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${cardColor} rounded-xl flex items-center justify-center shadow-lg group-hover/feature:scale-110 group-hover/feature:rotate-3 transition-all duration-300`}>
                                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="text-gray-800 dark:text-gray-200 font-semibold text-lg leading-relaxed">
                                  {feature}
                                </span>
                              </div>
                            ))
                          ) : (
                            <>
                              <div className="flex items-center gap-5 group/feature p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                                <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${cardColor} rounded-xl flex items-center justify-center shadow-lg group-hover/feature:scale-110 group-hover/feature:rotate-3 transition-all duration-300`}>
                                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="text-gray-800 dark:text-gray-200 font-semibold text-lg">Premium server access</span>
                              </div>
                              <div className="flex items-center gap-5 group/feature p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                                <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${cardColor} rounded-xl flex items-center justify-center shadow-lg group-hover/feature:scale-110 group-hover/feature:rotate-3 transition-all duration-300`}>
                                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="text-gray-800 dark:text-gray-200 font-semibold text-lg">Exclusive permissions</span>
                              </div>
                              <div className="flex items-center gap-5 group/feature p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                                <div className={`flex-shrink-0 w-8 h-8 bg-gradient-to-br ${cardColor} rounded-xl flex items-center justify-center shadow-lg group-hover/feature:scale-110 group-hover/feature:rotate-3 transition-all duration-300`}>
                                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="text-gray-800 dark:text-gray-200 font-semibold text-lg">Priority support</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Ultra Premium CTA Button */}
                      <button
                        onClick={() => handleDirectPurchase(rank)}
                        className={`w-full bg-gradient-to-r ${cardColor} hover:shadow-2xl text-white font-black py-5 px-10 rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-4 text-xl group/btn relative overflow-hidden`}
                      >
                        {/* Button Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                        
                        <svg className="w-7 h-7 group-hover/btn:scale-110 transition-transform duration-300 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        <span className="tracking-wide font-black relative z-10">Purchase Now</span>
                        <svg className="w-7 h-7 group-hover/btn:translate-x-1 transition-transform duration-300 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Products;
