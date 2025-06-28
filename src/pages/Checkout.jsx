import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [cart, setCart] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    addressLine: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });

useEffect(() => {
  const buyNowItem = JSON.parse(localStorage.getItem('buyNowItem'));
  if (buyNowItem) {
    setCart([buyNowItem]);
  } else {
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(localCart);
  }
}, []);

  useEffect(() => {
    if (user) fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const snap = await getDocs(collection(db, 'users', user.uid, 'addresses'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAddresses(data);
    } catch (err) {
      toast.error("Failed to load addresses");
    }
  };

  const handleAddNewAddress = async () => {
    const { name, phone, addressLine, city, state, pincode } = newAddress;
    if (!name || !phone || !addressLine || !city || !state || !pincode) {
      return toast.error("Please fill all required fields");
    }

    try {
      const id = Date.now().toString();
      await setDoc(doc(db, 'users', user.uid, 'addresses', id), {
        ...newAddress,
        timestamp: Date.now()
      });
      setNewAddress({ name: '', phone: '', addressLine: '', landmark: '', city: '', state: '', pincode: '' });
      toast.success("Address added");
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to add address");
    }
  };

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const handleProceed = () => {
    if (!selectedAddressId) return toast.error("Please select a delivery address");
    if (cart.length === 0) return toast.error("Cart is empty");

    toast.success("Proceeding to payment...");
    setTimeout(() => {
      localStorage.removeItem('cart');
      navigate('/orders');
    }, 1500);
  };

  if (!user) {
    return <div className="text-center py-20 text-gray-500 dark:text-gray-300">Login to continue checkout</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-gray-900 dark:text-white bg-white dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛍️ Checkout</h1>
        <button
          onClick={() => navigate('/saved-addresses')}
          className="text-sm text-blue-600 hover:underline"
        >
          Manage Addresses →
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Address Section */}
        <div className="md:col-span-2 space-y-8">
          <h2 className="text-xl font-semibold">📦 Delivery Address</h2>

          {/* Show Saved Addresses */}
          {addresses.length > 0 && addresses.map(addr => (
            <div
              key={addr.id}
              className={`p-4 rounded border transition-all duration-200 
              ${selectedAddressId === addr.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                : 'border-gray-300 dark:border-gray-700'}`}
            >
              <p className="font-semibold">{addr.name} — {addr.phone}</p>
              <p className="text-sm">
                {addr.addressLine}, {addr.landmark && `${addr.landmark}, `}
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <button
                onClick={() => setSelectedAddressId(addr.id)}
                className="mt-2 px-4 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {selectedAddressId === addr.id ? "Selected" : "Select"}
              </button>
            </div>
          ))}

          {/* If No Address → Show Add Address Form */}
          {addresses.length === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">No saved addresses found. Please add one:</p>
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
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Save Address
              </button>
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">🧾 Order Summary</h2>
          {cart.map((item, i) => (
            <div key={i} className="mb-3 border-b pb-2 border-gray-300 dark:border-gray-600">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">₹{item.price}</p>
            </div>
          ))}
          <hr className="my-4" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <button
            onClick={handleProceed}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

// Stylish reusable input component
const Input = ({ label, value, onChange, colSpan }) => (
  <div className={colSpan ? 'sm:col-span-2' : ''}>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default Checkout;
