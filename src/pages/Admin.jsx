import React, { useEffect, useState } from 'react';
import {
  collection, getDocs, addDoc, deleteDoc, updateDoc,
  doc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth, isAdmin } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const inputStyle = "w-full rounded border px-3 py-2 mb-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder-gray-400";

const Admin = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('addProduct');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    imageURL: '',
    type: 'shop',
    demoUrl: ''
  });
  const [files, setFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [shopProducts, setShopProducts] = useState([]);
  const [digitalProducts, setDigitalProducts] = useState([]);
  const [shopOrders, setShopOrders] = useState([]);
  const [digitalOrders, setDigitalOrders] = useState([]);
  const [serviceOrders, setServiceOrders] = useState([]);
  const [uploading, setUploading] = useState(false);

  const CLOUD_NAME = 'drzj15ztl';
  const UPLOAD_PRESET = 'fademart_unsigned';

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const shopSnap = await getDocs(collection(db, 'shopProducts'));
    setShopProducts(shopSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    const digiSnap = await getDocs(collection(db, 'products'));
    setDigitalProducts(digiSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    const serviceSnap = await getDocs(collection(db, 'orders'));
    setServiceOrders(serviceSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    const prodOrderSnap = await getDocs(collection(db, 'productOrders'));
    setDigitalOrders(prodOrderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    const userSnap = await getDocs(collection(db, 'users'));
    let allOrders = [];
    for (const u of userSnap.docs) {
      const oSnap = await getDocs(collection(db, 'users', u.id, 'orders'));
      oSnap.forEach(o => allOrders.push({ ...o.data(), id: o.id, userId: u.id }));
    }
    setShopOrders(allOrders);
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: data });
    const json = await res.json();
    return json.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let uploaded = [];
      if (files.length > 0) {
        for (const file of files) uploaded.push(await uploadToCloudinary(file));
      } else if (form.imageURL.trim()) {
        uploaded = [form.imageURL.trim()];
      } else {
        throw new Error("Image required");
      }

      const data = {
        name: form.name,
        price: Number(form.price),
        discount: form.discount ? Number(form.discount) : 0,
        images: uploaded,
        description: form.description,
        demoUrl: form.demoUrl || '',
        createdAt: serverTimestamp()
      };

      const target = form.type === 'shop' ? 'shopProducts' : 'products';

      if (editingId) {
        await updateDoc(doc(db, target, editingId), data);
        toast.success('Updated successfully');
        setEditingId(null);
      } else {
        await addDoc(collection(db, target), data);
        toast.success('Product added');
      }

      setForm({
        name: '',
        description: '',
        price: '',
        discount: '',
        imageURL: '',
        type: 'shop',
        demoUrl: ''
      });
      setFiles([]);
      fetchAll();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item, type) => {
    setForm({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      discount: item.discount || '',
      imageURL: item.images?.[0] || item.image || '',
      type,
      demoUrl: item.demoUrl || ''
    });
    setEditingId(item.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (type, id) => {
    await deleteDoc(doc(db, type, id));
    toast.success('Deleted');
    fetchAll();
  };

  const handleComplete = async (type, id) => {
    await updateDoc(doc(db, type, id), { status: 'completed' });
    toast.success('Marked complete');
    fetchAll();
  };

  const tabs = [
    { id: 'addProduct', label: 'Add/Edit Product' },
    { id: 'shopItems', label: 'Shop Items' },
    { id: 'digitalItems', label: 'Digital Items' },
    { id: 'shopOrders', label: 'Shop Orders' },
    { id: 'digitalOrders', label: 'Digital Orders' },
    { id: 'serviceOrders', label: 'Service Orders' },
  ];

  if (!isAdmin(user)) return <div className="text-center text-xl text-red-600 dark:text-red-400 py-20">🔒 Admins Only</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">⚙️ Admin Panel</h1>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded ${tab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'addProduct' && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow max-w-xl mx-auto border space-y-4">
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputStyle}>
            <option value="shop">Shop Product</option>
            <option value="digital">Digital Product</option>
          </select>
          <input type="text" placeholder="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputStyle} required />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputStyle} h-32`} />
          <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className={inputStyle} required />
          <input type="number" placeholder="% Off (Optional)" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} className={inputStyle} />
          {form.type === 'digital' && (
            <input type="url" placeholder="Demo Link (Optional)" value={form.demoUrl} onChange={e => setForm({ ...form, demoUrl: e.target.value })} className={inputStyle} />
          )}
          <input type="file" accept="image/*" multiple onChange={e => setFiles(Array.from(e.target.files))} className="text-sm" />
          <input type="url" placeholder="Image URL (optional)" value={form.imageURL} onChange={e => setForm({ ...form, imageURL: e.target.value })} className={inputStyle} />
          <button type="submit" disabled={uploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      )}

      {tab === 'shopItems' && (
        <ProductGrid data={shopProducts} type="shopProducts" onDelete={handleDelete} onEdit={item => handleEdit(item, 'shop')} />
      )}

      {tab === 'digitalItems' && (
        <ProductGrid data={digitalProducts} type="products" onDelete={handleDelete} onEdit={item => handleEdit(item, 'digital')} />
      )}

      {tab === 'shopOrders' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {shopOrders.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-800 p-5 rounded shadow border flex flex-col justify-between">
              <div className="space-y-1 text-sm">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>User Name:</strong> {order.username || 'Unknown'}</p>
                <p><strong>Total:</strong> ₹{order.items?.reduce((sum, item) => sum + (item.price || 0), 0)}</p>
                <p><strong>Status:</strong> <span className={`font-semibold ${order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status || 'pending'}</span></p>
                <p><strong>Items:</strong></p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                  {order.items?.map((item, idx) => (
                    <li key={idx}>{item.name} - ₹{item.price}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => handleComplete(order.userId, order.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded">Complete</button>
                <button onClick={() => handleDelete(`users/${order.userId}/orders`, order.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'digitalOrders' && <OrderGrid orders={digitalOrders} type="productOrders" onDelete={handleDelete} onComplete={handleComplete} />}
      {tab === 'serviceOrders' && <OrderGrid orders={serviceOrders} type="orders" onDelete={handleDelete} onComplete={handleComplete} />}
    </div>
  );
};

const ProductGrid = ({ data, type, onDelete, onEdit }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {data.map(item => (
      <div key={item.id} className="bg-white dark:bg-gray-800 p-5 rounded shadow border flex flex-col">
        <img src={item.images?.[0] || item.image || '/placeholder.jpg'} alt={item.name} className="h-40 w-full object-cover rounded mb-2" />
        <h3 className="text-lg font-bold">{item.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">₹{item.price}</p>
        {item.discount > 0 && <p className="text-xs text-red-500">{item.discount}% OFF</p>}
        <div className="mt-3 flex gap-2">
          <button onClick={() => onEdit(item)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded">Edit</button>
          <button onClick={() => onDelete(type, item.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded">Delete</button>
        </div>
      </div>
    ))}
  </div>
);

const OrderGrid = ({ orders, type, nested, onDelete, onComplete }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {orders.map(order => (
      <div key={order.id} className="bg-white dark:bg-gray-800 p-5 rounded shadow border flex flex-col justify-between">
        <div className="space-y-1 text-sm">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>User:</strong> {order.username || order.userId || order.name || 'Unknown'}</p>
          <p><strong>Status:</strong> <span className={`font-semibold ${order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status || 'pending'}</span></p>
          <p><strong>Total:</strong> ₹{order.items?.reduce((sum, item) => sum + (item.price || 0), 0) || order.price || 0}</p>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={() => onComplete(nested ? `${type}/${order.userId}/${nested}` : type, order.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded">Complete</button>
          <button onClick={() => onDelete(nested ? `${type}/${order.userId}/${nested}` : type, order.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded">Delete</button>
        </div>
      </div>
    ))}
  </div>
);

export default Admin;
