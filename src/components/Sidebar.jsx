import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../context/AuthContext';
import {
  FaHome, FaShoppingCart, FaBoxOpen, FaTags,
  FaPhone, FaFileContract, FaUserCircle, FaTools,
  FaBars, FaTimes
} from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", icon: <FaHome />, to: "/" },
    { name: "Shop", icon: <FaShoppingCart />, to: "/shop" },
    { name: "Products", icon: <FaBoxOpen />, to: "/products" },
    { name: "Services", icon: <FaTags />, to: "/services" },
    { name: "Contact", icon: <FaPhone />, to: "/contact" },
    { name: "Terms", icon: <FaFileContract />, to: "/terms" },
  ];

  return (
    <>
      {/* Hamburger Button (Mobile only) */}
      <div className="md:hidden fixed top-4 left-4 z-[9999]">
        <button
          onClick={() => setOpen(true)}
          className="text-white bg-gray-800 p-2 rounded-md"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Overlay when Sidebar open on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full md:h-screen w-60 bg-gray-900 text-white z-50 
  flex flex-col justify-between transform transition-transform duration-300 ease-in-out
  ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >

        {/* Close button (Mobile only) */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setOpen(false)}
            className="text-white bg-gray-800 p-2 rounded-md"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 px-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <img
            className="mb-6 w-20 mx-auto"
            src="/fade-icon.png"
            alt="Fade Logo"
          />

          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            {links.map(link => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-md transition-all duration-200 
                  ${isActive ? 'bg-blue-600 font-semibold' : 'hover:bg-gray-700'}`
                }
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            ))}

            {isAdmin(user) && (
              <NavLink
                to="/admin"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-md transition-all duration-200 
                  ${isActive ? 'bg-blue-700 font-semibold' : 'hover:bg-gray-700 text-blue-400'}`
                }
              >
                <FaTools className="text-lg" />
                <span>Admin Panel</span>
              </NavLink>
            )}
          </div>
        </div>

        {/* Bottom Auth Section */}
        <div className="p-5 border-t border-gray-700">
          {user ? (
            <NavLink
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 p-3 bg-blue-600 rounded justify-center hover:bg-blue-700 transition"
            >
              <FaUserCircle size={20} />
              <span>My Profile</span>
            </NavLink>
          ) : (
            <div className="flex flex-col gap-2">
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className="bg-blue-600 text-white text-center px-3 py-2 rounded hover:bg-blue-700 transition"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setOpen(false)}
                className="bg-green-600 text-white text-center px-3 py-2 rounded hover:bg-green-700 transition"
              >
                Signup
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
