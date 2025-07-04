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
import InvoiceButton from '../admin/InvoiceButton';
import OrderStatusTracker from '../admin/OrderStatusTracker';
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

        // Merge all arrays
        const allOrders = [...userOrders, ...productOrders, ...rootOrders];

        console.log('Fetched Orders from both sources:', allOrders);

        setOrders(allOrders);
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
      // Delete from root-level 'orders' collection as well as user subcollection
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
                  {(order.type === 'item' || order.type === 'shop') && order.image ? (
                    <img src={order.image} alt={order.productName || 'Order Image'} className="w-14 h-14 object-cover rounded-md" />
                  ) : (order.type === 'product' && order.items && order.items[0]?.images?.length > 0) ? (
                    <img src={order.items[0].images[0]} alt={order.items[0].name || 'Product Image'} className="w-14 h-14 object-cover rounded-md" />
                  ) : (
                    <div className="w-14 h-14 bg-gray-200 dark:bg-gray-600 flex items-center justify-center rounded-md text-gray-400 text-xs">📷</div>
                  )}
                  </td>
                  <td className="p-3 font-medium">{order.productName || order.items?.[0]?.name || 'Unnamed Order'}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {order.type === 'product' ? 'Product' : 'Item'}
                    </span>
                  </td>
                  <td className="p-3">₹{Number(order.price || 0).toFixed(2)}</td>
                  <td className="p-3">
                    {order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleString() : 'N/A'}
                  </td>
                  <td className="p-3">
                    <OrderStatusTracker status={order.status || 'Pending'} />
                  </td>
                  {/* <td className="p-3">
                    <ETABar createdAt={order.createdAt} deliveryDays={5} />
                  </td> */}
                  <td className="p-3">
                    <InvoiceButton order={order} />
                    <div
                      id={`invoice-${order.id}`}
                      style={{
                        position: 'absolute',
                        left: '-9999px',
                        top: '0',
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '1rem',
                        width: '300px',
                        zIndex: '-1',
                      }}
                    >
                      <h1 className="text-xl font-bold mb-2">FADE INVOICE</h1>
                      <p><strong>Invoice ID:</strong> #{order.id}</p>
                      <p><strong>Order Date:</strong> {order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleString() : 'N/A'}</p>
                      <p><strong>Customer:</strong> {user?.displayName || 'User'} ({user?.email})</p>
                      <hr className="my-2" />
                      <p><strong>Product:</strong> {order.productName}</p>
                      <p><strong>Price:</strong> ₹{Number(order.price || 0).toFixed(2)}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                      <p><strong>Order Type:</strong> {order.type}</p>
                      {/* Optional fields */}
                      <p><strong>Payment Method:</strong> UPI / Razorpay</p> 
                      <p><strong>Delivery Address:</strong> {order.address ? (
                        <>
                          {order.address.addressLine}, {order.address.landmark && `${order.address.landmark}, `}
                          {order.address.city}, {order.address.state} - {order.address.pincode}
                        </>
                      ) : 'N/A'}</p>
                      <hr className="my-2" />
                      <h2 className="font-semibold">Total: ₹{Number(order.price || 0).toFixed(2)}</h2>
                      <p className="text-xs text-gray-500 mt-4">Thank you for your purchase!</p>
                    </div>

                  </td>
                  <td className="p-3">
                  {order.status === 'completed' ? (
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
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-xs rounded"
                    >
                      Delete 🗑️
                    </button>
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
