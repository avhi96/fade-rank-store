import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col justify-between px-4">

      {/* Hero Section - ONLY this is centered */}
      <div className="flex-1 flex items-center justify-center text-center py-20 sm:py-32 md:py-40 lg:py-52 px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-mono">
              Fade
            </span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto mb-10 text-gray-600 dark:text-gray-300">
            Your one-stop digital marketplace for custom bots, online tools, and unique digital products.
          </p>

          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              to="/shop"
              className="px-6 py-2 text-white bg-blue-600 border border-blue-600 rounded hover:bg-transparent hover:text-blue-600 transition-all"
            >
              Start Shopping
            </Link>
            <Link
              to="/contact"
              className="px-6 py-2 text-white bg-purple-600 border border-purple-600 rounded hover:bg-transparent hover:text-purple-600 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="pb-20">
        {/* 🔷 Feature Strip */}
        <div className="border border-purple-600 py-8 px-6 rounded-xl max-w-6xl mx-auto shadow-lg bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 transition mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: '⚡', title: 'Fast Delivery', desc: 'Get your product within 7 days.' },
              { icon: '🛠️', title: 'Fully Customizable', desc: 'All projects tailored exactly to your needs.' },
              { icon: '💬', title: '24/7 Support', desc: 'We’re always here to help you.' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition hover:scale-105 border border-transparent hover:border-blue-500 dark:hover:border-purple-500"
              >
                <div className="text-4xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 🔄 How It Works */}
        <div className="max-w-5xl mx-auto mb-10 px-2">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { step: '1️⃣', title: 'Choose a Service', desc: 'Pick from Shop or Products tailored to your needs.' },
              { step: '2️⃣', title: 'Place Order', desc: 'Quick checkout and instant confirmation.' },
              { step: '3️⃣', title: 'Delivery & Support', desc: 'Your product is delivered fast with full support.' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition hover:scale-[1.03] border border-transparent hover:border-blue-500 dark:hover:border-purple-500"
              >
                <div className="text-4xl mb-2">{item.step}</div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
