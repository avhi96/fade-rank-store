import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FaHeart,
  FaShoppingCart,
  FaBoxOpen,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useDarkMode } from '../context/DarkModeContext';

const Profile = () => {
  const { user, logout } = useAuth(); // ✅ use inside the component only
  const { darkMode, setDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const options = [
    {
      icon: <FaHeart className="text-pink-500" />,
      label: 'Liked Items',
      action: () => navigate('/liked'),
    },
    {
      icon: <FaShoppingCart className="text-blue-500" />,
      label: 'My Cart',
      action: () => navigate('/cart'),
    },
    {
      icon: <FaBoxOpen className="text-green-600" />,
      label: 'My Orders',
      action: () => navigate('/orders'),
    },
  ];

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-300">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Account Overview</h1>

      {/* User Info Card */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-center sm:text-left">
        {/* Centered Avatar */}
        <div className="flex justify-center sm:justify-start w-full sm:w-auto">
          <img
            src={user.photoURL || '/default-avatar.png'}
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-600"
          />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <p className="text-lg font-semibold">
            {user.displayName || user.username || user.email}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
        </div>

        {/* Edit Button */}
        <div className="mt-4 sm:mt-0 sm:ml-auto">
          <button
            onClick={() => navigate('/edit-profile')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
          >
            Edit Profile
          </button>
        </div>
      </div>


      {/* Profile Options */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt, i) => (
          <div
            key={i}
            onClick={opt.action}
            className="bg-white dark:bg-gray-700 border dark:border-gray-600 hover:shadow-lg transition cursor-pointer rounded-xl p-4 flex items-center gap-4"
          >
            <div className="text-xl">{opt.icon}</div>
            <p className="font-medium">{opt.label}</p>
          </div>
        ))}

        {/* 🌗 Theme Toggle */}
        <div className="bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-xl p-4 flex items-center justify-between">
          <span className="font-medium">
            {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </span>
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className={`w-14 h-7 flex items-center rounded-full p-1 transition duration-300 ${darkMode ? 'bg-gray-800' : 'bg-gray-300'
              }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 ${darkMode ? 'translate-x-7' : 'translate-x-0'
                }`}
            />
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-12 text-right">
        <button
          onClick={logout}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition text-sm flex items-center gap-2"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
