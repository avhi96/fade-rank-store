import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const LikedItems = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [likedItems, setLikedItems] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchLikedItems = async () => {
      try {
        const ref = collection(db, 'users', user.uid, 'likedItems');
        const snap = await getDocs(ref);
        const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLikedItems(items);
      } catch (err) {
        console.error('Error fetching liked items:', err);
        toast.error('Failed to load liked items');
      }
    };

    fetchLikedItems();
  }, [user]);

  const handleRemove = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'likedItems', itemId));
      setLikedItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Item removed from likes');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  if (!user) {
    return <p className="text-center mt-20 text-gray-600 dark:text-gray-300">Please login to see liked items.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 text-gray-800 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-6">❤️ Your Liked Items</h2>

      {likedItems.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">You haven't liked any items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {likedItems.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition hover:shadow-md"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-contain rounded cursor-pointer hover:opacity-90 transition"
                onClick={() => navigate(`/${item.type || 'products'}/${item.id}`)}
              />
              <h3 className="mt-2 font-semibold text-gray-800 dark:text-white truncate">
                {item.name}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">₹{item.price}</p>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => navigate(`/${item.type || 'products'}/${item.id}`)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1"
                >
                  <FaTrashAlt /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedItems;
