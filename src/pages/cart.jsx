// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-hot-toast';

// const Cart = () => {
//   const [cart, setCart] = useState([]);
  
//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('cart')) || [];
//     setCart(stored);
//   }, []);

//   const updateCart = (newCart) => {
//     localStorage.setItem('cart', JSON.stringify(newCart));
//     setCart(newCart);
//   };

//   const removeItem = (id) => {
//     const newCart = cart.filter(item => item.id !== id);
//     updateCart(newCart);
//     toast.success('Item removed from cart');
//   };

//   const changeQty = (id, delta) => {
//     const newCart = cart.map(item =>
//       item.id === id
//         ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
//         : item
//     );
//     updateCart(newCart);
//   };

//   const total = cart.reduce(
//     (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
//     0
//   );

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

//       {cart.length === 0 ? (
//         <p className="text-gray-600">Your cart is empty. <Link to="/" className="text-blue-600 underline">Shop now</Link></p>
//       ) : (
//         <>
//           <div className="space-y-4">
//             {cart.map(item => (
//               <div key={item.id} className="bg-white shadow rounded p-4 flex gap-4 items-center">
//                 <img src={item.image} alt={item.name} className="w-24 h-24 object-contain border" />
//                 <div className="flex-1">
//                   <h2 className="text-lg font-semibold">{item.name}</h2>
//                   <p className="text-gray-600">₹{item.price}</p>
//                   <div className="flex gap-2 mt-2 items-center">
//                     <button onClick={() => changeQty(item.id, -1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
//                     <span>{item.quantity || 1}</span>
//                     <button onClick={() => changeQty(item.id, 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
//                   </div>
//                 </div>
//                 <button onClick={() => removeItem(item.id)} className="text-red-600 hover:underline">Remove</button>
//               </div>
//             ))}
//           </div>

//           <div className="mt-8 p-4 bg-gray-50 rounded border flex justify-between items-center">
//             <p className="text-xl font-semibold">Total: ₹{total}</p>
//             <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Proceed to Buy</button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Cart;
