import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const SavedAddresses = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pincode: '',
    city: '',
    state: '',
    addressLine: '',
    landmark: '',
  });
  const [editingId, setEditingId] = useState(null);

  const fetchAddresses = async () => {
    if (!user) return;
    try {
      const snap = await getDocs(collection(db, 'users', user.uid, 'addresses'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sorted = data.sort((a, b) => b.timestamp - a.timestamp);
      setAddresses(sorted);
    } catch (err) {
      toast.error("Error loading addresses");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, phone, pincode, city, state, addressLine } = formData;
    if (!name || !phone || !pincode || !city || !state || !addressLine) {
      return toast.error("Please fill all required fields");
    }
    if (phone.length < 10 || isNaN(phone)) return toast.error("Enter a valid phone number");
    if (pincode.length !== 6 || isNaN(pincode)) return toast.error("Enter a valid 6-digit pincode");

    const id = editingId || Date.now().toString();
    const newAddress = {
      ...formData,
      timestamp: Date.now(),
    };

    try {
      await setDoc(doc(db, 'users', user.uid, 'addresses', id), newAddress);
      setFormData({
        name: '',
        phone: '',
        pincode: '',
        city: '',
        state: '',
        addressLine: '',
        landmark: '',
      });
      setEditingId(null);
      fetchAddresses();
      toast.success(editingId ? "Address updated" : "Address saved");
    } catch (err) {
      toast.error("Failed to save address");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'addresses', id));
      fetchAddresses();
      toast.success("Deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (address) => {
    setEditingId(address.id);
    setFormData({
      name: address.name,
      phone: address.phone,
      pincode: address.pincode,
      city: address.city,
      state: address.state,
      addressLine: address.addressLine,
      landmark: address.landmark || '',
    });
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-300">
        Please log in to view saved addresses.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Saved Addresses</h1>

      {/* Address Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <input name="name" value={formData.name} onChange={handleChange} className="p-3 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-800" placeholder="Full Name *" />
        <input name="phone" value={formData.phone} onChange={handleChange} className="p-3 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-800" placeholder="Phone Number *" />
        <input name="pincode" value={formData.pincode} onChange={handleChange} className="p-3 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-800" placeholder="Pincode *" />
        <input name="city" value={formData.city} onChange={handleChange} className="p-3 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-800" placeholder="City *" />
        <input name="state" value={formData.state} onChange={handleChange} className="p-3 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-800" placeholder="State *" />
        <input name="landmark" value={formData.landmark} onChange={handleChange} className="p-3 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-800" placeholder="Landmark (Optional)" />
        <textarea name="addressLine" value={formData.addressLine} onChange={handleChange} rows="3" className="sm:col-span-2 p-3 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-800" placeholder="Address Line (Street, Building) *" />
      </div>
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        {editingId ? 'Update Address' : 'Save Address'}
      </button>

      {/* Saved Address List */}
      <div className="mt-10 space-y-4">
        {addresses.map(addr => (
          <div key={addr.id} className="bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 rounded p-4">
            <p className="font-semibold">{addr.name} — {addr.phone}</p>
            <p className="text-sm">{addr.addressLine}, {addr.landmark && `${addr.landmark}, `}{addr.city}, {addr.state} - {addr.pincode}</p>
            <div className="mt-2 flex gap-4 text-sm">
              <button onClick={() => handleEdit(addr)} className="text-blue-500 hover:underline">Edit</button>
              <button onClick={() => handleDelete(addr.id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {addresses.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">No saved addresses found.</p>
        )}
      </div>
    </div>
  );
};

export default SavedAddresses;
