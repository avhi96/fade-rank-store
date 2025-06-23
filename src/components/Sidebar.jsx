import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../context/AuthContext';
import {
  FaHome, FaShoppingCart, FaBoxOpen, FaTags,
  FaPhone, FaFileContract, FaUserCircle, FaTools
} from 'react-icons/fa';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const links = [
    { name: "Home", icon: <FaHome />, to: "/" },
    { name: "Shop", icon: <FaShoppingCart />, to: "/shop" },
    { name: "Products", icon: <FaBoxOpen />, to: "/products" },
    { name: "Pricing", icon: <FaTags />, to: "/pricing" },
    { name: "Contact", icon: <FaPhone />, to: "/contact" },
    { name: "Terms", icon: <FaFileContract />, to: "/terms" },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-60 bg-gray-900 text-white p-5 flex flex-col justify-between z-50">
      <div>
        <h2 className="text-center text-xl font-bold mb-8 tracking-wider"><img src="/client/public/fade-icon.png" alt="Fade" /></h2>
        <div className="flex flex-col gap-3">
          {links.map(link => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-md transition-all ${
                  isActive ? 'bg-blue-600 font-semibold' : 'hover:bg-gray-700'}`
              }
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}

          {/* Admin Panel (Only for Admin) */}
          {isAdmin(user) && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-md transition-all ${
                  isActive ? 'bg-blue-700 font-semibold' : 'hover:bg-gray-700 text-blue-400'}`
              }
            >
              <FaTools className="text-lg" />
              <span>Admin Panel</span>
            </NavLink>
          )}
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4">
        {user ? (
          <div className="text-center">
            <NavLink
              to="/profile"
              className="flex items-center gap-2 p-3 mt-2 bg-blue-600 rounded justify-center hover:bg-blue-700"
            >
              <FaUserCircle size={20} />
              <span>My Profile</span>
            </NavLink>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <NavLink
              to="/login"
              className="bg-blue-600 text-white text-center px-3 py-2 rounded hover:bg-blue-700"
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="bg-green-600 text-white text-center px-3 py-2 rounded hover:bg-green-700"
            >
              Signup
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
