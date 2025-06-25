import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { useAuth, isAdmin } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('createProduct');

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '',
    mainImageURL: '', otherImageURLs: '',
  });
  const [mainImageFile, setMainImageFile] = useState(null);
  const [otherImageFiles, setOtherImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [serviceOrders, setServiceOrders] = useState([]);
  const [productOrders, setProductOrders] = useState([]);

  const CLOUD_NAME = 'drzj15ztl';
  const UPLOAD_PRESET = 'fademart_unsigned';

  useEffect(() => {
    fetchProducts();
    fetchServiceOrders();
    fetchProductOrders();
  }, []);

  const fetchProducts = async () => {
    const snap = await getDocs(collection(db, 'products'));
    setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchServiceOrders = async () => {
    const snap = await getDocs(collection(db, 'orders'));
    setServiceOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchProductOrders = async () => {
    const snap = await getDocs(collection(db, 'productOrders'));
    setProductOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: data });
    const json = await res.json();
    return json.secure_url;
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let mainImage = formData.mainImageURL.trim();
      if (!mainImage && mainImageFile) {
        mainImage = await uploadToCloudinary(mainImageFile);
      }
      if (!mainImage) throw new Error("Main image required");

      const otherImages = [...formData.otherImageURLs.split(',').map(url => url.trim())];
      for (const file of otherImageFiles) {
        const url = await uploadToCloudinary(file);
        otherImages.push(url);
      }

      await addDoc(collection(db, 'products'), {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        image: mainImage,
        images: otherImages,
        createdAt: serverTimestamp(),
      });

      toast.success("✅ Product uploaded!");
      setFormData({ name: '', description: '', price: '', mainImageURL: '', otherImageURLs: '' });
      setMainImageFile(null);
      setOtherImageFiles([]);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id));
    toast.success("🗑 Product deleted!");
    fetchProducts();
  };

  const handleCompleteOrder = async (id, type) => {
    const col = type === 'service' ? 'orders' : 'productOrders';
    await updateDoc(doc(db, col, id), { status: 'completed' });
    toast.success("✅ Order marked complete!");
    type === 'service' ? fetchServiceOrders() : fetchProductOrders();
  };

  const handleDeleteOrder = async (id, type) => {
    const col = type === 'service' ? 'orders' : 'productOrders';
    await deleteDoc(doc(db, col, id));
    toast.success("🗑 Order deleted!");
    type === 'service' ? fetchServiceOrders() : fetchProductOrders();
  };

  if (!isAdmin(user)) {
    return (
      <div className="text-center py-20 text-red-600 dark:text-red-400 text-xl font-semibold">
        🔒 Access Denied: Admins Only
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">⚙️ Admin Panel</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {[
          { label: '➕ Create Product', value: 'createProduct' },
          { label: '📦 Manage Products', value: 'manageProducts' },
          { label: '🛠 Service Orders', value: 'serviceOrders' },
          { label: '🛍 Product Orders', value: 'productOrders' },
        ].map(btn => (
          <button key={btn.value} onClick={() => setTab(btn.value)}
            className={`px-5 py-2 rounded font-semibold transition ${tab === btn.value
              ? 'bg-blue-600 text-white shadow'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-blue-500 hover:text-white'}`}>
            {btn.label}
          </button>
        ))}
      </div>

      {/* === Tabs === */}
      {tab === 'createProduct' && (
        <form
          onSubmit={handleCreateProduct}
          className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md rounded-lg p-8 max-w-3xl mx-auto space-y-6 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">
            🛒 Create a New Product
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Main Image */}
          <div>
            <label className="block mb-2">Main Image</label>
            <div className="border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-md p-4 bg-gray-100 dark:bg-gray-800">
              <input
                type="file"
                accept="image/*"
                onChange={e => setMainImageFile(e.target.files[0])}
                className="text-sm text-gray-900 dark:text-gray-200"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Or paste an image URL below:</p>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.mainImageURL}
              onChange={e => setFormData({ ...formData, mainImageURL: e.target.value })}
              className="w-full mt-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2"
            />
          </div>

          {/* Preview */}
          {(formData.mainImageURL || mainImageFile) && (
            <img
              src={mainImageFile ? URL.createObjectURL(mainImageFile) : formData.mainImageURL}
              alt="Preview"
              className="w-full max-h-48 object-cover mt-4 rounded-md border border-gray-300 dark:border-gray-700"
            />
          )}

          {/* More Images */}
          <div>
            <label className="block mb-1">More Images</label>
            <input
              type="file"
              multiple
              onChange={e => setOtherImageFiles([...e.target.files])}
              className="text-sm text-gray-900 dark:text-gray-200"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Or paste comma-separated URLs below:</p>
            <input
              type="text"
              placeholder="https://img1.jpg, https://img2.jpg"
              value={formData.otherImageURLs}
              onChange={e => setFormData({ ...formData, otherImageURLs: e.target.value })}
              className="w-full mt-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-4 py-2"
            />
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-2 px-6 rounded transition disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Product'}
            </button>
          </div>
        </form>
      )}


      {tab === 'manageProducts' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-white dark:bg-gray-800 border rounded-lg shadow p-4 relative">
              <img src={p.image} alt={p.name} className="h-40 w-full object-cover rounded mb-3" />
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">₹{p.price}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{p.description}</p>
              <button
                onClick={() => handleDeleteProduct(p.id)}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'serviceOrders' && (
        <OrderList data={serviceOrders} type="service" onComplete={handleCompleteOrder} onDelete={handleDeleteOrder} />
      )}

      {tab === 'productOrders' && (
        <OrderList data={productOrders} type="product" onComplete={handleCompleteOrder} onDelete={handleDeleteOrder} />
      )}
    </div>
  );
};

const OrderList = ({ data, type, onComplete, onDelete }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
    {data.length === 0
      ? <p className="text-center col-span-full text-gray-400">No orders found.</p>
      : data.map(order => (
        <div key={order.id} className="bg-white dark:bg-gray-800 border p-4 rounded-lg shadow">
          <h2 className="font-bold text-lg">{order.serviceTitle || order.productName}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">₹{order.price}</p>
          <p className="text-sm text-gray-500">👤 {order.name}</p>
          <p className="text-xs text-gray-400">📧 {order.email}</p>
          <p className={`text-sm font-medium mt-2 ${order.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>Status: {order.status}</p>
          <div className="mt-3 flex gap-2">
            {order.status !== 'completed' && (
              <button onClick={() => onComplete(order.id, type)} className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700">Complete</button>
            )}
            <button onClick={() => onDelete(order.id, type)} className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700">Delete</button>
          </div>
        </div>
      ))}
  </div>
);

export default Admin;
