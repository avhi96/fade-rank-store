import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection, getDocs, addDoc, deleteDoc,
  updateDoc, doc, serverTimestamp
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { useAuth, isAdmin } from '../context/AuthContext';

const inputStyle = "w-full rounded border px-3 py-2 mb-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder-gray-400";

const Admin = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('addProduct');
  const [formMode, setFormMode] = useState('shopify');
  const [form, setForm] = useState({ name: '', description: '', price: '', link: '', imageURL: '' });
  const [file, setFile] = useState(null);

  const [shopProducts, setShopProducts] = useState([]);
  const [digitalProducts, setDigitalProducts] = useState([]);
  const [serviceOrders, setServiceOrders] = useState([]);
  const [productOrders, setProductOrders] = useState([]);

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

    const servSnap = await getDocs(collection(db, 'orders'));
    setServiceOrders(servSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    const prodOrderSnap = await getDocs(collection(db, 'productOrders'));
    setProductOrders(prodOrderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: data
    });
    const json = await res.json();
    return json.secure_url;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageURL = form.imageURL.trim();
      if (!imageURL && file) imageURL = await uploadToCloudinary(file);
      if (!imageURL) throw new Error("Image is required");

      const data = {
        name: form.name,
        price: Number(form.price),
        image: imageURL,
        createdAt: serverTimestamp(),
      };

      if (formMode === 'shopify') {
        data.shopifyLink = form.link;
        await addDoc(collection(db, 'shopProducts'), data);
      } else {
        data.description = form.description;
        await addDoc(collection(db, 'products'), data);
      }

      toast.success("✅ Product added!");
      setForm({ name: '', description: '', price: '', link: '', imageURL: '' });
      setFile(null);
      fetchAll();
    } catch (err) {
      toast.error("❌ Failed to add product");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (type, id) => {
    await deleteDoc(doc(db, type, id));
    toast.success("🗑 Deleted");
    fetchAll();
  };

  const handleCompleteOrder = async (type, id) => {
    await updateDoc(doc(db, type, id), { status: 'completed' });
    toast.success("✅ Marked complete");
    fetchAll();
  };

  if (!isAdmin(user)) return (
    <div className="text-center py-20 text-red-600 dark:text-red-400 text-xl font-semibold">
      🔒 Admins Only
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">⚙️ Admin Panel</h1>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {['addProduct', 'shopItems', 'digitalItems', 'orders', 'productOrders'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded font-medium transition ${tab === t ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
              }`}>
            {t.replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </div>

      {/* Add Product */}
      {tab === 'addProduct' && (
        <form onSubmit={handleAddProduct} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow max-w-xl mx-auto border space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Product Type:</span>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-1">
                <input type="radio" checked={formMode === 'shopify'} onChange={() => setFormMode('shopify')} />
                Shopify
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" checked={formMode === 'digital'} onChange={() => setFormMode('digital')} />
                Digital
              </label>
            </div>
          </div>

          <input type="text" placeholder="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputStyle} required />
          {formMode === 'digital' && (
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={inputStyle} />
          )}
          <input type="number" placeholder="Price (₹)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className={inputStyle} required />
          {formMode === 'shopify' && (
            <input type="url" placeholder="Shopify Link" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className={inputStyle} />
          )}
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="text-sm" />
          <input type="url" placeholder="Image URL (optional)" value={form.imageURL} onChange={e => setForm({ ...form, imageURL: e.target.value })} className={inputStyle} />
          <button type="submit" disabled={uploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            {uploading ? 'Uploading...' : 'Add Product'}
          </button>
        </form>
      )}

      {/* Shop Items (Not Orders) */}
      {tab === 'shopItems' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {shopProducts.map(product => (
            <div key={product.id} className="bg-white dark:bg-gray-800 p-5 rounded shadow border">
              {product.image && <img src={product.image} alt={product.name} className="h-40 w-full object-cover mb-3 rounded" />}
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">₹{product.price}</p>
              {product.shopifyLink && (
                <a href={product.shopifyLink} target="_blank" rel="noreferrer" className="text-blue-500 underline text-sm">
                  View Link
                </a>
              )}
              <button
                onClick={() => handleDelete('shopProducts', product.id)}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Digital Items */}
      {tab === 'digitalItems' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {digitalProducts.map(product => (
            <div key={product.id} className="bg-white dark:bg-gray-800 p-5 rounded shadow border">
              {product.image && <img src={product.image} alt={product.name} className="h-40 w-full object-cover mb-3 rounded" />}
              <h3 className="text-lg font-bold">{product.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">₹{product.price}</p>
              <p className="text-xs text-gray-400">{product.description}</p>
              <button
                onClick={() => handleDelete('products', product.id)}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Service Orders */}
      {tab === 'orders' && (
        <OrderGrid
          orders={serviceOrders}
          type="orders"
          onComplete={handleCompleteOrder}
          onDelete={handleDelete}
        />
      )}

      {/* Product Orders */}
      {tab === 'productOrders' && (
        <OrderGrid
          orders={productOrders}
          type="productOrders"
          onComplete={handleCompleteOrder}
          onDelete={handleDelete}
          isProduct
        />
      )}
    </div>
  );
};

const OrderGrid = ({ orders, type, onComplete, onDelete, isProduct }) => {
  if (!Array.isArray(orders)) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {orders.map(o => (
        <div key={o.id} className="bg-white dark:bg-gray-800 p-5 rounded shadow border flex flex-col justify-between">
          <div className="mb-3 space-y-1 text-sm">
            <p><strong className="text-gray-600 dark:text-gray-300">Order ID:</strong> {o.id}</p>
            <p><strong className="text-gray-600 dark:text-gray-300">{isProduct ? 'Product Name:' : 'Service Name:'}</strong>  {isProduct
              ? (o.productName || o.name || 'N/A')
              : (o.serviceTitle || o.service || o.name || o.title || 'N/A')}
            </p>
            <p><strong className="text-gray-600 dark:text-gray-300">User Name:</strong> {o.userName || o.name || 'N/A'}</p>
            <p><strong className="text-gray-600 dark:text-gray-300">Email:</strong> {o.userEmail || o.email || 'N/A'}</p>
            <p><strong className="text-gray-600 dark:text-gray-300">Price:</strong> ₹{typeof o.price === 'number' ? o.price : 'N/A'}</p>
            <p><strong className="text-gray-600 dark:text-gray-300">Status:</strong> <span className={`font-semibold ${o.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{o.status || 'pending'}</span></p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onComplete(type, o.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded">Mark Complete</button>
            <button onClick={() => onDelete(type, o.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Admin;
