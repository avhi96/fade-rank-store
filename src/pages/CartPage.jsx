import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  const handleRemoveItem = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Item removed from cart');
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please log in to continue checkout.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    navigate('/checkout');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">🛒 My Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded shadow flex items-center justify-between transition hover:shadow-md"
              >
                <div
                  className="flex gap-4 items-center cursor-pointer"
                  onClick={() => navigate(`/${item.type || 'products'}/${item.id}`)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded hover:opacity-90 transition"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white hover:underline">
                      {item.name}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-bold">₹{item.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(i)}
                  className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-600 hover:text-white transition text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xl font-semibold">Total: ₹{totalPrice}</p>
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
