import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser, updateProfile } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', photoURL: '' });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        const data = snap.data();
        setForm({
          username: data.username || user.displayName || '',
          photoURL: data.photoURL || user.photoURL || ''
        });
        setImagePreview(data.photoURL || user.photoURL || '');

        if (snap.exists()) {
          const data = snap.data();
          setForm({ username: data.username || '', photoURL: data.photoURL || '' });
          setImagePreview(data.photoURL || '');
        }
      } catch (err) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'fademart_unsigned');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/drzj15ztl/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setForm((prev) => ({ ...prev, photoURL: data.secure_url }));
        setImagePreview(data.secure_url);
        toast.success('Image uploaded!');
      } else {
        toast.error('Upload failed');
      }
    } catch (err) {
      toast.error('Image upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user, {
        displayName: form.username,
        photoURL: form.photoURL || user.photoURL,
      });

      await updateDoc(doc(db, 'users', user.uid), {
        username: form.username,
        photoURL: form.photoURL || user.photoURL,
      });

      await refreshUser();
      toast.success('Profile updated!');
      navigate('/profile');
    } catch (err) {
      toast.error('Failed to update profile');
    }

    if (
      form.username === user.displayName &&
      (form.photoURL === '' || form.photoURL === user.photoURL)
    ) {
      toast('No changes to save.');
      return;
    }

  };



  const handleDeleteAccount = async () => {
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      toast.success('Account deleted');
      navigate('/signup');
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  if (!user)
    return <p className="text-center mt-10 text-gray-500">Please login first.</p>;
  if (loading)
    return <p className="text-center mt-10 text-gray-400">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center justify-center text-center">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Profile"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-blue-500"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2 text-sm"
          />
          {uploading && (
            <p className="text-sm text-gray-400 mt-1">Uploading...</p>
          )}
        </div>

        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          required
          className="w-full px-4 py-2 border dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>

      {/* Delete Button */}
      <div className="mt-6">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
        >
          Delete My Account Permanently
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Confirm Account Deletion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
              This action is permanent and cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
