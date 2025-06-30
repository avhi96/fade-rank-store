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

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchAllOrders = async () => {
      try {
        const serviceQuery = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const productQuery = query(
          collection(db, 'productOrders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const [serviceSnap, productSnap] = await Promise.all([
          getDocs(serviceQuery),
          getDocs(productQuery),
        ]);

        const serviceOrders = serviceSnap.docs.map(doc => ({
          id: doc.id,
          type: 'service',
          ...doc.data(),
        }));
        const productOrders = productSnap.docs.map(doc => ({
          id: doc.id,
          type: 'product',
          ...doc.data(),
        }));

        const combined = [...serviceOrders, ...productOrders];
        combined.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());

        setOrders(combined);
      } catch (err) {
        toast.error(`Error loading orders: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [user]);

  const confirmCancelOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCancelConfirmed = async () => {
    const orderId = selectedOrder.id;
    const type = selectedOrder.type;
    const collectionName = type === 'product' ? 'productOrders' : 'orders';

    try {
      await deleteDoc(doc(db, collectionName, orderId));
      setOrders(prev => prev.filter(order => order.id !== orderId));
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel order.');
    } finally {
      setShowModal(false);
      setSelectedOrder(null);
    }
  };

  if (!user) return <p className="text-center text-gray-500 mt-10">Please login to view your orders.</p>;
  if (loading) return <p className="text-center text-gray-500 mt-10">Loading orders...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders placed yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 uppercase text-xs">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Price</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {orders.map(order => (
                <tr key={order.id} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3">
                    {order.image ? (
                      <img src={order.image} alt="thumb" className="w-14 h-14 object-cover rounded-md" />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 dark:bg-gray-600 flex items-center justify-center rounded-md text-gray-400 text-xs">📷</div>
                    )}
                  </td>
                  <td className="p-3 font-medium">{order.serviceTitle || order.productName || 'Unnamed Order'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.type === 'product' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'}`}>
                      {order.type === 'product' ? 'Product' : 'Service'}
                    </span>
                  </td>
                  <td className="p-3">₹{order.price}</td>
                  <td className="p-3">{order.createdAt?.toDate().toLocaleString() || 'N/A'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'completed' ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => confirmCancelOrder(order)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-xs rounded"
                    >
                      Cancel ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Cancel Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Cancel Order</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to cancel this order?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedOrder(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded"
              >
                No, Go Back
              </button>
              <button
                onClick={handleCancelConfirmed}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
