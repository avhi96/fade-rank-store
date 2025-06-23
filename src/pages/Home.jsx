import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col px-4 text-center">

      {/* Centered Main Content */}
      <div className="flex-grow flex flex-col mt-28 items-center justify-center">
        {/* Animated Title */}
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-mono">
            Fade
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl max-w-2xl mb-10 text-gray-600 dark:text-gray-300">
          Your one-stop digital marketplace for custom bots, online tools, and unique digital products.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            to="/shop"
            className="px-6 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
          >
            Start Shopping
          </Link>
          <Link
            to="/contact"
            className="px-6 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-600 hover:text-white transition"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto mb-24">
        {[
          { icon: '⚡', title: 'Fast Delivery', desc: 'Instant email delivery for digital goods.' },
          { icon: '🔒', title: 'Secure Payments', desc: 'Powered by Phonepay & protected by Firebase.' },
          { icon: '💬', title: '24/7 Support', desc: 'Need help? We’re always here to assist you.' },
        ].map((feature, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center transition-all hover:scale-105 hover:shadow-lg border border-transparent hover:border-blue-500 dark:hover:border-purple-500"
          >
            <span className="text-4xl mb-3">{feature.icon}</span>
            <h3 className="font-bold text-xl text-gray-800 dark:text-white">{feature.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
