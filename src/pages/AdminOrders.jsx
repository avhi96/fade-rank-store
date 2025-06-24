import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    orderBy,
    query
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const { user, isAdmin, loading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);


    useEffect(() => {
        if (!user || !isAdmin) return;

        const fetchOrders = async () => {
            try {
                const q = query(collection(db, 'orders'));
                const snap = await getDocs(q);
                const orderList = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                toast.success("📦 Orders fetched:", orderList);
                setOrders(orderList);
            } catch (err) {
                toast.error("Error fetching orders:", err);
            } finally {
                setOrdersLoading(false);
            }
            console.log("👤 Current User:", user?.email);
            console.log("🛡️ Is Admin:", isAdmin);

        };

        fetchOrders();
    }, [user, isAdmin]);


    const handleCancelOrder = async (orderId) => {
        try {
            await deleteDoc(doc(db, 'orders', orderId));
            setOrders(prev => prev.filter(order => order.id !== orderId));
            toast.success("❌ Order cancelled");
        } catch (err) {
            console.error("Error cancelling order:", err);
            toast.error("Failed to cancel order");
        }
    };

    const handleCompleteOrder = async (orderId) => {
        try {
            await updateDoc(doc(db, 'orders', orderId), { status: 'completed' });
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? { ...order, status: 'completed' } : order
                )
            );
            toast.success(" Order marked as completed");
        } catch (err) {
            console.error("Error completing order:", err);
            toast.error("Failed to update status");
        }
    };

    if (loading) {
        return <p className="text-center mt-10 text-gray-500">Checking access...</p>;
    }

    if (!user || !isAdmin) {
        return (
            <p className="text-center mt-10 text-red-500 font-semibold">
                Access Denied: Admins only.
            </p>
        );
    }



    if (ordersLoading) return (
        <p className="text-center mt-10 text-gray-500">Loading orders...</p>
    );


    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white text-center">
                🛠 Admin Orders Panel
            </h1>

            {orders.length === 0 ? (
                <p className="text-center text-gray-500">No orders found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
                    {orders.map(order => (
                        <div
                            key={order.id}
                            className="p-4 bg-white dark:bg-gray-800 border rounded-lg shadow transition hover:shadow-lg flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                    {order.serviceTitle}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-300">
                                    💰 Price: ₹{order.price}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-300">
                                    🕒 {order.createdAt?.toDate().toLocaleString() || 'N/A'}
                                </p>
                                <div className="my-2">
                                    <p className="text-sm text-gray-700 dark:text-gray-200">
                                        👤 <span className="font-medium">{order.name || 'N/A'}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        📧 {order.email}
                                    </p>
                                </div>
                                <p className={`text-sm font-medium mt-1 ${order.status === 'completed'
                                    ? 'text-green-500'
                                    : 'text-yellow-500'
                                    }`}>
                                    Status: {order.status || 'pending'}
                                </p>
                            </div>

                            <div className="mt-4 flex flex-col gap-2">
                                {order.status !== 'completed' && (
                                    <button
                                        onClick={() => handleCompleteOrder(order.id)}
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                                    >
                                        ✅ Mark Completed
                                    </button>
                                )}
                                <button
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                                >
                                    ❌ Cancel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
