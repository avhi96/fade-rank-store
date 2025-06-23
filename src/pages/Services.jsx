// src/pages/Services.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import emailjs from 'emailjs-com';
import services from '../data/services';

const Services = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOrderClick = (service) => {
    if (!user) {
      navigate('/login', { state: { from: location } });
    } else {
      setSelectedService(service);
    }
  };

  const confirmOrder = async () => {
    if (!selectedService || !user) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'orders'), {
        userid: user.uid,
        email: user.email,
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        price: selectedService.price,
        createdAt: serverTimestamp(),
      });

      await fetch("https://discord.com/api/webhooks/1386632879911473163/jUXgwn-YBRvpM03kGc9-yvvOFGJbkEkexqL6XFLdrr8oEc3tjNqmN7J7k0Ci1w8W0Vdr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: "🆕 New Order Placed",
              color: 0x00ff00,
              fields: [
                { name: "👤 User", value: user.email, inline: true },
                { name: "🛠 Service", value: selectedService.title, inline: true },
                { name: "💰 Price", value: `₹${selectedService.price}`, inline: true }
              ],
              timestamp: new Date().toISOString()
            }
          ]
        })
      });

      emailjs.send(
        'service_q2wb6k2',
        'template_n6cpaob',
        {
          email: user.email,
          serviceTitle: selectedService.title,
          price: selectedService.price,
          createdAt: new Date().toLocaleString(),
        },
        'hI2EUteiBLFHcEEof'
      ).then(() => {
        console.log("✅ Email sent to admin");
      }).catch((err) => {
        console.error("❌ EmailJS Error:", err);
      });

      toast.success(`Order placed for: ${selectedService.title}`);
      setSelectedService(null);
    } catch (err) {
      console.error("❌ Order save failed:", err);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Choose Your Service
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-12">
          Affordable pricing. Fast delivery. Full support.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-xl hover:border-blue-500 hover:scale-105 transition-all duration-300 ease-in-out transform flex flex-col items-center text-center group"
            >
              <div className="mb-4">{service.icon}</div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                {service.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-4">{service.description}</p>
              <div className="text-2xl font-bold text-blue-600 mb-4">₹{service.price}+</div>
              <button
                onClick={() => handleOrderClick(service)}
                className="mt-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Place Order
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-10">
          Need something custom?{" "}
          <span
            className="text-blue-600 dark:text-blue-400 underline cursor-pointer"
            onClick={() => navigate('/contact')}
          >
            Contact us
          </span>{" "}
          for a quote.
        </p>
      </div>

      {/* Confirmation Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md text-center shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Confirm Your Order
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Place order for <span className="font-bold">{selectedService.title}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmOrder}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                {loading ? 'Placing...' : 'Yes, Place Order'}
              </button>
              <button
                onClick={() => setSelectedService(null)}
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

export default Services;
