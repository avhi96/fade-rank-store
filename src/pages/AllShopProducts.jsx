import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const AllShopProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'shopProducts'));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
      } catch (err) {
        console.error('Error fetching shop products:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          🛒 All Store Products
        </h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map(product => {
              const imageUrl =
                (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) ||
                product.image ||
                '/placeholder.jpg';

              const hasDiscount = product.discount > 0;
              const discountedPrice = hasDiscount
                ? product.price - product.price * (product.discount / 100)
                : product.price;

              return (
                <Link to={`/item/${product.id}`} key={product.id}>
                  <div className="bg-white dark:bg-[#0f172a] rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-300 dark:border-gray-700 overflow-hidden group relative">
                    {hasDiscount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        {product.discount}% OFF
                      </div>
                    )}
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-52 object-contain bg-white dark:bg-gray-800 p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="p-4 text-gray-900 dark:text-white">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      {hasDiscount ? (
                        <div className="mt-1">
                          <p className="text-sm text-gray-500 line-through">₹{product.price}</p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            ₹{discountedPrice.toFixed(0)}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-1 text-lg font-bold text-green-600 dark:text-green-400">
                          ₹{product.price}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllShopProducts;
