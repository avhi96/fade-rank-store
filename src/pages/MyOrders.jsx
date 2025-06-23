import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userid', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const snap = await getDocs(q);
        const orderList = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderList);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders(prev => prev.filter(order => order.id !== orderId));
      toast.success("Order cancelled");
    } catch (err) {
      console.error("Error cancelling order:", err);
    }
  };

  if (!user) return (
    <p className="text-center text-gray-500 mt-10">
      Please login to view your orders.
    </p>
  );

  if (loading) return (
    <p className="text-center text-gray-500 mt-10">
      Loading orders...
    </p>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="p-4 border rounded-lg bg-white dark:bg-gray-800 mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {order.serviceTitle}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Price: ₹{order.price}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {order.createdAt?.toDate().toLocaleString() || 'Date not available'}
            </p>

            <div className="mt-4 text-right">
              <button
                onClick={() => handleCancelOrder(order.id)}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-sm"
              >
                Cancel Order
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
