import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import emailjs from 'emailjs-com';
import { FaRobot, FaServer, FaGlobe } from 'react-icons/fa';

const Services = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);

  const services = [
    {
      id: 'discord-bot',
      title: 'Custom Discord Bots',
      features: [
        'Complete bot development with commands, moderation, music, economy & custom utilities.',

        '🤖 Included Features  ',
        '• 🛡️ Powerful Moderation  ',
        '• 🔧 Auto Moderation  ',
        '• 🧰 Admin Configuration  ',
        '• 🔍 Information Gathering  ',
        '• 🎵 Music System  ',
        '• 💰 Economy & Ranking  ',
        '• 🧱 Setup Automation  ',
        '• 🛠️ Utility Commands & Tools  ',
        '• 🎉 Giveaways System  ',
        '• 🎫 Ticket System  ',
        '• 📊 Stats Tracking  ',
        '• 💡 Suggestions Module  ',
        '• 🖼️ Image Tools  ',
        '• 🎮 Fun & Entertainment  ',

        '📩 Accepting Custom Orders  ',
        '💸 Price Range: ₹299 – ₹3,999',

      ],
      price: 299,
      icon: <FaRobot className="text-4xl text-blue-500" />,
    },
    {
      id: 'minecraft-server',
      title: 'Minecraft Server Setup',
      features: [
        'Complete server setup with all major game modes, premium plugins, maps & full configuration.',

        '💠 Included Modes',
        '• 🏰 Lobby ',
        '• 🔗 BungeeCord ',
        '• 🌍 Survival ',
        '• ⚡ Velocity Proxy',
        '• 🥊 Box PvP ',
        '• ⚔️ Kit PvP ',
        '• ☁️ SkyWars',
        '• 🛏️ BedWars',
        '• ❤️ Lifesteal',
        '• 🌌 SkyBlock',
        '• 💀 HeadSteal',
        '• 🔮 Crystal PvP',
        '• ➕ And Many More...',

        '🔧 Java & Bedrock Compatible',
        '🎯 Fully Customizable on Request',

        '💸 Price Range: ₹599 – ₹3, 999',
      ],
      price: 599,
      icon: <FaServer className="text-4xl text-green-500" />,
    },
    {
      id: 'website-dev',
      title: 'Website Creation',
      features: [
        'Modern, responsive websites tailored for business, portfolios, personal use & e - commerce needs.',

        '🌐 Site Types  ',
        '• 👨‍💼 Portfolio & Personal Sites  ',
        '• 🏢 Business & Landing Pages  ',
        '• 🛒 E - commerce & Storefronts  ',
        '• 📖 Blogs & Article Platforms  ',
        '• 🎮 Game or Project Showcases  ',

        '⚡ Key Features  ',
        '• 📱 Mobile - Responsive & Fast  ',
        '• 🔐 Secure Backend & Auth  ',
        '• 🔍 SEO & Analytics Ready  ',
        '• 🧠 Admin Panel or CMS Optional ',
        '• 🎨 Full Custom Design Support  ',

        '💸 Price Range: ₹499 – ₹5, 999',

      ],
      price: 499,
      icon: <FaGlobe className="text-4xl text-purple-500" />,
    },
  ];

  const additionalServices = [
    {
      id: 'custom-ai-tools',
      icon: '🧠',
      title: 'Custom AI Tools',
      description: 'Caption generators, chatbots, APIs, and more.',
      price: '₹1199',
    },
    {
      id: 'game-hosting',
      icon: '🎮',
      title: 'Game Hosting Support',
      description: 'Help with server setup for Minecraft, FiveM, Rust.',
      price: '₹299',
    },
    {
      id: 'ui-ux-design',
      icon: '🎨',
      title: 'UI/UX Design',
      description: 'Modern, mobile-first design via Figma or direct code.',
      price: '₹599',
    },
  ];


  const confirmOrder = async () => {
    if (!selectedService || !user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        email: user.email,
        name: user.displayName || "Unknown",
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        price: selectedService.price,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      await fetch("https://discord.com/api/webhooks/1386632879911473163/jUXgwn-YBRvpM03kGc9-yvvOFGJbkEkexqL6XFLdrr8oEc3tjNqmN7J7k0Ci1w8W0Vdr", {
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
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Pricing Plans</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
          Choose the perfect plan for your server, bot, or website.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`relative flex flex-col justify-between rounded-xl p-6 shadow-lg min-h-[580px] transition ${index === 1
                  ? 'order-first md:order-none hover:scale-[1.05] cursor-pointer border border-blue-500 dark:border-blue-400 hover:dark:border-purple-400 z-10'
                  : 'hover:scale-[1.04] cursor-pointer hover:border hover:border-purple-500 dark:hover:border-purple-400'
                } bg-gray-100 dark:bg-gray-800`}
            >

              {/* Icon with Recommended Tag */}
              <div className="relative flex justify-center mb-4">
                {service.icon}
                {index === 1 && (
                  <div className="absolute -top-10 px-3 py-2 bg-purple-600 text-white text-xs font-bold rounded-full shadow-md">
                    Recommended
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-semibold text-center mb-4">{service.title}</h2>

              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2 mb-6 flex-grow">
                {service.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <div className="mt-auto text-center">
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">₹{service.price}</p>
                <button
                  onClick={() => setSelectedService(service)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}

        </div>

        <h2 className="text-3xl font-bold text-center mb-4">Additional Services</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Enhance your experience with add-on services
        </p>

        <div className="space-y-4">
          {additionalServices.map((s, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm transition cursor-pointer cursor-pointer hover:border hover:border-purple-500 dark:hover:border-purple-400 hover:scale-[1.04]"
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">{s.icon}</div>
                <div>
                  <h3 className="text-md font-semibold">{s.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{s.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-600 dark:text-blue-400 font-bold mb-1">{s.price}</p>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm"
                  onClick={() =>
                    setSelectedService({
                      id: s.id,
                      title: s.title,
                      price: parseInt(s.price.replace(/[^\d]/g, ''), 10),
                    })
                  }
                >
                  Get Started
                </button>

              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-10">
          Need something custom?{' '}
          <span
            className="text-blue-600 dark:text-blue-400 underline cursor-pointer"
            onClick={() => navigate('/contact')}
          >
            Contact us
          </span>
        </p>
      </div>

      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#161b22] rounded-lg p-6 w-full max-w-md text-center shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Your Order</h3>
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
