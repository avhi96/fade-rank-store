import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center text-gray-800 dark:text-white bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-4">🎉 Thank You for Your Order!</h1>
      <p className="text-lg mb-6">Your payment was successful. We’ve received your order.</p>
      <div className="flex gap-4">
        <Link
          to="/orders"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
        >
          View My Orders
        </Link>
        <Link
          to="/shop"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
