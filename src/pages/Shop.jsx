import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const categories = [
  {
    name: 'Anime Accessories',
    slug: 'accessories',
    image: '/images/keychain.jpg',
  },
  {
    name: 'Wall Decor',
    slug: 'wall-decor',
    image: '/images/wallpaper.jpg',
  },
  {
    name: 'Desk & Tech Gear',
    slug: 'tech-gear',
    image: '/images/mousepad.jpg',
  },
  {
    name: 'Anime Figurines',
    slug: 'figurines',
    image: '/images/feagure.jpg',
  },
  {
    name: 'Stickers & Decals',
    slug: 'stickers',
    image: '/images/stickers.jpg',
  },
  {
    name: 'Costumes & Wearables',
    slug: 'cosplay',
    image: '/images/cosplay.jpg',
  },
];

const Shop = () => {
  const [cart, setCart] = useState([]); // Temporary local cart state
  const navigate = useNavigate();

  // Calculate total cart price
  const totalPrice = cart.reduce((total, item) => {
    const hasDiscount = item.discount > 0;
    const price = hasDiscount
      ? item.price - item.price * (item.discount / 100)
      : item.price;
    return total + price * item.quantity;
  }, 0);

  return (
    <div className="relative min-h-screen py-12 px-4 bg-white dark:bg-gray-900">

      {/* 🛒 Floating Cart Button */}
      <div
        onClick={() => navigate('/cart')}
        className="fixed top-6 right-6 z-50 bg-blue-600 dark:bg-blue-600 text-white px-5 py-2 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-semibold flex items-center gap-2"
      >
        <FaShoppingCart className="text-white text-base" />
        ₹{totalPrice.toFixed(0)}
      </div>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Categories
        </h1>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {categories.map(cat => (
            <Link to={`/shop/${cat.slug}`} key={cat.slug}>
              <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow hover:shadow-2xl transition-transform transform hover:-translate-y-1 hover:border-indigo-500 dark:hover:border-indigo-400 overflow-hidden group duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4 text-center text-gray-900 dark:text-white">
                  <h2 className="text-xl font-semibold">{cat.name}</h2>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Show More Button */}
        <div className="text-center mt-12">
          <Link
            to="/shop/all"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Shop;
