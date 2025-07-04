// 🛠️ Admin.jsx (Final Full Version)
import React, { useEffect, useState } from 'react';
import {
  collection, getDocs, addDoc, deleteDoc, updateDoc,
  doc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth, isAdmin } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import OrderStatusTracker from '../admin/OrderStatusTracker';

const inputStyle = "w-full rounded border px-3 py-2 mb-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white placeholder-gray-400";

const shopCategories = [
  { label: 'Anime Accessories', value: 'accessories' },
  { label: 'Wall Decor', value: 'wall-decor' },
  { label: 'Desk & Tech Gear', value: 'tech-gear' },
  { label: 'Anime Figurines', value: 'figurines' },
  { label: 'Stickers & Decals', value: 'stickers' },
  { label: 'Costumes & Wearables', value: 'cosplay' },
];

const Admin = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('addProduct');
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    imageURLs: '',
    type: 'shop',
    demoUrl: '',
    category: '',
  });
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [shopProducts, setShopProducts] = useState([]);
  const [digitalProducts, setDigitalProducts] = useState([]);
  const [shopOrders, setShopOrders] = useState([]);
  const [digitalOrders, setDigitalOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState(null);
  const [userMap, setUserMap] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Removed serviceOrders state as per user request
  const [uploading, setUploading] = useState(false);

  const CLOUD_NAME = 'drzj15ztl';
  const UPLOAD_PRESET = 'fademart_unsigned';

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoadingOrders(true);
      setErrorOrders(null);

      const shopSnap = await getDocs(collection(db, 'shopProducts'));
      setShopProducts(shopSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const digiSnap = await getDocs(collection(db, 'products'));
      setDigitalProducts(digiSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch users to create userId to username map
      const userSnap = await getDocs(collection(db, 'users'));
      const userMapTemp = {};
      userSnap.docs.forEach(doc => {
        const data = doc.data();
        userMapTemp[doc.id] = data.username || data.email || 'Unknown';
      });
      setUserMap(userMapTemp);

      const prodOrderSnap = await getDocs(collection(db, 'productOrders'));
      const digitalOrdersData = prodOrderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDigitalOrders(digitalOrdersData);

      // Fetch shop orders from root-level 'orders' collection
      const shopOrderSnap = await getDocs(collection(db, 'orders'));
      let shopOrdersData = shopOrderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Enrich order items with product names from shopProducts and digitalProducts
      shopOrdersData = shopOrdersData.map(order => {
        if (order.items && Array.isArray(order.items)) {
          const enrichedItems = order.items.map(item => {
            // Try to find matching product in shopProducts or digitalProducts by id
            const product = shopProducts.find(p => p.id === item.id);
            const digitalProduct = digitalProducts.find(p => p.id === item.id);
            return {
              ...item,
              name: item.name || product?.name || digitalProduct?.name || product?.title || digitalProduct?.title || 'Unnamed Item',
              price: item.price || product?.price || digitalProduct?.price || 0,
              quantity: item.quantity || 1,
              type: product ? 'item' : digitalProduct ? 'product' : item.type || 'unknown',
            };
          });
          return { ...order, items: enrichedItems };
        }
        return order;
      });

      setShopOrders(shopOrdersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setErrorOrders('Failed to fetch orders');
    } finally {
      setLoadingOrders(false);
    }
  };



  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: data
    });
    const json = await res.json();
    return json.secure_url;
  };

  // Modal close handler
  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  // Modal open handler
  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let uploaded = [...existingImages];
      if (files.length > 0) {
        for (const file of files) {
          const url = await uploadToCloudinary(file);
          uploaded.push(url);
        }
      }

      if (form.imageURLs.trim()) {
        const urls = form.imageURLs.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);
        uploaded.push(...urls);
      }

      if (uploaded.length === 0) throw new Error('At least one image is required.');

      const data = {
        name: form.name,
        price: Number(form.price),
        discount: form.discount ? Number(form.discount) : 0,
        images: uploaded,
        description: form.description,
        demoUrl: form.demoUrl || '',
        createdAt: serverTimestamp(),
      };

      const target = form.type === 'shop' ? 'shopProducts' : 'products';
      if (form.type === 'shop') data.category = form.category || '';

      if (editingId) {
        await updateDoc(doc(db, target, editingId), data);
        toast.success('Product updated');
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
        imageURLs: '',
        type: 'shop',
        demoUrl: '',
        category: '',
      });
      setFiles([]);
      setExistingImages([]);
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
      imageURLs: '',
      type,
      demoUrl: item.demoUrl || '',
      category: item.category || '',
    });
    setExistingImages(item.images || []);
    setEditingId(item.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (type, id, userId, nested) => {
    try {
      if (nested && userId) {
        // For shop orders, delete from root-level 'orders' collection
        if (type === 'users' || type === 'orders') {
          await deleteDoc(doc(db, 'orders', id));
        } else {
          await deleteDoc(doc(db, type, userId, nested, id));
        }
      } else {
        await deleteDoc(doc(db, type, id));
      }
      toast.success('Deleted');
      fetchAll();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleComplete = async (type, id, userId, nested) => {
    try {
      // For shop orders, update status in root-level 'orders' collection
      if (type === 'users' || type === 'orders') {
        await updateDoc(doc(db, 'orders', id), { status: 'completed' });
      } else if (nested && userId) {
        await updateDoc(doc(db, type, userId, nested, id), { status: 'completed' });
      } else {
        await updateDoc(doc(db, type, id), { status: 'completed' });
      }
      toast.success('Marked complete');
      fetchAll();
    } catch (err) {
      toast.error('Failed to mark complete');
    }
  };

  const handleStatusChange = async (type, id, userId, newStatus) => {
    try {
      // For shop orders, always update in root-level 'orders' collection
      if (type === 'users' || type === 'orders') {
        await updateDoc(doc(db, 'orders', id), { status: newStatus });
      } else {
        // For other types (e.g., digital orders), update in given collection
        await updateDoc(doc(db, type, id), { status: newStatus });
      }
      toast.success(`Order status updated to ${newStatus}`);
      fetchAll();
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const tabs = [
    { id: 'addProduct', label: 'Add/Edit Product' },
    { id: 'shopItems', label: 'Shop Items' },
    { id: 'digitalItems', label: 'Digital Items' },
    { id: 'shopOrders', label: 'Shop Orders' },
    { id: 'digitalOrders', label: 'Digital Orders' },
    // Removed serviceOrders tab as per user request
    // { id: 'serviceOrders', label: 'Service Orders' },
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

      {/* Add Product Form */}
      {tab === 'addProduct' && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow max-w-xl mx-auto border space-y-4">
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputStyle}>
            <option value="shop">Shop Product</option>
            <option value="digital">Digital Product</option>
          </select>

          {form.type === 'shop' && (
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputStyle} required>
              <option value="">-- Select Category --</option>
              {shopCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          )}

          <input type="text" placeholder="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputStyle} required />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputStyle} h-24`} />
          <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className={inputStyle} required />
          <input type="number" placeholder="% Off (Optional)" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} className={inputStyle} />
          {form.type === 'digital' && (
            <input type="url" placeholder="Demo Link (Optional)" value={form.demoUrl} onChange={e => setForm({ ...form, demoUrl: e.target.value })} className={inputStyle} />
          )}
          <input type="file" accept="image/*" multiple onChange={e => setFiles(Array.from(e.target.files))} className="text-sm" />
          <textarea placeholder="Image URLs (comma or newline separated)" value={form.imageURLs} onChange={e => setForm({ ...form, imageURLs: e.target.value })} className={`${inputStyle} h-24`} />

          {existingImages.length > 0 && (
            <ul className="space-y-2">
              {existingImages.map((url, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <img src={url} alt="" className="w-14 h-14 object-cover rounded" />
                    <span className="truncate max-w-xs">{url}</span>
                  </div>
                  <button onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))} className="text-red-500">Remove</button>
                </li>
              ))}
            </ul>
          )}

          <button type="submit" disabled={uploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      )}

      {/* Other Tabs */}
      {tab === 'shopItems' && <ProductGrid data={shopProducts} type="shopProducts" onDelete={handleDelete} onEdit={(item) => handleEdit(item, 'shop')} />}
      {tab === 'digitalItems' && <ProductGrid data={digitalProducts} type="products" onDelete={handleDelete} onEdit={(item) => handleEdit(item, 'digital')} />}
      {tab === 'shopOrders' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Shop Orders</h2>
          </div>
          {loadingOrders && <p>Loading orders...</p>}
          {errorOrders && <p className="text-red-600">{errorOrders}</p>}
          <OrderGrid
            orders={shopOrders}
            type="users"
            nested="orders"
            onDelete={(type, id, userId) => handleDelete(type, id, userId, 'orders')}
            onComplete={(type, id, userId) => handleComplete(type, id, userId, 'orders')}
            onStatusChange={handleStatusChange}
            onOrderClick={openModal}
            userMap={userMap}
          />
        </>
      )}

      {tab === 'digitalOrders' && <OrderGrid orders={digitalOrders} type="productOrders" onDelete={handleDelete} onComplete={handleComplete} onOrderClick={openModal} userMap={userMap} showUserEmail={true} />}
      {/* Removed serviceOrders tab as per user request */}
      {/* {tab === 'serviceOrders' && <OrderGrid orders={serviceOrders} type="orders" onDelete={handleDelete} onComplete={handleComplete} />} */}

      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <button onClick={closeModal} className="mb-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Close</button>
            <div className="space-y-2 text-sm">
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>User:</strong> {userMap[selectedOrder.userId] || selectedOrder.userId || 'N/A'}</p>
              <p><strong>User Email:</strong> {selectedOrder.userEmail || 'N/A'}</p>
              <p><strong>Status:</strong> {selectedOrder.status || 'N/A'}</p>
              <p><strong>Total Price:</strong> ₹{selectedOrder.items?.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0) || selectedOrder.price || 0}</p>
              {selectedOrder.address && (
                <div>
                  <h3 className="font-semibold mt-2">Shipping Address:</h3>
                  <p>{selectedOrder.address.name}</p>
                  <p>{selectedOrder.address.addressLine}</p>
                  <p>{selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}</p>
                  <p>Phone: {selectedOrder.address.phone}</p>
                </div>
              )}
            {selectedOrder.items && selectedOrder.items.length > 0 ? (
              <div>
                <h3 className="font-semibold mt-2">Items Ordered:</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto border p-2 rounded">
                  {selectedOrder.items.map((item, index) => {
                    const itemName = item.name || item.title || 'Unnamed Item';
                    const itemQty = item.quantity || 1;
                    const itemPrice = item.price || 0;
                    return (
                      <div key={index} className="flex justify-between border-b border-gray-300 dark:border-gray-700 pb-1">
                        <div>
                          <p className="font-semibold">{itemName}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Qty: {itemQty}</p>
                        </div>
                        <div className="font-semibold">₹{itemPrice}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p>No items found in this order.</p>
            )}
              {selectedOrder.createdAt && (
                <p><strong>Order Date:</strong> {selectedOrder.createdAt.toDate ? selectedOrder.createdAt.toDate().toLocaleString() : new Date(selectedOrder.createdAt).toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Reusable ProductGrid Component
const ProductGrid = ({ data, type, onDelete, onEdit }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {data.map(item => {
      const original = item.price;
      const discount = item.discount;
      const final = discount > 0 ? original - (original * discount / 100) : original;

      return (
        <div key={item.id} className="bg-white dark:bg-gray-800 p-5 rounded shadow border flex flex-col">
          <img src={item.images?.[0]} alt={item.name} className="h-40 w-full object-cover rounded mb-2" />
          <h3 className="text-lg font-bold mb-1">{item.name}</h3>
          <p className="text-green-600 dark:text-green-400 font-semibold mb-1">₹{final}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Category: {item.category || 'N/A'}</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => onEdit(item)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded">Edit</button>
            <button onClick={() => onDelete(type, item.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded">Delete</button>
          </div>
        </div>
      );
    })}
  </div>
);

// Reusable OrderGrid Component

const OrderGrid = ({ orders, type, nested, onDelete, onComplete, onOrderClick, userMap, onStatusChange, showUserEmail }) => {
  const [statusMap, setStatusMap] = React.useState({});

  const handleSelectChange = (orderId, value) => {
    setStatusMap(prev => ({ ...prev, [orderId]: value }));
  };

  const handleChangeClick = (orderId, userId) => {
    if (statusMap[orderId]) {
      onStatusChange(type, orderId, userId, statusMap[orderId]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {orders.map(order => {
        const itemNames = order.items && order.items.length > 0
          ? order.items.map(item => item.name || item.title || 'Unnamed Item').join(', ')
          : 'No items';
        return (
          <div key={order.id} onClick={() => onOrderClick && onOrderClick(order)} className="bg-white dark:bg-gray-800 p-5 rounded shadow border cursor-pointer">
            <p><strong>Items:</strong> {itemNames}</p>
            <p><strong>Authenticated User Email:</strong> {userMap && order.userId ? userMap[order.userId] || order.userId : 'Unknown'}</p>
            <p><strong>Entered Email:</strong> {order.userEmail || 'N/A'}</p>
            <OrderStatusTracker status={order.status || 'Pending'} />
            <p><strong>Total:</strong> ₹{order.items?.reduce((sum, item) => sum + (item.price || 0), 0) || order.price || 0}</p>
            <div className="mt-3 flex flex-col gap-2">
              <select
                value={statusMap[order.id] || order.status || 'Pending'}
                onClick={e => e.stopPropagation()}
                onChange={e => handleSelectChange(order.id, e.target.value)}
                className="p-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleChangeClick(order.id, order.userId); }}
                  disabled={!statusMap[order.id] || statusMap[order.id] === order.status}
                  className="flex-1 bg-blue-600 text-white rounded py-1 disabled:opacity-50"
                >
                  Change
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(type, order.id, order.userId); }}
                  className="flex-1 bg-red-600 text-white rounded py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Admin;
