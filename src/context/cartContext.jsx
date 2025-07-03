import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ✅ Load and sanitize cart from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');

    const cleanedCart = storedCart.map(item => ({
      ...item,
      price: parseFloat(item.price) || 0,
      discount: parseFloat(item.discount) || 0,
      quantity: parseInt(item.quantity) || 1,
    }));

    setCart(cleanedCart);
  }, []);

  // ✅ Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ✅ Add item to cart with validation
  const addToCart = (product) => {
    const exists = cart.find(item => item.id === product.id);
    if (exists) return;

    const sanitizedItem = {
      ...product,
      price: parseFloat(product.price) || 0,
      discount: parseFloat(product.discount) || 0,
      quantity: parseInt(product.quantity) || 1,
    };

    setCart(prev => [...prev, sanitizedItem]);
  };

  // ✅ Remove item by ID
  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // ✅ Clear all cart items
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
