import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../context/AuthContext';
import {
  FaHome, FaBoxOpen, FaPhone, FaUserCircle, FaTools,
  FaBars, FaTimes, FaCube, FaSignInAlt, FaUserPlus, FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const links = [
    { name: "Home", icon: <FaHome />, to: "/" },
    { name: "Products", icon: <FaBoxOpen />, to: "/products" },
    { name: "Contact", icon: <FaPhone />, to: "/contact" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-[9999]">
        <button
          onClick={() => setOpen(true)}
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 transition-all duration-200"
        >
          <FaBars size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white/30 dark:bg-gray-800/30 backdrop-blur-md z-50 md:hidden
        transform transition-transform duration-300 ease-in-out border-r border-white/30 dark:border-gray-700/30
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-sm shadow-sm flex items-center justify-center">
                <FaCube className="text-white text-sm" />
              </div>
              <span className="font-bold text-gray-800 dark:text-white text-lg">FADE</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FaTimes size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          <div className="space-y-4">
            {links.map(link => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`
                }
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            ))}

            {user ? (
              <NavLink
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200"
              >
                <FaUserCircle className="text-xl" />
                <span>Profile</span>
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200"
              >
                <FaSignInAlt className="text-xl" />
                <span>Login</span>
              </NavLink>
            )}

            {isAdmin(user) && (
              <NavLink
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all duration-200"
              >
                <FaTools className="text-xl" />
                <span>Admin</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Left Center Navigation */}
      <div className="hidden md:block fixed left-6 top-1/2 transform -translate-y-1/2 z-50">
        <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30 dark:border-gray-700/30">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-sm shadow-sm flex items-center justify-center">
                <FaCube className="text-white" />
              </div>
              <span className="font-bold text-gray-800 dark:text-white text-lg">FADE</span>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              {links.map(link => (
                <NavLink
                  key={link.name}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 group min-w-[80px] ${
                      isActive 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold scale-105' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:scale-105'
                    }`
                  }
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
                  <span className="text-xs font-medium text-center">{link.name}</span>
                </NavLink>
              ))}

              {user ? (
                <NavLink
                  to="/profile"
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 hover:scale-105 transition-all duration-200 group min-w-[80px] mt-2"
                >
                  <FaUserCircle className="text-lg group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-center">Profile</span>
                </NavLink>
              ) : (
                <NavLink
                  to="/login"
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 hover:scale-105 transition-all duration-200 group min-w-[80px] mt-2"
                >
                  <FaSignInAlt className="text-lg group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-center">Login</span>
                </NavLink>
              )}

              {isAdmin(user) && (
                <NavLink
                  to="/admin"
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 hover:scale-105 transition-all duration-200 group min-w-[80px]"
                >
                  <FaTools className="text-lg group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-center">Admin</span>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
