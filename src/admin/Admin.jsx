import React, { useEffect, useState } from 'react';
import {
  collection, getDocs, updateDoc, doc, deleteDoc, addDoc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth, isAdmin } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  FaUsers, FaShoppingCart, FaEye, FaTrash, FaEdit, 
  FaSearch, FaFilter, FaCrown, FaGem,
  FaChartLine, FaDollarSign, FaCalendarAlt, FaEnvelope,
  FaStar, FaFire, FaBolt, FaLock, FaPlus, FaSave
} from 'react-icons/fa';

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('purchases');
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState([]);
  const [customRanks, setCustomRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  // Form state for adding new ranks
  const [rankForm, setRankForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
    icon: 'crown',
    color: 'from-blue-400 to-purple-500',
    features: ['', '', '', ''],
    popular: false
  });
  const [editingRank, setEditingRank] = useState(null);

  // Code management state
  const [rankCodes, setRankCodes] = useState([]);
  const [selectedRankForCodes, setSelectedRankForCodes] = useState('');
  const [newCodes, setNewCodes] = useState('');
  const [codesLoading, setCodesLoading] = useState(false);

  const tabs = [
    { id: 'purchases', label: 'User Purchases', icon: FaShoppingCart },
    { id: 'addRank', label: 'Add Discord Rank', icon: FaPlus },
    { id: 'manageRanks', label: 'Manage Ranks', icon: FaCrown },
    { id: 'manageCodes', label: 'Manage Codes', icon: FaLock }
  ];

  const iconOptions = [
    { value: 'crown', label: 'Crown', icon: FaCrown },
    { value: 'gem', label: 'Gem', icon: FaGem },
    { value: 'star', label: 'Star', icon: FaStar },
    { value: 'fire', label: 'Fire', icon: FaFire },
    { value: 'bolt', label: 'Bolt', icon: FaBolt },
    { value: 'lock', label: 'Lock', icon: FaLock }
  ];

  const colorOptions = [
    { value: 'from-yellow-400 to-orange-500', label: 'Gold', preview: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
    { value: 'from-purple-400 to-pink-500', label: 'Purple', preview: 'bg-gradient-to-r from-purple-400 to-pink-500' },
    { value: 'from-blue-400 to-cyan-500', label: 'Blue', preview: 'bg-gradient-to-r from-blue-400 to-cyan-500' },
    { value: 'from-red-400 to-orange-500', label: 'Red', preview: 'bg-gradient-to-r from-red-400 to-orange-500' },
    { value: 'from-green-400 to-emerald-500', label: 'Green', preview: 'bg-gradient-to-r from-green-400 to-emerald-500' },
    { value: 'from-indigo-400 to-purple-500', label: 'Indigo', preview: 'bg-gradient-to-r from-indigo-400 to-purple-500' }
  ];

  useEffect(() => {
    if (isAdmin(user)) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData = {};
      usersSnap.docs.forEach(doc => {
        const userData = doc.data();
        usersData[doc.id] = {
          id: doc.id,
          username: userData.username || 'Unknown',
          email: userData.email || 'No email',
          displayName: userData.displayName || userData.username || 'Unknown User'
        };
      });
      setUsers(usersData);

      // Fetch custom ranks
      const ranksSnap = await getDocs(collection(db, 'products'));
      const ranksData = ranksSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomRanks(ranksData);

      // Fetch rank codes
      const codesSnap = await getDocs(collection(db, 'rankCodes'));
      const codesData = codesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRankCodes(codesData);

      // Fetch all purchases
      const allPurchases = [];

      // Fetch razorpay orders
      const razorpayOrdersSnap = await getDocs(collection(db, 'razorpayOrders'));
      razorpayOrdersSnap.docs.forEach(doc => {
        const orderData = doc.data();
        const notes = orderData.notes || {};
        allPurchases.push({
          id: doc.id,
          type: 'Discord Rank',
          userId: orderData.userId,
          userEmail: users[orderData.userId]?.email || orderData.userEmail || orderData.email || notes.customerEmail || 'Not provided',
          username: users[orderData.userId]?.username || 'Not provided',
          items: [{
            name: orderData.productName || orderData.name || notes.productName || 'Discord Rank',
            price: orderData.price || orderData.amount || 0,
            quantity: 1
          }],
          totalAmount: orderData.price || orderData.amount || 0,
          status: orderData.status || 'Pending',
          createdAt: orderData.createdAt,
          discordUsername: orderData.discordUsername || notes.discordUsername || 'Not provided',
          minecraftUsername: orderData.minecraftUsername || notes.minecraftUsername || 'Not provided',
          assignedCode: orderData.assignedCode || null
        });
      });

      // Fetch digital product orders
      const digitalOrdersSnap = await getDocs(collection(db, 'productOrders'));
      digitalOrdersSnap.docs.forEach(doc => {
        const orderData = doc.data();
        allPurchases.push({
          id: doc.id,
          type: 'Discord Rank',
          userId: orderData.userId,
          userEmail: orderData.userEmail || orderData.email || 'Not provided',
          items: [{
            name: orderData.productName || orderData.name || 'Discord Rank',
            price: orderData.price || 0,
            quantity: 1
          }],
          totalAmount: orderData.price || 0,
          status: orderData.status || 'Pending',
          createdAt: orderData.createdAt,
          discordUsername: orderData.discordUsername || 'Not provided',
          minecraftUsername: orderData.minecraftUsername || 'Not provided',
          assignedCode: orderData.assignedCode || null
        });
      });

      // Sort by creation date (newest first)
      allPurchases.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      setPurchases(allPurchases);

      // Calculate stats
      const totalRevenue = allPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
      const pendingOrders = allPurchases.filter(p => p.status === 'Pending').length;
      const completedOrders = allPurchases.filter(p => p.status === 'Completed').length;

      setStats({
        totalPurchases: allPurchases.length,
        totalRevenue,
        pendingOrders,
        completedOrders
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleRankFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRankForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...rankForm.features];
    newFeatures[index] = value;
    setRankForm(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const handleAddRank = async (e) => {
    e.preventDefault();
    try {
      const rankData = {
        name: rankForm.name,
        description: rankForm.description,
        price: Number(rankForm.price),
        originalPrice: rankForm.originalPrice ? Number(rankForm.originalPrice) : Number(rankForm.price),
        discount: rankForm.discount ? Number(rankForm.discount) : 0,
        icon: rankForm.icon,
        color: rankForm.color,
        features: rankForm.features.filter(f => f.trim() !== ''),
        popular: rankForm.popular,
        createdAt: serverTimestamp(),
        createdBy: user.uid
      };

      if (editingRank) {
        await updateDoc(doc(db, 'products', editingRank), rankData);
        toast.success('Rank updated successfully!');
        setEditingRank(null);
      } else {
        await addDoc(collection(db, 'products'), rankData);
        toast.success('New Discord rank added successfully!');
      }

      // Reset form
      setRankForm({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        discount: '',
        icon: 'crown',
        color: 'from-blue-400 to-purple-500',
        features: ['', '', '', ''],
        popular: false
      });

      fetchAllData();
    } catch (error) {
      console.error('Error adding rank:', error);
      toast.error('Failed to add rank');
    }
  };

  const handleEditRank = (rank) => {
    setRankForm({
      name: rank.name || '',
      description: rank.description || '',
      price: rank.price?.toString() || '',
      originalPrice: rank.originalPrice?.toString() || '',
      discount: rank.discount?.toString() || '',
      icon: rank.icon || 'crown',
      color: rank.color || 'from-blue-400 to-purple-500',
      features: [...(rank.features || []), '', '', '', ''].slice(0, 4),
      popular: rank.popular || false
    });
    setEditingRank(rank.id);
    setActiveTab('addRank');
  };

  const handleDeleteRank = async (rankId) => {
    if (!window.confirm('Are you sure you want to delete this rank?')) return;
    
    try {
      await deleteDoc(doc(db, 'products', rankId));
      toast.success('Rank deleted successfully');
      fetchAllData();
    } catch (error) {
      console.error('Error deleting rank:', error);
      toast.error('Failed to delete rank');
    }
  };

  const updateOrderStatus = async (orderId, newStatus, orderType) => {
    try {
      await updateDoc(doc(db, 'razorpayOrders', orderId), { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchAllData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const deleteOrder = async (orderId, orderType) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await deleteDoc(doc(db, 'razorpayOrders', orderId));
      toast.success('Order deleted successfully');
      fetchAllData();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = 
      purchase.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (users[purchase.userId]?.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || purchase.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getIconComponent = (iconName) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : FaCrown;
  };

  // Code management functions
  const fetchCodesForRank = async (rankId) => {
    try {
      setCodesLoading(true);
      const codesSnap = await getDocs(collection(db, 'rankCodes'));
      const codes = codesSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(code => code.rankId === rankId);
      return codes;
    } catch (error) {
      console.error('Error fetching codes:', error);
      toast.error('Failed to fetch codes');
      return [];
    } finally {
      setCodesLoading(false);
    }
  };

  const handleAddCodes = async (e) => {
    e.preventDefault();
    if (!selectedRankForCodes || !newCodes.trim()) {
      toast.error('Please select a rank and enter codes');
      return;
    }

    try {
      setCodesLoading(true);
      const codesList = newCodes.split('\n').filter(code => code.trim() !== '');
      
      for (const code of codesList) {
        await addDoc(collection(db, 'rankCodes'), {
          code: code.trim(),
          rankId: selectedRankForCodes,
          rankName: customRanks.find(r => r.id === selectedRankForCodes)?.name || 'Unknown Rank',
          isUsed: false,
          createdAt: serverTimestamp(),
          createdBy: user.uid
        });
      }

      toast.success(`Added ${codesList.length} codes successfully!`);
      setNewCodes('');
      fetchAllData();
    } catch (error) {
      console.error('Error adding codes:', error);
      toast.error('Failed to add codes');
    } finally {
      setCodesLoading(false);
    }
  };

  const handleDeleteCode = async (codeId) => {
    if (!window.confirm('Are you sure you want to delete this code?')) return;
    
    try {
      await deleteDoc(doc(db, 'rankCodes', codeId));
      toast.success('Code deleted successfully');
      fetchAllData();
    } catch (error) {
      console.error('Error deleting code:', error);
      toast.error('Failed to delete code');
    }
  };

  if (!isAdmin(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaCrown className="text-6xl text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">Admin privileges required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden py-8 px-4">
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-12 h-12 bg-green-500 rounded-sm opacity-20 animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-32 right-20 w-8 h-8 bg-blue-500 rounded-sm opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-1/4 w-10 h-10 bg-yellow-500 rounded-sm opacity-25 animate-bounce" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-60 right-1/3 w-6 h-6 bg-purple-500 rounded-sm opacity-20 animate-bounce" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full mb-6 border border-blue-200 dark:border-blue-700">
            <FaCrown className="text-blue-600" />
            <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Admin Dashboard</span>
          </div>
          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            Discord Ranks Management
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage purchases, create custom ranks, and monitor orders
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'purchases' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                    <FaShoppingCart className="text-2xl text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Purchases</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPurchases}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <FaDollarSign className="text-2xl text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.totalRevenue}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                    <FaCalendarAlt className="text-2xl text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                    <FaChartLine className="text-2xl text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedOrders}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by email, username, or product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                  />
                </div>
                <div className="relative">
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <button
                  onClick={fetchAllData}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 min-w-[120px]"
                  title="Refresh order list"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <FaSearch className="text-sm" />
                      Refresh
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Orders List */}
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading purchases...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPurchases.length === 0 ? (
                  <div className="text-center py-20">
                    <FaShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
                    <p className="text-xl text-gray-600 dark:text-gray-400">No purchases found</p>
                  </div>
                ) : (
                  filteredPurchases.map((purchase) => (
                    <div key={purchase.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden">
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`p-2 rounded-full ${purchase.type === 'Discord Rank' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                                {purchase.type === 'Discord Rank' ? 
                                  <FaCrown className="text-purple-600" /> : 
                                  <FaShoppingCart className="text-blue-600" />
                                }
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                  {purchase.type} - Order #{purchase.id.slice(-6)}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {purchase.createdAt?.toDate ? purchase.createdAt.toDate().toLocaleDateString() : 'Date not available'}
                                </p>
                              </div>
                            </div>

                            {/* User Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Customer Email</p>
                                <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                  <FaEnvelope className="text-gray-400" />
                                  {purchase.userEmail}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Profile Username</p>
                                <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                  <FaUsers className="text-gray-400" />
                                  {purchase.username}
                                </p>
                              </div>
                              {purchase.discordUsername && (
                                <div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Discord Username</p>
                                  <p className="font-semibold text-gray-900 dark:text-white bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">
                                    {purchase.discordUsername}
                                  </p>
                                </div>
                              )}
                              {purchase.minecraftUsername && (
                                <div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">Minecraft Username</p>
                                  <p className="font-semibold text-gray-900 dark:text-white bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                    {purchase.minecraftUsername}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Items */}
                            <div className="mb-4">
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Items Purchased</p>
                              <div className="space-y-2">
                                {purchase.items.map((item, index) => (
                                  <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                                    <span className="text-green-600 dark:text-green-400 font-bold">
                                      ₹{item.price} {item.quantity > 1 && `x${item.quantity}`}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Total Amount */}
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-lg font-bold text-gray-900 dark:text-white">Total Amount:</span>
                              <span className="text-2xl font-bold text-green-600 dark:text-green-400">₹{purchase.totalAmount}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-3 lg:w-48">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                purchase.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                purchase.status === 'Processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                purchase.status === 'Shipped' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              }`}>
                                {purchase.status}
                              </span>
                            </div>

                            <select
                              value={purchase.status}
                              onChange={(e) => updateOrderStatus(purchase.id, e.target.value, purchase.type)}
                              className="px-3 py-2 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Completed">Completed</option>
                            </select>

                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedPurchase(purchase);
                                  setShowModal(true);
                                }}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                              >
                                <FaEye />
                                View
                              </button>
                              <button
                                onClick={() => deleteOrder(purchase.id, purchase.type)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {activeTab === 'addRank' && (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FaPlus />
              {editingRank ? 'Edit Discord Rank' : 'Add New Discord Rank'}
            </h2>
            
            <form onSubmit={handleAddRank} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rank Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={rankForm.name}
                    onChange={handleRankFormChange}
                    placeholder="Enter rank name (e.g., Elite Rank)"
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={rankForm.description}
                    onChange={handleRankFormChange}
                    placeholder="Enter rank description"
                    rows="3"
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={rankForm.price}
                    onChange={handleRankFormChange}
                    placeholder="299"
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={rankForm.originalPrice}
                    onChange={handleRankFormChange}
                    placeholder="399"
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={rankForm.discount}
                    onChange={handleRankFormChange}
                    placeholder="25"
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Icon
                  </label>
                  <select
                    name="icon"
                    value={rankForm.icon}
                    onChange={handleRankFormChange}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {iconOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Theme
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {colorOptions.map(option => (
                    <label key={option.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="color"
                        value={option.value}
                        checked={rankForm.color === option.value}
                        onChange={handleRankFormChange}
                        className="sr-only"
                      />
                      <div className={`p-3 rounded-lg border-2 transition-all ${
                        rankForm.color === option.value 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        <div className={`h-8 rounded ${option.preview} mb-2`}></div>
                        <p className="text-sm font-medium text-center text-gray-700 dark:text-gray-300">
                          {option.label}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Features (up to 4)
                </label>
                <div className="space-y-3">
                  {rankForm.features.map((feature, index) => (
                    <input
                      key={index}
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="popular"
                  id="popular"
                  checked={rankForm.popular}
                  onChange={handleRankFormChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="popular" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mark as Popular
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FaSave />
                  {editingRank ? 'Update Rank' : 'Add Rank'}
                </button>
                {editingRank && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRank(null);
                      setRankForm({
                        name: '',
                        description: '',
                        price: '',
                        originalPrice: '',
                        discount: '',
                        icon: 'crown',
                        color: 'from-blue-400 to-purple-500',
                        features: ['', '', '', ''],
                        popular: false
                      });
                    }}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {activeTab === 'manageRanks' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Manage Custom Ranks</h2>
              <p className="text-gray-600 dark:text-gray-400">Edit or delete custom Discord ranks</p>
            </div>

            {customRanks.length === 0 ? (
              <div className="text-center py-20">
                <FaCrown className="text-6xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No Custom Ranks</h3>
                <p className="text-gray-500 dark:text-gray-500 mb-6">Create your first custom Discord rank</p>
                <button
                  onClick={() => setActiveTab('addRank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                >
                  <FaPlus />
                  Add First Rank
                </button>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {customRanks.map((rank) => {
                  const IconComponent = getIconComponent(rank.icon);
                  return (
                    <div key={rank.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm overflow-hidden flex flex-col group relative rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                      {rank.popular && (
                        <div className="absolute -top-3 -right-3 z-20">
                          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            POPULAR
                          </div>
                        </div>
                      )}

                      <div className={`absolute -inset-1 bg-gradient-to-r ${rank.color} blur-lg opacity-0 group-hover:opacity-20 transition-all rounded-xl z-0`} />

                      {/* Rank Header */}
                      <div className={`relative bg-gradient-to-r ${rank.color} p-6 text-white`}>
                        <div className="flex items-center justify-center mb-4">
                          <IconComponent className="text-4xl text-white" />
                        </div>
                        <h2 className="text-xl font-black text-center mb-2">
                          {rank.name}
                        </h2>
                        <p className="text-center text-white/90 text-sm">
                          {rank.description}
                        </p>
                      </div>

                      {/* Rank Content */}
                      <div className="p-6 flex flex-col flex-1 justify-between z-10 relative">
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
                                <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditRank(rank)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                          >
                            <FaEdit />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRank(rank.id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'manageCodes' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Manage Discord Rank Codes</h2>
              <p className="text-gray-600 dark:text-gray-400">Add one-time use codes for Discord ranks</p>
            </div>

            {/* Add Codes Form */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaPlus />
                Add Codes to Rank
              </h3>
              
              <form onSubmit={handleAddCodes} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Rank *
                  </label>
                  <select
                    value={selectedRankForCodes}
                    onChange={(e) => setSelectedRankForCodes(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a rank...</option>
                    {customRanks.map(rank => (
                      <option key={rank.id} value={rank.id}>
                        {rank.name} - ₹{rank.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discord Rank Codes *
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Enter one code per line. These codes will be given to users after purchase.
                  </p>
                  <textarea
                    value={newCodes}
                    onChange={(e) => setNewCodes(e.target.value)}
                    placeholder={`ELITE-RANK-001\nELITE-RANK-002\nELITE-RANK-003\n...`}
                    rows="8"
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {newCodes.split('\n').filter(code => code.trim() !== '').length} codes will be added
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={codesLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave />
                  {codesLoading ? 'Adding Codes...' : 'Add Codes'}
                </button>
              </form>
            </div>

            {/* Codes List by Rank */}
            <div className="space-y-6">
              {customRanks.map(rank => {
                const rankCodesForThisRank = rankCodes.filter(code => code.rankId === rank.id);
                const availableCodes = rankCodesForThisRank.filter(code => !code.isUsed);
                const usedCodes = rankCodesForThisRank.filter(code => code.isUsed);
                const IconComponent = getIconComponent(rank.icon);

                return (
                  <div key={rank.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden">
                    {/* Rank Header */}
                    <div className={`bg-gradient-to-r ${rank.color} p-6 text-white`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <IconComponent className="text-3xl" />
                          <div>
                            <h3 className="text-xl font-bold">{rank.name}</h3>
                            <p className="text-white/90">₹{rank.price}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white/90">Available Codes</p>
                          <p className="text-2xl font-bold">{availableCodes.length}</p>
                        </div>
                      </div>
                    </div>

                    {/* Codes Content */}
                    <div className="p-6">
                      {rankCodesForThisRank.length === 0 ? (
                        <div className="text-center py-8">
                          <FaLock className="text-4xl text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 dark:text-gray-400">No codes added for this rank</p>
                          <button
                            onClick={() => {
                              setSelectedRankForCodes(rank.id);
                              setActiveTab('manageCodes');
                              document.querySelector('textarea').focus();
                            }}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                          >
                            <FaPlus />
                            Add Codes
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Available Codes */}
                          {availableCodes.length > 0 && (
                            <div>
                              <h4 className="font-bold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                Available Codes ({availableCodes.length})
                              </h4>
                              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                {availableCodes.map(code => (
                                  <div key={code.id} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-3 rounded-lg flex justify-between items-center">
                                    <span className="font-mono text-sm text-green-800 dark:text-green-300">
                                      {code.code}
                                    </span>
                                    <button
                                      onClick={() => handleDeleteCode(code.id)}
                                      className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                      <FaTrash className="text-xs" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Used Codes */}
                          {usedCodes.length > 0 && (
                            <div>
                              <h4 className="font-bold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                Used Codes ({usedCodes.length})
                              </h4>
                              <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                {usedCodes.map(code => (
                                  <div key={code.id} className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 p-3 rounded-lg flex justify-between items-center">
                                    <div className="flex-1">
                                      <span className="font-mono text-sm text-gray-600 dark:text-gray-400 line-through">
                                        {code.code}
                                      </span>
                                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                        Used: {code.usedAt?.toDate ? code.usedAt.toDate().toLocaleDateString() : 'Unknown'}
                                      </p>
                                      {code.usedBy && (
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                          By: {code.usedBy}
                                        </p>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this used code? This action cannot be undone.')) {
                                          handleDeleteCode(code.id);
                                        }
                                      }}
                                      className="text-red-500 hover:text-red-700 transition-colors ml-2 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                      title="Delete used code"
                                    >
                                      <FaTrash className="text-xs" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {customRanks.length === 0 && (
                <div className="text-center py-20">
                  <FaCrown className="text-6xl text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">No Ranks Available</h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-6">Create Discord ranks first to add codes</p>
                  <button
                    onClick={() => setActiveTab('addRank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                  >
                    <FaPlus />
                    Create First Rank
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal for Order Details */}
        {showModal && selectedPurchase && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Order Information</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                      <p><strong>Order ID:</strong> {selectedPurchase.id}</p>
                      <p><strong>Type:</strong> {selectedPurchase.type}</p>
                      <p><strong>Status:</strong> {selectedPurchase.status}</p>
                      <p><strong>Date:</strong> {selectedPurchase.createdAt?.toDate ? selectedPurchase.createdAt.toDate().toLocaleString() : 'Not available'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Customer Information</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                      <p><strong>Email:</strong> {selectedPurchase.userEmail}</p>
                      <p><strong>Username:</strong> {users[selectedPurchase.userId]?.username || 'Unknown'}</p>
                      {selectedPurchase.discordUsername && (
                        <p><strong>Discord Username:</strong> <span className="bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded text-purple-800 dark:text-purple-300">{selectedPurchase.discordUsername}</span></p>
                      )}
                      {selectedPurchase.minecraftUsername && (
                        <p><strong>Minecraft Username:</strong> <span className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded text-green-800 dark:text-green-300">{selectedPurchase.minecraftUsername}</span></p>
                      )}
                      {selectedPurchase.assignedCode && (
                        <p><strong>Assigned Code:</strong> <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-blue-800 dark:text-blue-300">{selectedPurchase.assignedCode}</span></p>
                      )}
                    </div>
                  </div>

                  {selectedPurchase.address && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Shipping Address</h3>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                        <p><strong>Name:</strong> {selectedPurchase.address.name}</p>
                        <p><strong>Address:</strong> {selectedPurchase.address.addressLine}</p>
                        <p><strong>City:</strong> {selectedPurchase.address.city}</p>
                        <p><strong>State:</strong> {selectedPurchase.address.state}</p>
                        <p><strong>Pincode:</strong> {selectedPurchase.address.pincode}</p>
                        <p><strong>Phone:</strong> {selectedPurchase.address.phone}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Items</h3>
                    <div className="space-y-2">
                      {selectedPurchase.items.map((item, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.quantity > 1 && <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>}
                          </div>
                          <p className="font-bold text-green-600">₹{item.price}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Total Amount:</span>
                        <span className="text-2xl font-bold text-green-600">₹{selectedPurchase.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
