import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const q = query(
        collection(db, 'notifications'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const notifs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notifs);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">📬 Admin Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map(notif => (
          <div key={notif.id} className="bg-white dark:bg-gray-800 p-4 border rounded mb-4 shadow">
            <p className="font-semibold">{notif.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">{notif.message}</p>
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
