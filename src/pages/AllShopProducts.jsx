import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/cartContext'; // ✅ Import cart context

const AllShopProducts = () => {
  const [products, setProducts] = useState([]);
  const { cart, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((total, item) => {
    const hasDiscount = item.discount > 0;
    const price = hasDiscount
      ? item.price - item.price * (item.discount / 100)
      : item.price;
    return total + price * item.quantity;
  }, 0);

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

  const isInCart = (productId) => cart.some(item => item.id === productId);
  removeFromCart(item.id);


  return (
    <div className="min-h-screen py-12 px-4 bg-white dark:bg-gray-900 relative">

      {/* 🛒 Floating Cart Button */}
      <div
        onClick={() => navigate('/cart')}
        className="fixed top-5 right-10 z-50 bg-blue-600 dark:bg-blue-500 text-white px-5 py-2 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-semibold flex items-center gap-2"
      >
        <FaShoppingCart className="text-white text-base" />
        {cart.length > 0 ? `₹${totalPrice.toFixed(0)}` : 'Cart Empty'}
      </div>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          All Store Products
        </h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No products available.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map(product => {
              const imageUrl =
                (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) ||
                product.image ||
                '/placeholder.jpg';

              const hasDiscount = product.discount > 0;
              const discountedPrice = hasDiscount
                ? product.price - product.price * (product.discount / 100)
                : product.price;

              const inCart = isInCart(product.id);

              return (
                <div key={product.id} className="group relative bg-white dark:bg-[#0f172a] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
                      {product.discount}% OFF
                    </div>
                  )}

                  {/* Image */}
                  <Link to={`/item/${product.id}`}>
                    <div className="w-full h-44 bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-4 text-gray-900 dark:text-white">
                    <h3 className="text-base font-semibold truncate mb-1">{product.name}</h3>
                    {hasDiscount ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                        <span className="text-md font-bold text-green-600 dark:text-green-400">
                          ₹{discountedPrice.toFixed(0)}
                        </span>
                      </div>
                    ) : (
                      <p className="text-md font-bold text-green-600 dark:text-green-400">
                        ₹{product.price}
                      </p>
                    )}

                    {/* Button: Add to Cart or Go to Cart */}
                    <button
                      onClick={() => inCart ? navigate('/cart') : addToCart(product)}
                      className={`mt-3 w-full ${inCart
                          ? 'bg-gray-700 hover:bg-gray-800'
                          : 'bg-blue-600 hover:bg-blue-700'
                        } text-white text-sm py-1.5 rounded-md`}
                    >
                      {inCart ? 'Go to Cart' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllShopProducts;
