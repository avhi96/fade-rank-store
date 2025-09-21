import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, limit, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  FaCrown, FaGem, FaStar, FaFire, FaBolt, FaLock, 
  FaTimes, FaShoppingCart, FaEnvelope, FaUser, FaSearch, FaFilter 
} from 'react-icons/fa';
import { addDoc, serverTimestamp } from 'firebase/firestore';

const AllProducts = () => {                                                                                                                                                                                                                                
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allRanks, setAllRanks] = useState([]);
  const [filteredRanks, setFilteredRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedRank, setSelectedRank] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({
    minecraftUsername: '',
    email: '',
    discordUsername: ''
  });
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // No default ranks - only admin-added ranks will be shown

  useEffect(() => {
    fetchAllRanks();
  }, []);

  useEffect(() => {
    filterRanks();
  }, [allRanks, searchTerm, priceFilter]);

  const fetchAllRanks = async () => {
    try {
      setLoading(true);
      
      // Fetch only admin-added ranks from Firebase
      const ranksSnap = await getDocs(collection(db, 'products'));
      const adminRanks = ranksSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isDefault: false
      }));

      // Show only admin-added ranks
      setAllRanks(adminRanks);
    } catch (error) {
      console.error('Error fetching ranks:', error);
      toast.error('Failed to load ranks');
      setAllRanks([]);
    } finally {
      setLoading(false);
    }
  };

  const filterRanks = () => {
    let filtered = allRanks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(rank =>
        rank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rank.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price filter
    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'low':
          filtered = filtered.filter(rank => rank.price < 500);
          break;
        case 'medium':
          filtered = filtered.filter(rank => rank.price >= 500 && rank.price < 1000);
          break;
        case 'high':
          filtered = filtered.filter(rank => rank.price >= 1000);
          break;
        default:
          break;
      }
    }

    setFilteredRanks(filtered);
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
      default: return <FaCrown {...iconProps} className="text-yellow-500 text-4xl" />;
    }
  };

  const handleRankPurchase = (rank) => {
    setSelectedRank(rank);
    setCheckoutForm({
      minecraftUsername: '',
      email: user?.email || '',
      discordUsername: ''
    });
    setShowCheckout(true);
  };

  const handleFormChange = (e) => {
    setCheckoutForm({
      ...checkoutForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true);

    try {
      // Initialize Razorpay payment
      const options = {
        key: 'rzp_live_RJWzpQal9wjEC7', // Replace with your Razorpay key ID
        amount: selectedRank.price * 100, // Amount in paise (multiply by 100)
        currency: 'INR',
        name: 'Fade',
        description: `Purchase ${selectedRank.name}`,
        image: 'https://images-ext-1.discordapp.net/external/SeJGRXkeIpNvC26GS-5IziN8m5hUv0g0TQViJmwvX00/%3Fsize%3D1024/https/cdn.discordapp.com/icons/1296913762493923421/c609b2dfd6a28b2d7f16b02a291c08e5.webp?format=webp&width=1006&height=1006',
        handler: async function (response) {
          try {
            let assignedCode = null;

            // For admin-created ranks, try to assign a code
            if (!selectedRank.isDefault) {
              try {
                // Find an available code for this rank
                const availableCodesQuery = query(
                  collection(db, 'rankCodes'),
                  where('rankId', '==', selectedRank.id),
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
                    userEmail: checkoutForm.email
                  });
                }
              } catch (codeError) {
                console.error('Error assigning code:', codeError);
                // Continue with order creation even if code assignment fails
              }
            }

            // Payment successful, create order in Firebase
            const orderData = {
              userId: user?.uid || null,
              userEmail: checkoutForm.email,
              minecraftUsername: checkoutForm.minecraftUsername,
              discordUsername: checkoutForm.discordUsername,
              productName: selectedRank.name,
              productId: selectedRank.id,
              price: selectedRank.price,
              originalPrice: selectedRank.originalPrice || selectedRank.price,
              discount: selectedRank.discount || 0,
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

            setShowCheckout(false);
            setSelectedRank(null);
            setCheckoutForm({
              minecraftUsername: '',
              email: '',
              discordUsername: ''
            });
          } catch (error) {
            console.error('Error saving order:', error);
            toast.error('Payment successful but failed to save order. Please contact support.');
          }
        },
        prefill: {
          name: checkoutForm.minecraftUsername,
          email: checkoutForm.email,
          contact: ''
        },
        notes: {
          minecraftUsername: checkoutForm.minecraftUsername,
          discordUsername: checkoutForm.discordUsername,
          productName: selectedRank.name
        },
        theme: {
          color: '#CDBD9C'
        },
        modal: {
          ondismiss: function() {
            setCheckoutLoading(false);
            setShowCheckout(false);
            setSelectedRank(null);
            setCheckoutForm({
              minecraftUsername: '',
              email: '',
              discordUsername: ''
            });
            toast('Payment cancelled', { icon: 'ℹ️' });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initializing payment:', error);
      
      // Create failed order data
      const failedOrderData = {
        userId: user?.uid || null,
        userEmail: checkoutForm.email,
        minecraftUsername: checkoutForm.minecraftUsername,
        discordUsername: checkoutForm.discordUsername,
        productName: selectedRank.name,
        productId: selectedRank.id,
        price: selectedRank.price,
        originalPrice: selectedRank.originalPrice || selectedRank.price,
        discount: selectedRank.discount || 0,
        status: 'Failed',
        paymentId: null,
        createdAt: new Date().toISOString(),
        errorMessage: error.message
      };

      // Store failed order data
      localStorage.setItem('lastOrder', JSON.stringify(failedOrderData));

      // Close checkout modal
      setShowCheckout(false);
      setSelectedRank(null);
      setCheckoutForm({
        minecraftUsername: '',
        email: '',
        discordUsername: ''
      });

      // Navigate to failed page
      navigate('/order-failed', { 
        state: { orderData: failedOrderData }
      });
      
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full mb-8 border border-blue-200 dark:border-blue-700">
            <FaCrown className="text-blue-600" />
            <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">All Discord Ranks</span>
          </div>
          <h1 className="text-5xl font-black leading-tight mb-8 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            Complete Discord{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent relative">
              Ranks Collection
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Browse our complete collection of Discord ranks including premium features and exclusive access
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search ranks by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              >
                <option value="all">All Prices</option>
                <option value="low">Under ₹500</option>
                <option value="medium">₹500 - ₹1000</option>
                <option value="high">Above ₹1000</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredRanks.length} of {allRanks.length} ranks
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading Discord ranks...</p>
          </div>
        ) : (
          <>
            {/* Ranks Grid */}
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRanks.map((rank, index) => (
                <div 
                  key={rank.id}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm overflow-hidden flex flex-col group relative animate-fade-in-up rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Popular Badge */}
                  {rank.popular && (
                    <div className="absolute -top-3 -right-3 z-20">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        POPULAR
                      </div>
                    </div>
                  )}

                  <div className={`absolute -inset-1 bg-gradient-to-r ${rank.color || 'from-blue-400 to-purple-500'} blur-lg opacity-0 group-hover:opacity-20 transition-all rounded-xl z-0`} />

                  {/* Rank Header */}
                  <div className={`relative bg-gradient-to-r ${rank.color || 'from-blue-400 to-purple-500'} p-6 text-white overflow-hidden`}>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
                        <div className="text-2xl text-white">
                          {getIcon(rank.icon)}
                        </div>
                      </div>
                      <h2 className="text-xl font-black mb-2">
                        {rank.name}
                      </h2>
                      <p className="text-white/90 text-sm font-medium">
                        {rank.description}
                      </p>
                    </div>
                  </div>

                  {/* Rank Content */}
                  <div className="p-6 flex flex-col flex-1 justify-between z-10 relative bg-white dark:bg-gray-800">
                    {/* Pricing */}
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-2xl font-black text-green-600 dark:text-green-400">
                          ₹{rank.price}
                        </span>
                        {rank.discount > 0 && rank.originalPrice && (
                          <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                            ₹{rank.originalPrice}
                          </span>
                        )}
                      </div>
                      {rank.discount > 0 && (
                        <div className="inline-block bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full text-xs font-bold">
                          {rank.discount}% OFF
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    {rank.features && rank.features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-3">Features:</h4>
                        <ul className="space-y-2">
                          {rank.features.slice(0, 4).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                              <div className={`w-4 h-4 bg-gradient-to-r ${rank.color || 'from-blue-400 to-purple-500'} rounded flex items-center justify-center`}>
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="font-medium">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Purchase Button */}
                    <button
                      onClick={() => handleRankPurchase(rank)}
                      className={`w-full bg-gradient-to-r ${rank.color || 'from-blue-600 to-blue-700'} hover:shadow-2xl text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2`}
                    >
                      <FaShoppingCart />
                      Get This Rank
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredRanks.length === 0 && (
              <div className="text-center py-20">
                <FaSearch className="text-6xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">No ranks found</h3>
                <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedRank && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full bg-gradient-to-r ${selectedRank.color || 'from-blue-400 to-purple-500'}`}>
                    <div className="text-white">
                      {getIcon(selectedRank.icon)}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Purchase {selectedRank.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">₹{selectedRank.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minecraft Username *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="minecraftUsername"
                      value={checkoutForm.minecraftUsername}
                      onChange={handleFormChange}
                      placeholder="Enter your Minecraft username"
                      className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={checkoutForm.email}
                      onChange={handleFormChange}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discord Username (Optional)
                  </label>
                  <input
                    type="text"
                    name="discordUsername"
                    value={checkoutForm.discordUsername}
                    onChange={handleFormChange}
                    placeholder="Enter your Discord username"
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                  />
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Order Summary</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-300">{selectedRank.name}</span>
                    <span className="font-semibold">₹{selectedRank.price}</span>
                  </div>
                  {selectedRank.discount > 0 && selectedRank.originalPrice && (
                    <div className="flex justify-between items-center mb-2 text-sm">
                      <span className="text-gray-500">Original Price</span>
                      <span className="line-through text-gray-500">₹{selectedRank.originalPrice}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">₹{selectedRank.price}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className={`w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 ${checkoutLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FaShoppingCart />
                  {checkoutLoading ? 'Processing...' : 'Complete Purchase'}
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Your rank will be activated within 24 hours after purchase confirmation.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
