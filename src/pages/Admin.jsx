import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection, getDocs, addDoc,
  serverTimestamp, deleteDoc, doc
} from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { useAuth, isAdmin } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth(); // ✅ Correct place for hook
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

  if (!isAdmin(user)) {
    return (
      <div className="text-center py-20 text-red-600 dark:text-red-400 text-xl font-semibold">
        🔒 Access Denied: Admins Only
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded shadow transition-colors">
      {/* rest of your component */}
      {/* This part is unchanged and good to go */}
    </div>
  );
};

export default Admin;
