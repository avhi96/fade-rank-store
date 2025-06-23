import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { FaBell } from 'react-icons/fa';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const q = query(
          collection(db, 'notifications'),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const notifs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(notifs);
      } catch (err) {
        console.error("Failed to load notifications:", err);
        setError("Something went wrong while fetching notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaBell /> Admin Notifications
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading notifications...</p>
      ) : error ? (
        <p className="text-red-600 dark:text-red-400">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">📭 No notifications yet.</p>
      ) : (
        notifications.map(notif => (
          <div key={notif.id} className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded mb-4 shadow-sm">
            <p className="font-semibold text-lg">{notif.title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{notif.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              {notif.createdAt?.toDate().toLocaleString() || "Unknown time"}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminNotifications;
