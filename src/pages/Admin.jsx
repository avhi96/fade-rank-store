import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection, getDocs, addDoc,
  serverTimestamp, deleteDoc, doc
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const Admin = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    mainImageURL: '',
    otherImageURLs: '',
  });

  const [mainImageFile, setMainImageFile] = useState(null);
  const [otherImageFiles, setOtherImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const CLOUD_NAME = 'drzj15ztl';
  const UPLOAD_PRESET = 'fademart_unsigned';

  const fetchItems = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: data,
    });

    const json = await res.json();

    if (!json.secure_url) throw new Error("Image upload failed");
    return json.secure_url;
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Product deleted!');
      fetchItems();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error('Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let mainImage = formData.mainImageURL.trim();
      if (!mainImage && mainImageFile) {
        mainImage = await uploadToCloudinary(mainImageFile);
      }

      if (!mainImage) {
        toast.error('Upload or enter main image');
        setUploading(false);
        return;
      }

      const uploadedOtherImages = [];
      for (const file of otherImageFiles) {
        const url = await uploadToCloudinary(file);
        uploadedOtherImages.push(url);
      }

      const textURLs = formData.otherImageURLs
        .split(',')
        .map(url => url.trim())
        .filter(Boolean);

      const newProduct = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        image: mainImage,
        images: [...uploadedOtherImages, ...textURLs],
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'products'), newProduct);
      toast.success('Product uploaded!');
      setFormData({
        name: '', description: '', price: '', mainImageURL: '', otherImageURLs: '',
      });
      setMainImageFile(null);
      setOtherImageFiles([]);
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded shadow transition-colors">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700 dark:text-blue-400">
        📦 Product Admin Panel
      </h1>

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
            className="p-2 border dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white rounded focus:outline-none focus:ring"
          />
          <input
            type="number"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            required
            className="p-2 border dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white rounded focus:outline-none focus:ring"
          />
        </div>

        <textarea
          placeholder="Product Description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          required
          rows="3"
          className="p-2 border dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white rounded focus:outline-none focus:ring"
        />

        {/* Image Upload */}
        <div>
          <label className="block font-semibold mb-1">Main Image (Upload or URL)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainImageFile(e.target.files[0])}
            className="w-full mb-2 text-sm"
          />
          <input
            type="url"
            placeholder="Optional: Main Image URL"
            value={formData.mainImageURL}
            onChange={e => setFormData({ ...formData, mainImageURL: e.target.value })}
            className="p-2 border dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white rounded w-full"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Other Images (upload or comma URLs)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setOtherImageFiles([...e.target.files])}
            className="w-full mb-2 text-sm"
          />
          <input
            type="text"
            placeholder="Comma-separated image URLs"
            value={formData.otherImageURLs}
            onChange={e => setFormData({ ...formData, otherImageURLs: e.target.value })}
            className="p-2 border dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white rounded w-full"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className={`bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
            uploading && 'opacity-50 cursor-not-allowed'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Product'}
        </button>
      </form>

      {/* Uploaded Items */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-800 dark:text-gray-200">
        🧾 Uploaded Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow p-4 relative group transition">
            <img
              src={item.image || '/fallback.jpg'}
              alt={item.name}
              className="h-36 w-full object-cover rounded mb-3"
            />
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">₹{item.price}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{item.description}</p>

            <button
              onClick={() => {
                if (confirm("Delete this product?")) handleDelete(item.id);
              }}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 text-xs rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
