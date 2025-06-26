import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'shopProducts'));
        const topProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })).slice(0, 9); // only top 9
        setProducts(topProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          🛍️ Top Products
        </h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No products available.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {products.map(product => (
              <a
                href={product.shopifyLink}
                target="_blank"
                rel="noopener noreferrer"
                key={product.id}
              >
                <div className="bg-white dark:bg-[#0f172a] rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-300 dark:border-gray-700 overflow-hidden group relative">
                  <img
                    src={product.image || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  <div className="p-4 flex flex-col justify-between text-gray-900 dark:text-white">
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-green-600 dark:text-green-400 font-bold mt-2">
                        ₹{product.price}
                      </p>
                    </div>
                    <div className="mt-4 text-center">
                      <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition">
                        View on Shopify
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Show More Button */}
        <div className="text-center mt-10">
          <a
            href="https://fade013.myshopify.com/" // 🔁 Replace with your store URL
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            Show More Products
          </a>
        </div>
      </div>
    </div>
  );
};

export default Shop;
