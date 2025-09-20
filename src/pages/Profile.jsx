import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FaBoxOpen,
  FaSignOutAlt,
  FaUser,
  FaCog,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const options = [
    {
      icon: <FaBoxOpen className="text-2xl" />,
      label: 'My Orders',
      description: 'View and track your purchases',
      action: () => navigate('/orders'),
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="professional-card p-12 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <FaUser className="text-3xl text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Access Required</h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Please log in to view your profile and manage your account settings.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary hover-lift flex items-center gap-3 mx-auto"
          >
            <FaUser />
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col py-12 px-4">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Professional Header */}
        <div className="text-center mb-16 animate-fade-in-down">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-500/30 text-emerald-400 px-8 py-4 rounded-full font-semibold mb-8 backdrop-blur-sm shadow-lg">
            <FaShieldAlt className="text-xl" />
            <span className="text-lg">Account Dashboard</span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl font-black leading-tight mb-6">
            <span className="text-gradient bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Manage your Minecraft ranks, orders, and account preferences with our professional dashboard
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-emerald-500" />
              <span>Secure Account</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-emerald-500" />
              <span>Premium Support</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-emerald-500" />
              <span>24/7 Access</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* User Profile Card */}
          <div className="lg:col-span-2">
            <div className="professional-card p-10 mb-8 animate-fade-in-up">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                
                {/* Avatar Section */}
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="User Avatar"
                          className="w-full h-full rounded-2xl object-cover"
                        />
                      ) : (
                        <FaUser className="text-4xl text-white" />
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl p-3 shadow-lg">
                      <FaShieldAlt className="text-white text-xl" />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate('/edit-profile')}
                    className="btn-secondary hover-lift flex items-center gap-3"
                  >
                    <FaCog />
                    Edit Profile
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-4xl font-bold text-white mb-3">
                    {user.displayName || user.username || 'Minecraft Player'}
                  </h2>
                  
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Member since 2024</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Account Status</h3>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <FaCheckCircle />
                      <span className="font-medium">Verified & Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaBoxOpen className="text-emerald-500" />
                Quick Actions
              </h3>
              
              <div className="grid gap-6">
                {options.map((option, index) => (
                  <div
                    key={index}
                    onClick={option.action}
                    className="professional-card hover-lift p-8 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <div className="text-white">
                            {option.icon}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2">{option.label}</h4>
                          <p className="text-gray-400">{option.description}</p>
                        </div>
                      </div>
                      <FaArrowRight className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Account Security Sidebar */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="professional-card p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaShieldAlt className="text-red-500" />
                Account Security
              </h3>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6">
                  <h4 className="font-semibold text-white mb-3">Security Status</h4>
                  <div className="flex items-center gap-2 text-emerald-400 mb-4">
                    <FaCheckCircle />
                    <span className="text-sm">Account Protected</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    Keep your account secure by logging out when you're done using the dashboard.
                  </p>
                  
                  <button
                    onClick={logout}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <FaSignOutAlt />
                    Sign Out Securely
                  </button>
                </div>
              </div>
            </div>

            {/* Support Links */}
            <div className="professional-card p-8">
              <h4 className="text-xl font-bold text-white mb-6">Need Assistance?</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/contact')} 
                  className="w-full text-left text-gray-400 hover:text-emerald-400 font-medium transition-colors duration-200 p-3 rounded-lg hover:bg-white/5"
                >
                  Contact Support
                </button>
                <button 
                  onClick={() => navigate('/terms-policy')}
                  className="w-full text-left text-gray-400 hover:text-emerald-400 font-medium transition-colors duration-200 p-3 rounded-lg hover:bg-white/5"
                >
                  Terms of Service
                </button>
                <button 
                  onClick={() => navigate('/privacy-policy')} 
                  className="w-full text-left text-gray-400 hover:text-emerald-400 font-medium transition-colors duration-200 p-3 rounded-lg hover:bg-white/5"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={() => navigate('/refund-policy')} 
                  className="w-full text-left text-gray-400 hover:text-emerald-400 font-medium transition-colors duration-200 p-3 rounded-lg hover:bg-white/5"
                >
                  Refund Policy
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
