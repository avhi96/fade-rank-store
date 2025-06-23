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

      await fetch("https://discord.com/api/webhooks/XXX", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [{
            title: "🆕 New Order Placed",
            color: 0x00ff00,
            fields: [
              { name: "👤 User", value: user.email, inline: true },
              { name: "🛠 Service", value: selectedService.title, inline: true },
              { name: "💰 Price", value: `₹${selectedService.price}`, inline: true }
            ],
            timestamp: new Date().toISOString()
          }]
        })
      });

      await emailjs.send(
        'service_q2wb6k2',
        'template_n6cpaob',
        {
          email: user.email,
          serviceTitle: selectedService.title,
          price: selectedService.price,
          createdAt: new Date().toLocaleString(),
        },
        'hI2EUteiBLFHcEEof'
      );

      toast.success(`Order placed for: ${selectedService.title}`);
      setSelectedService(null);
    } catch (err) {
      console.error("Order save failed:", err);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const premiumServices = services.slice(0, 3);
  const additionalServices = services.slice(3);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Pricing Plans
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-12">
          Choose the perfect plan for your server management needs
        </p>

        {/* Premium Cards */}
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 mb-20">
          {premiumServices.map((service, index) => (
            <div
              key={service.id}
              className={`relative group flex flex-col justify-between text-center 
              bg-white dark:bg-gray-800 border rounded-2xl shadow-md dark:border-gray-700 
              transition transform hover:scale-105 duration-300 p-6 w-full max-w-sm`}
            >
              {index === 1 && (
                <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full uppercase font-bold">
                  Recommended
                </span>
              )}
              <div className="mb-4 flex justify-center text-4xl">{service.icon}</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{service.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 my-2">{service.description}</p>
              <div className="text-3xl font-bold text-blue-600 my-4 transition-all duration-300 group-hover:text-blue-500 group-hover:drop-shadow-[0_0_12px_#3b82f6]">
                ₹{service.price}
              </div>
              <button
                onClick={() => handleOrderClick(service)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        {additionalServices.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Additional Services</h2>
            <div className="space-y-4 max-w-6xl mx-auto text-left">
              {additionalServices.map((service, index) => (
                <div
                  key={service.id}
                  className="group flex justify-between items-center bg-white dark:bg-gray-800 px-4 py-3 border dark:border-gray-700 rounded-lg transition hover:shadow-md hover:border-blue-500 hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl text-blue-600">{service.icon}</div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 dark:text-white">{service.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{service.description}</p>
                      <span className="text-blue-600 font-bold transition-all duration-300 group-hover:text-blue-500 group-hover:drop-shadow-[0_0_12px_#3b82f6]">
                        ₹{service.price}
                      </span>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleOrderClick(service)}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Contact CTA */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-10">
          Need something custom?{' '}
          <span
            className="text-blue-600 dark:text-blue-400 underline cursor-pointer"
            onClick={() => navigate('/contact')}
          >
            Contact us
          </span>
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
