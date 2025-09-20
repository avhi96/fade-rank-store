import React from 'react';
import { Link } from 'react-router-dom';
import { FaCube, FaUsers, FaGem, FaCrown, FaDiamond, FaStar } from 'react-icons/fa6';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Professional Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Professional Minecraft Badge */}
          <div className="animate-fade-in-down mb-8">
            <div className="inline-flex items-center gap-3 professional-card px-8 py-4 mb-8">
              <FaCube className="text-emerald-400 text-xl" />
              <span className="text-lg font-bold text-white tracking-wide">Fade Store</span>
            </div>
          </div>

          {/* Professional Hero Title */}
          <div className="animate-fade-in-up mb-12">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-tight mb-8">
              <span className="text-gradient bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                Level Up Your Minecraft
              </span>
              <br />
              <span className="text-gradient bg-gradient-to-r from-pink-400 via-pink-300 to-pink-500 bg-clip-text text-transparent text-glow-green">
                with FADE
              </span>
            </h1>
          </div>

          {/* Professional Description */}
          <div className="animate-fade-in-up mb-16" style={{ animationDelay: '0.2s' }}>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-200 mb-6 max-w-4xl mx-auto leading-relaxed">
              Premium Minecraft Ranks & Exclusive Server Access
            </p>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Unlock VIP features, custom permissions, and exclusive perks in top Minecraft servers
            </p>
          </div>

          {/* Professional Action Buttons */}
          <div className="animate-fade-in-up flex gap-6 flex-wrap justify-center" style={{ animationDelay: '0.4s' }}>
            <Link
              to="/products"
              className="btn-primary hover-lift hover-glow flex items-center gap-3 text-lg px-8 py-4"
            >
              <FaGem className="text-xl" />
              Browse Minecraft Ranks
            </Link>
            <Link
              to="/contact"
              className="btn-secondary hover-lift hover-glow flex items-center gap-3 text-lg px-8 py-4"
            >
              <FaUsers className="text-xl" />
              Join Server
            </Link>
          </div>

        </div>
      </div>

      {/* Professional Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="professional-card hover-lift text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FaCrown className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Premium Ranks</h3>
              <p className="text-gray-300 leading-relaxed">
                Access exclusive ranks with special permissions and unique features
              </p>
            </div>

            <div className="professional-card hover-lift text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FaDiamond className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">VIP Access</h3>
              <p className="text-gray-300 leading-relaxed">
                Join exclusive servers with premium features and priority support
              </p>
            </div>

            <div className="professional-card hover-lift text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <FaStar className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Custom Perks</h3>
              <p className="text-gray-300 leading-relaxed">
                Unlock special abilities, items, and exclusive gameplay features
              </p>
            </div>
          </div>

          {/* Professional CTA */}
          <div className="text-center">
            <div className="professional-card p-12 max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold text-gradient bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-6">
                Ready to Level Up?
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Discover premium Minecraft ranks and unlock exclusive features designed for serious players
              </p>
              <div className="flex justify-center">
                <Link
                  to="/products"
                  className="btn-primary hover-lift hover-glow flex items-center gap-3 text-xl px-10 py-5"
                >
                  <FaGem className="text-2xl" />
                  View All Ranks
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
