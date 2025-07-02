import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/cartContext';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  setDoc,
  doc,
  addDoc,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const { user } = useAuth();
  const { cart: contextCart } = useCart();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    addressLine: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });

  // ✅ Use cart from context or "buyNowItem"
  useEffect(() => {
    const buyNowItem = JSON.parse(localStorage.getItem('buyNowItem'));
    const hasCartItems = contextCart && contextCart.length > 0;

    if (hasCartItems) {
      setCart(contextCart);
    } else if (buyNowItem) {
      setCart([buyNowItem]);
    } else {
      setCart([]);
    }
  }, [contextCart]);


  useEffect(() => {
    if (user) fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const snap = await getDocs(collection(db, 'users', user.uid, 'addresses'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAddresses(data);
    } catch (err) {
      toast.error('Failed to load addresses');
    }
  };

  const handleAddNewAddress = async () => {
    const { name, phone, addressLine, city, state, pincode } = newAddress;
    if (!name || !phone || !addressLine || !city || !state || !pincode) {
      return toast.error('Please fill all required fields');
    }

    try {
      const id = Date.now().toString();
      await setDoc(doc(db, 'users', user.uid, 'addresses', id), {
        ...newAddress,
        timestamp: Date.now(),
      });
      setNewAddress({
        name: '',
        phone: '',
        addressLine: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
      });
      toast.success('Address added');
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  const getFinalPrice = (price, discount) => {
    return discount && discount > 0 ? price - price * (discount / 100) : price;
  };

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
  const total = cart.reduce((acc, item) => acc + getFinalPrice(item.price, item.discount), 0);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handleProceed = async () => {
    if (!selectedAddressId) return toast.error('Please select a delivery address');
    if (cart.length === 0) return toast.error('Cart is empty');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });
      const orderData = await res.json();

      const options = {
        key: 'rzp_live_0017VANdScBR7u',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Fade Network',
        description: 'Payment for your order',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // Save order to Firestore
            await addDoc(collection(db, 'users', user.uid, 'orders'), {
              items: cart,
              amount: total,
              address: selectedAddress,
              razorpay_payment_id: response.razorpay_payment_id,
              createdAt: Date.now(),
            });

            // Clear local cart and buyNowItem
            localStorage.removeItem('cart');
            localStorage.removeItem('buyNowItem');

            toast.success('Payment successful! Redirecting...');

            // Wait a moment before redirect (optional but smooth UX)
            setTimeout(() => {
              navigate('/thank-you');
            }, 1500);

          } catch (err) {
            toast.error('Payment succeeded but order save failed');
          }
        },


        prefill: {
          name: selectedAddress?.name,
          contact: selectedAddress?.phone,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Something went wrong during payment');
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-300">
        Login to continue checkout
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-900 dark:text-white bg-white dark:bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold tracking-tight">Checkout</h1>
        <button
          onClick={() => navigate('/saved-addresses')}
          className="text-sm text-blue-600 hover:underline"
        >
          Manage Addresses
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Address Section */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-medium mb-2">Select Delivery Address</h2>

          {addresses.length > 0 ? (
            addresses.map(addr => (
              <div
                key={addr.id}
                className={`p-4 rounded-md border ${selectedAddressId === addr.id
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-300 dark:border-gray-700'
                  }`}
              >
                <p className="font-semibold">{addr.name} — {addr.phone}</p>
                <p className="text-sm mt-1">
                  {addr.addressLine}, {addr.landmark && `${addr.landmark}, `}
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <button
                  onClick={() => setSelectedAddressId(addr.id)}
                  className="mt-3 px-4 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  {selectedAddressId === addr.id ? 'Selected' : 'Select'}
                </button>
              </div>
            ))
          ) : (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm">No saved addresses. Please add one:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" value={newAddress.name} onChange={val => setNewAddress({ ...newAddress, name: val })} />
                <Input label="Phone Number" value={newAddress.phone} onChange={val => setNewAddress({ ...newAddress, phone: val })} />
                <Input label="Address Line" value={newAddress.addressLine} onChange={val => setNewAddress({ ...newAddress, addressLine: val })} colSpan />
                <Input label="Landmark (Optional)" value={newAddress.landmark} onChange={val => setNewAddress({ ...newAddress, landmark: val })} colSpan />
                <Input label="City" value={newAddress.city} onChange={val => setNewAddress({ ...newAddress, city: val })} />
                <Input label="State" value={newAddress.state} onChange={val => setNewAddress({ ...newAddress, state: val })} />
                <Input label="Pincode" value={newAddress.pincode} onChange={val => setNewAddress({ ...newAddress, pincode: val })} />
              </div>
              <button
                onClick={handleAddNewAddress}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md"
              >
                Save Address
              </button>
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4">Order Summary</h2>
          {cart.map((item, i) => {
            const finalPrice = getFinalPrice(item.price, item.discount);
            return (
              <div key={i} className="mb-4 border-b pb-3 border-gray-300 dark:border-gray-600">
                <p className="font-medium">{item.name}</p>
                {item.discount > 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="line-through">₹{item.price}</span>{' '}
                    <span className="text-green-600 font-semibold">₹{finalPrice.toFixed(0)}</span>{' '}
                    <span className="text-red-500 text-xs">({item.discount}% OFF)</span>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">₹{item.price}</p>
                )}
              </div>
            );
          })}
          <div className="flex justify-between mt-4 font-semibold text-lg">
            <span>Total</span>
            <span>₹{total.toFixed(0)}</span>
          </div>
          <button
            onClick={handleProceed}
            disabled={loading}
            className={`mt-6 w-full py-2 rounded-md text-white ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, colSpan }) => (
  <div className={colSpan ? 'sm:col-span-2' : ''}>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default Checkout;
