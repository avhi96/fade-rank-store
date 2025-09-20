import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  FaCopy, 
  FaDownload, 
  FaEye, 
  FaTrash, 
  FaXmark, 
  FaCheck, 
  FaClock, 
  FaTruck,
  FaCube,
  FaCode,
  FaGift,
  FaGamepad,
  FaStar,
  FaCrown,
  FaGem
} from 'react-icons/fa6';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedOrderForCode, setSelectedOrderForCode] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Fetch from users/{userId}/orders
        const userOrdersQuery = query(
          collection(db, 'users', user.uid, 'orders'),
          orderBy('createdAt', 'desc')
        );
        const userOrdersSnapshot = await getDocs(userOrdersQuery);
        const userOrders = userOrdersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'item',
        }));

        // Fetch from productOrders collection
        const productOrdersQuery = query(
          collection(db, 'productOrders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const productOrdersSnapshot = await getDocs(productOrdersQuery);
        const productOrders = productOrdersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'product',
        }));

        // Fetch from root-level 'orders' collection filtered by userId
        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const rootOrders = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'item',
        }));

        // Merge all arrays - no sample data
        const allOrders = [...userOrders, ...productOrders, ...rootOrders];
        setOrders(allOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        toast.error(`Error loading orders: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <FaCheck className="text-green-500" />;
      case 'processing':
        return <FaClock className="text-yellow-500" />;
      case 'shipped':
        return <FaTruck className="text-blue-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Code copied to clipboard!', {
      icon: '📋',
      style: {
        background: '#1f2937',
        color: 'white',
        border: '1px solid #374151'
      }
    });
  };

  const downloadInvoice = (order) => {
    const invoiceText = `
╔══════════════════════════════════════╗
║            FADE STORE INVOICE        ║
╚══════════════════════════════════════╝

INVOICE DETAILS
═══════════════════════════════════════
Invoice ID: #${order.id}
Order Date: ${order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleString() : 'N/A'}
Customer: ${user?.displayName || 'User'} (${user?.email})

PRODUCT INFORMATION
═══════════════════════════════════════
Product: ${order.productName || order.items?.[0]?.name || 'Minecraft Rank'}
Price: ₹${Number(order.price || 0).toFixed(2)}
Status: ${order.status || 'Pending'}
Type: ${order.type === 'product' ? 'Minecraft Rank' : 'Item'}

${order.assignedCode ? `MINECRAFT RANK CODE
═══════════════════════════════════════
Your Code: ${order.assignedCode}

REDEMPTION INSTRUCTIONS
═══════════════════════════════════════
1. Join our Minecraft server
2. Go to the #rank-codes channel
3. Type: /redeem ${order.assignedCode}
4. Enjoy your new rank privileges!` : ''}

PAYMENT INFORMATION
═══════════════════════════════════════
Payment Method: UPI / Razorpay
Total Amount: ₹${Number(order.price || 0).toFixed(2)}

═══════════════════════════════════════
Thank you for choosing FADE Store!
Visit us again for more Minecraft ranks!
═══════════════════════════════════════
    `;
    
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FADE-Invoice-${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Invoice downloaded successfully!');
  };

  const showCodeDetails = (order) => {
    setSelectedOrderForCode(order);
    setShowCodeModal(true);
  };

  const confirmCancelOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCancelConfirmed = async () => {
    const orderId = selectedOrder.id;

    try {
      await deleteDoc(doc(db, 'orders', orderId));
      await deleteDoc(doc(db, 'users', user.uid, 'orders', orderId));
      setOrders(prev => prev.filter(order => order.id !== orderId));
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel order.');
    } finally {
      setShowModal(false);
      setSelectedOrder(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return order.status === 'completed';
    if (activeTab === 'codes') return order.assignedCode;
    return true;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="professional-card p-12 text-center">
            <FaCube className="text-6xl text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Login Required</h2>
            <p className="text-xl text-gray-300">Please login to view your purchase history.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="professional-card p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300">Loading your purchase history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Professional Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Professional Minecraft Badge */}
          <div className="animate-fade-in-down mb-8">
            <div className="inline-flex items-center gap-3 professional-card px-8 py-4 mb-8">
              <FaCube className="text-emerald-400 text-xl" />
              <span className="text-lg font-bold text-white tracking-wide">My Orders</span>
            </div>
          </div>

          {/* Professional Hero Title */}
          <div className="animate-fade-in-up mb-12">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-tight mb-8">
              <span className="text-gradient bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                Purchase History
              </span>
            </h1>
          </div>

          {/* Professional Description */}
          <div className="animate-fade-in-up mb-16" style={{ animationDelay: '0.2s' }}>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-200 mb-6 max-w-4xl mx-auto leading-relaxed">
              Access your Minecraft rank codes and manage your orders
            </p>
          </div>

        </div>
      </div>

      {/* Professional Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-16">
            <div className="professional-card p-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`btn-primary hover-lift flex items-center gap-2 px-6 py-3 ${
                    activeTab === 'all' ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <FaGamepad />
                  All Orders
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`btn-secondary hover-lift flex items-center gap-2 px-6 py-3 ${
                    activeTab === 'completed' ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <FaCheck />
                  Completed
                </button>
                <button
                  onClick={() => setActiveTab('codes')}
                  className={`btn-primary hover-lift flex items-center gap-2 px-6 py-3 ${
                    activeTab === 'codes' ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}
                >
                  <FaCode />
                  My Codes
                </button>
              </div>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center">
              <div className="professional-card p-12 max-w-4xl mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-8">
                  <FaCube className="text-4xl text-white" />
                </div>
                <h2 className="text-5xl font-bold text-gradient bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-6">
                  {activeTab === 'codes' ? 'No Codes Yet' : 'No Orders Found'}
                </h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                  {activeTab === 'codes' 
                    ? "You don't have any rank codes yet. Purchase a Minecraft rank to get started!"
                    : "You haven't placed any orders yet. Start shopping for Minecraft ranks!"
                  }
                </p>
                <div className="flex justify-center">
                  <a
                    href="/products"
                    className="btn-primary hover-lift hover-glow flex items-center gap-3 text-xl px-10 py-5"
                  >
                    <FaGem className="text-2xl" />
                    Browse Minecraft Ranks
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-8">
              {filteredOrders.map(order => (
                <div key={order.id} className="professional-card hover-lift p-0 overflow-hidden">
                  
                  {/* Order Header */}
                  <div className="px-8 py-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/30 to-gray-900/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                          <FaCrown className="text-white text-2xl" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">
                            {order.productName || order.items?.[0]?.name || 'Minecraft Rank'}
                          </h3>
                          <p className="text-gray-400 flex items-center gap-2">
                            <FaGamepad className="text-sm" />
                            Order #{order.id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-emerald-400 mb-1">₹{Number(order.price || 0).toFixed(2)}</p>
                        <p className="text-gray-400">
                          {order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                      
                      {/* Left Column - Order Details */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(order.status)}
                            <span className="text-white font-semibold text-lg">Status:</span>
                          </div>
                          <span className="text-gray-300 capitalize text-lg font-medium">{order.status || 'Pending'}</span>
                        </div>

                        <div className="flex items-center gap-4">
                          <FaCube className="text-blue-400 text-xl" />
                          <span className="text-white font-semibold text-lg">Type:</span>
                          <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full font-medium border border-blue-500/30">
                            {order.type === 'product' ? 'Minecraft Rank' : 'Item'}
                          </span>
                        </div>

                        {order.assignedCode && (
                          <div className="professional-card p-6 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30">
                            <div className="flex items-center gap-3 mb-4">
                              <FaCode className="text-emerald-400 text-xl" />
                              <span className="text-emerald-300 font-bold text-lg">Rank Code Available</span>
                              <FaStar className="text-yellow-400 animate-pulse" />
                            </div>
                            <p className="text-gray-300 mb-4 text-lg">Your Minecraft rank code is ready to use!</p>
                            <div className="flex gap-3">
                              <button
                                onClick={() => showCodeDetails(order)}
                                className="btn-secondary hover-lift flex items-center gap-2"
                              >
                                <FaEye />
                                View Code
                              </button>
                              <button
                                onClick={() => copyToClipboard(order.assignedCode)}
                                className="btn-primary hover-lift flex items-center gap-2"
                              >
                                <FaCopy />
                                Quick Copy
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column - Actions */}
                      <div className="space-y-4">
                        <button
                          onClick={() => downloadInvoice(order)}
                          className="btn-secondary hover-lift w-full flex items-center justify-center gap-3"
                        >
                          <FaDownload />
                          Download Invoice
                        </button>

                        {order.status !== 'completed' && (
                          <button
                            onClick={() => confirmCancelOrder(order)}
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/25 font-medium"
                          >
                            <FaXmark />
                            Cancel Order
                          </button>
                        )}

                        {order.status === 'completed' && (
                          <button
                            onClick={async () => {
                              try {
                                await deleteDoc(doc(db, 'orders', order.id));
                                await deleteDoc(doc(db, 'users', user.uid, 'orders', order.id));
                                setOrders(prev => prev.filter(o => o.id !== order.id));
                                toast.success('Order deleted successfully');
                              } catch (err) {
                                toast.error('Failed to delete order.');
                              }
                            }}
                            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg font-medium"
                          >
                            <FaTrash />
                            Delete Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Code Display Modal */}
      {showCodeModal && selectedOrderForCode && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="professional-card w-full max-w-3xl">
            <div className="px-8 py-6 border-b border-gray-700/50 bg-gradient-to-r from-emerald-900/30 to-green-900/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                    <FaCrown className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Minecraft Rank Code</h2>
                </div>
                <button
                  onClick={() => setShowCodeModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                >
                  <FaXmark className="text-2xl" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="professional-card p-6 mb-8 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-300 font-semibold mb-2 text-lg">Your Rank Code:</p>
                    <code className="text-3xl font-mono font-bold text-emerald-300 tracking-wider block">
                      {selectedOrderForCode.assignedCode}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedOrderForCode.assignedCode)}
                    className="btn-primary hover-lift flex items-center gap-3 text-lg px-6 py-4"
                  >
                    <FaCopy className="text-xl" />
                    Copy Code
                  </button>
                </div>
              </div>
              
              <div className="professional-card p-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                <h4 className="text-blue-300 font-bold mb-4 flex items-center gap-3 text-xl">
                  <FaGift className="animate-bounce text-2xl" />
                  How to redeem your code:
                </h4>
                <ol className="text-gray-300 space-y-4 text-lg">
                  <li className="flex items-start gap-4">
                    <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mt-1">1</span>
                    <span>Join our Minecraft server using the IP address provided</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mt-1">2</span>
                    <span>Go to the #rank-codes channel in our server</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mt-1">3</span>
                    <span>Type: <code className="professional-card px-3 py-2 text-emerald-300 font-mono text-sm">/redeem {selectedOrderForCode.assignedCode}</code></span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mt-1">4</span>
                    <span>Enjoy your new rank privileges and exclusive features!</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="professional-card w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-700/50">
              <h2 className="text-xl font-semibold text-white">Cancel Order</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-6 text-lg">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedOrder(null);
                  }}
                  className="btn-secondary hover-lift flex-1"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelConfirmed}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
