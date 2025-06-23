import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PlaceOrder = ({ productId, productName, price }) => {
  const { user } = useAuth();
  const [showBox, setShowBox] = useState(false);
  const [confirmBox, setConfirmBox] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');

  const handlePlaceOrder = async () => {
    if (!user) return toast.error("Please login first.");

    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        productId,
        productName,
        price,
        sendTo: recipientEmail || user.email,
        createdAt: serverTimestamp()
      });

      toast.success("Order placed successfully!");
      setShowBox(false);
      setConfirmBox(true);
    } catch (err) {
      toast.error("Failed to place order.");
    }
  };

  return (
    <>
      {/* Confirm Place Order button */}
      {!showBox && !confirmBox && (
        <button
          onClick={() => setShowBox(true)}
          className="w-full bg-orange-600 text-white py-2 rounded font-semibold hover:bg-orange-700 mt-4 transition"
        >
          Buy Now
        </button>
      )}

      {/* Email Input Box */}
      {showBox && (
        <div className="mt-4 p-4 border bg-white dark:bg-gray-800 dark:border-gray-600 rounded shadow max-w-md mx-auto transition-colors">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
            Send product to:
          </h3>
          <input
            type="email"
            placeholder="Enter email address"
            className="w-full border px-3 py-2 rounded mb-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
            value={recipientEmail}
            onChange={e => setRecipientEmail(e.target.value)}
          />
          <div className="flex justify-between">
            <button
              onClick={handlePlaceOrder}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Confirm Order
            </button>
            <button
              onClick={() => setShowBox(false)}
              className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Message */}
      {confirmBox && (
        <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 rounded shadow max-w-md mx-auto text-center transition-colors">
          <p className="font-semibold">✅ Your order has been placed!</p>
          <p className="text-sm mt-1">We will contact you soon for delivery.</p>
        </div>
      )}
    </>
  );
};

export default PlaceOrder;
