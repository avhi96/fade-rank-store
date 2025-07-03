import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userSnap = await getDocs(collection(db, 'users'));
      const allOrders = [];

      for (const userDoc of userSnap.docs) {
        const userId = userDoc.id;
        const userData = userDoc.data();
        const orderSnap = await getDocs(collection(db, 'users', userId, 'orders'));

        orderSnap.forEach(orderDoc => {
          allOrders.push({
            ...orderDoc.data(),
            id: orderDoc.id,
            userId,
            username: userData.username || 'Unknown',
            email: userData.email || 'Unknown',
          });
        });
      }

      setOrders(allOrders);
    } catch (err) {
      toast.error('Failed to fetch orders');
    }
  };

  const handleComplete = async (order) => {
    try {
      await updateDoc(doc(db, 'users', order.userId, 'orders', order.id), {
        status: 'completed'
      });
      toast.success('Order marked as completed');
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      toast.error('Failed to update order');
    }
  };

  const handleDelete = async (order) => {
    try {
      await deleteDoc(doc(db, 'users', order.userId, 'orders', order.id));
      toast.success('Order deleted');
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      toast.error('Failed to delete order');
    }
  };

  const getFinalPrice = (price, discount) =>
    discount > 0 ? price - (price * discount) / 100 : price;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">📦 All User Orders</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="cursor-pointer border rounded shadow-sm bg-white dark:bg-gray-800 p-4 hover:shadow-md"
          >
            <p className="font-medium mb-1">User: {order.username}</p>
            <p className="text-sm text-gray-500">Email: {order.email}</p>
            <p className="text-sm mt-2">Items: {order.items.length}</p>
            <p className="text-sm">Total: ₹{order.amount}</p>
            <p className="text-sm">Status: <span className="font-semibold">{order.status || 'Pending'}</span></p>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-lg p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-2 text-red-600 text-xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4">Order Details</h2>

            <div className="mb-3">
              <p><strong>Username:</strong> {selectedOrder.username}</p>
              <p><strong>Email:</strong> {selectedOrder.email}</p>
              <p><strong>Payment ID:</strong> {selectedOrder.razorpay_payment_id || 'N/A'}</p>
              <p><strong>Status:</strong> {selectedOrder.status || 'Pending'}</p>
            </div>

            <div className="mb-3">
              <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
              <p>{selectedOrder.address?.name} — {selectedOrder.address?.phone}</p>
              <p>{selectedOrder.address?.addressLine}</p>
              {selectedOrder.address?.landmark && <p>{selectedOrder.address.landmark}</p>}
              <p>{selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Items Ordered</h3>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="mb-2 border-b pb-2">
                  <p className="font-medium">{item.name}</p>
                  {item.discount > 0 ? (
                    <p className="text-sm text-gray-600">
                      ₹{item.price} → ₹{getFinalPrice(item.price, item.discount).toFixed(0)} ({item.discount}% OFF)
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">₹{item.price}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 font-bold text-green-600">Total: ₹{selectedOrder.amount}</div>

            <div className="mt-6 flex flex-col gap-4">
              <label htmlFor="status" className="font-semibold mb-1">Update Order Status:</label>
              <select
                id="status"
                value={selectedOrder.status || 'pending'}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  try {
                    await updateDoc(doc(db, 'users', selectedOrder.userId, 'orders', selectedOrder.id), {
                      status: newStatus,
                    });
                    toast.success('Order status updated');
                    setSelectedOrder(prev => ({ ...prev, status: newStatus }));
                    fetchOrders();
                  } catch (err) {
                    toast.error('Failed to update order status');
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={() => handleDelete(selectedOrder)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
