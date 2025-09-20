import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser, updateProfile } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaCamera, 
  FaSave, 
  FaTrash, 
  FaCube, 
  FaEdit,
  FaExclamationTriangle,
  FaTimes,
  FaUpload
} from 'react-icons/fa';

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
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            username: data.username || user.displayName || '',
            photoURL: data.photoURL || user.photoURL || ''
          });
          setImagePreview(data.photoURL || user.photoURL || '');
        } else {
          setForm({
            username: user.displayName || '',
            photoURL: user.photoURL || ''
          });
          setImagePreview(user.photoURL || '');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
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
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

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
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Upload failed');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      toast.error('Image upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (
      form.username === (user.displayName || '') &&
      (form.photoURL === '' || form.photoURL === (user.photoURL || ''))
    ) {
      toast('No changes to save.');
      return;
    }

    try {
      await updateProfile(user, {
        displayName: form.username,
        photoURL: form.photoURL || user.photoURL,
      });

      await updateDoc(doc(db, 'users', user.uid), {
        username: form.username,
        photoURL: form.photoURL || user.photoURL,
      });

      if (refreshUser) {
        await refreshUser();
      }
      
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      toast.success('Account deleted successfully');
      navigate('/signup');
    } catch (err) {
      console.error('Error deleting account:', err);
      toast.error('Failed to delete account. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="professional-card p-12 text-center">
            <FaCube className="text-6xl text-emerald-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Login Required</h2>
            <p className="text-xl text-gray-300">Please login to edit your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="professional-card p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Professional Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Professional Minecraft Badge */}
          <div className="animate-fade-in-down mb-8">
            <div className="inline-flex items-center gap-3 professional-card px-8 py-4 mb-8">
              <FaEdit className="text-emerald-400 text-xl" />
              <span className="text-lg font-bold text-white tracking-wide">Edit Profile</span>
            </div>
          </div>

          {/* Professional Hero Title */}
          <div className="animate-fade-in-up mb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-8">
              <span className="text-gradient bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                Update Your Profile
              </span>
            </h1>
          </div>

          {/* Professional Description */}
          <div className="animate-fade-in-up mb-16" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl sm:text-2xl font-semibold text-gray-200 mb-6 max-w-3xl mx-auto leading-relaxed">
              Customize your Minecraft profile and manage your account settings
            </p>
          </div>

        </div>
      </div>

      {/* Professional Edit Form Section */}
      <div className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          
          <div className="professional-card p-8">
            <form onSubmit={handleSave} className="space-y-8">
              
              {/* Profile Image Section */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 mx-auto mb-6 relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-emerald-500 shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center border-4 border-emerald-500 shadow-lg">
                        <FaUser className="text-4xl text-white" />
                      </div>
                    )}
                    
                    {/* Upload Button Overlay */}
                    <label className="absolute bottom-0 right-0 bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-all duration-200">
                      <FaCamera className="text-lg" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {uploading && (
                    <div className="flex items-center justify-center gap-2 text-emerald-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
                      <span className="text-sm font-medium">Uploading...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Username Input */}
              <div className="space-y-2">
                <label className="block text-white font-semibold text-lg flex items-center gap-2">
                  <FaUser className="text-emerald-400" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  className="w-full px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="w-full btn-primary hover-lift hover-glow flex items-center justify-center gap-3 text-lg py-4"
              >
                <FaSave className="text-xl" />
                Save Changes
              </button>
            </form>

            {/* Danger Zone */}
            <div className="mt-12 pt-8 border-t border-gray-700/50">
              <div className="professional-card p-6 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30">
                <h3 className="text-red-400 font-bold text-xl mb-4 flex items-center gap-3">
                  <FaExclamationTriangle className="text-2xl" />
                  Danger Zone
                </h3>
                <p className="text-gray-300 mb-6 text-lg">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <FaTrash className="text-xl" />
                  Delete My Account Permanently
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="professional-card w-full max-w-md">
            <div className="px-8 py-6 border-b border-gray-700/50 bg-gradient-to-r from-red-900/30 to-red-800/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <FaExclamationTriangle className="text-white text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Confirm Deletion</h2>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="professional-card p-6 mb-8 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20">
                <p className="text-gray-300 text-lg text-center leading-relaxed">
                  This action is <span className="text-red-400 font-bold">permanent</span> and cannot be undone. 
                  All your data, orders, and account information will be permanently deleted.
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 btn-secondary hover-lift flex items-center justify-center gap-2"
                >
                  <FaTimes />
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FaTrash />
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
