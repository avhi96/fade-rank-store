import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-white">
          🛍️ Digital Products
        </h1>

        {products.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">No Products Available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map(product => (
              <Link to={`/products/${product.id}`} key={product.id}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group">
                  <div className="relative">
                    <img
                      src={product.image || '/placeholder.jpg'}
                      alt={product.name}
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                      Digital
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-blue-600 font-bold text-right text-lg">₹{product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
