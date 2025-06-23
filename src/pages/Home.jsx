import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center px-4 text-center">
      {/* Animated Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
        Welcome to{' '}
        <span className="text-blue-600 font-mono">
          <Typewriter
            words={['Fade', 'Ｆａｄｅ', '𝓕𝓪𝓭𝓮', '𝙁𝘼𝘿𝙀', 'Fade']}
            loop={0}
            typeSpeed={200}
            deleteSpeed={130}
            delaySpeed={2000}
          />
        </span>
      </h1>

      {/* Tagline */}
      <p className="text-lg max-w-xl mb-8 text-gray-600 dark:text-gray-300 fade-in">
        Your one-stop digital marketplace for custom bots, online tools, and unique digital products.
      </p>

      {/* CTA */}
      <Link
        to="/shop"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Start Shopping
      </Link>

      {/* Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {[
          { icon: '⚡', title: 'Fast Delivery', desc: 'Instant email delivery for digital goods.' },
          { icon: '🔒', title: 'Secure Payments', desc: 'Powered by Phonepay & protected by Firebase.' },
          { icon: '💬', title: '24/7 Support', desc: 'Need help? We’re always here to assist you.' },
        ].map((feature, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center transition-colors"
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
