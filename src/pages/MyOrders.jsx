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
import InvoiceButton from '../components/orders/InvoiceButton';
import OrderStatusTracker from '../components/orders/OrderStatusTracker';
// import ETABar from '../components/orders/ETABar';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'productOrders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'product', // assuming all are product orders
        }));

        setOrders(fetchedOrders);
      } catch (err) {
        toast.error(`Error loading orders: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const confirmCancelOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCancelConfirmed = async () => {
    const orderId = selectedOrder.id;

    try {
      await deleteDoc(doc(db, 'productOrders', orderId));
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
                {/* <th className="p-3">ETA</th> */}
                <th className="p-3">Invoice</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {orders.map(order => (
                <tr key={order.id} className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3">
                    {order.image ? (
                      <img src={order.image} alt={order.productName || 'Order Image'} className="w-14 h-14 object-cover rounded-md" />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 dark:bg-gray-600 flex items-center justify-center rounded-md text-gray-400 text-xs">📷</div>
                    )}
                  </td>
                  <td className="p-3 font-medium">{order.productName || 'Unnamed Order'}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      Product
                    </span>
                  </td>
                  <td className="p-3">₹{Number(order.price || 0).toFixed(2)}</td>
                  <td className="p-3">
                    {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'N/A'}
                  </td>
                  <td className="p-3">
                    <OrderStatusTracker status={order.status || 'Pending'} />
                  </td>
                  {/* <td className="p-3">
                    <ETABar createdAt={order.createdAt} deliveryDays={5} />
                  </td> */}
                  <td className="p-3">
                    <InvoiceButton order={order} />
                    <div id={`invoice-${order.id}`} className="hidden">
                      <h1>Invoice for {order.productName}</h1>
                      <p>Price: ₹{order.price}</p>
                      <p>Status: {order.status}</p>
                      <p>Date: {order.createdAt?.toDate().toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    {order.status === 'completed' ? (
                      <span className="text-green-600 font-semibold text-sm">Order Completed ✅</span>
                    ) : (
                      <button
                        onClick={() => confirmCancelOrder(order)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-xs rounded"
                      >
                        Cancel ❌
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
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
