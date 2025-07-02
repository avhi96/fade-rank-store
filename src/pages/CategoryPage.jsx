import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/cartContext';

const categoryNames = {
  accessories: 'Anime Accessories',
  'wall-decor': 'Wall Decor',
  'tech-gear': 'Desk & Tech Gear',
  figurines: 'Anime Figurines',
  stickers: 'Stickers & Decals',
  cosplay: 'Costumes & Wearables',
};

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  const categoryTitle = categoryNames[slug] || 'Category';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'shopProducts'));
        const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const filtered = all.filter(
          item => item.category === slug || item.category === categoryTitle
        );
        setProducts(filtered);
      } catch (err) {
        console.error('Failed to fetch category products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  const isInCart = (productId) => cart.some(item => item.id === productId);

  const handleAddToCart = (product) => {
    if (isInCart(product.id)) {
      navigate('/cart');
    } else {
      addToCart(product);
    }
  };

  const totalPrice = cart.reduce((total, item) => {
    const price = item.discount > 0
      ? item.price - item.price * (item.discount / 100)
      : item.price;
    return total + price * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen py-12 px-4 bg-white dark:bg-gray-900 relative">

      {/* Floating Cart Button */}
      <div
        onClick={() => navigate('/cart')}
        className="fixed top-5 right-5 z-50 bg-blue-600 text-white px-5 py-2 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-semibold flex items-center gap-2"
      >
        <FaShoppingCart className="text-white text-base" />
        ₹{totalPrice.toFixed(0)}
      </div>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
          {categoryTitle}
        </h1>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No products found.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {products.map(product => {
              const imageUrl =
                (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) ||
                product.image || '/placeholder.jpg';

              const hasDiscount = product.discount > 0;
              const discountedPrice = hasDiscount
                ? product.price - product.price * (product.discount / 100)
                : product.price;

              const inCart = isInCart(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-[#0f172a] rounded-xl shadow-md hover:shadow-lg transition border border-gray-300 dark:border-gray-700 overflow-hidden group relative"
                >
                  {hasDiscount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      {product.discount}% OFF
                    </div>
                  )}

                  <Link to={`/item/${product.id}`}>
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-52 object-contain bg-white dark:bg-gray-800 p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

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

                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`mt-4 w-full ${
                        inCart ? 'bg-gray-700 hover:bg-gray-800' : 'bg-blue-600 hover:bg-blue-700'
                      } text-white text-sm py-2 rounded-md transition`}
                    >
                      {inCart ? 'Go to Cart' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/shop"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
          >
            ← Back to Categories
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
