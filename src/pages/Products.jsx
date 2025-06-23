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
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-10">
          🛍️ Digital Products
        </h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-400">No Products Available</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {products.map(product => (
              <Link to={`/products/${product.id}`} key={product.id}>
                <div className="bg-[#0f172a] rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-700 overflow-hidden flex flex-col group relative">
                  {/* Optional Glow */}
                  <div className="absolute -inset-1 bg-blue-600 blur-lg opacity-0 group-hover:opacity-10 transition-all rounded-xl z-0" />

                  <img
                    src={product.image || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 z-10"
                  />

                  <div className="p-4 text-white flex flex-col flex-1 justify-between z-10 relative">
                    <div>
                      <h2 className="text-lg font-semibold leading-tight">{product.name}</h2>
                      <p className="text-blue-400 font-bold mt-3 text-base">
                        ₹{product.price}
                      </p>
                    </div>

                    <a
                      href="#"
                      className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm text-center py-2 rounded-md"
                    >
                      Purchase Now
                    </a>
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
