import React, { useState } from 'react';
import {
  FaEnvelope, FaDiscord, FaHeadset,
  FaTruck, FaMobileAlt, FaInstagram,
  FaFacebookF, FaYoutube,
} from 'react-icons/fa';

import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...form,
        createdAt: Timestamp.now(),
      });
      toast.success("Message sent successfully!");
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4 py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Get in Touch</h1>
          <p className="text-gray-600 dark:text-gray-400">Have questions or need support? We’re here for you.</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<FaEnvelope size={28} className="text-blue-600 dark:text-blue-400" />}
            title="Email Support"
            text="support@fade013.store"
            href="mailto:support@fade013.store"
          />
          <InfoCard
            icon={<FaDiscord size={28} className="text-indigo-600 dark:text-indigo-400" />}
            title="Join Discord"
            text="discord.gg/fade"
            href="https://discord.gg/Ktgv5esafd"
          />
          <InfoCard
            icon={<FaInstagram size={28} className="text-purple-600 dark:text-purple-400" />}
            title="Instagram"
            text="instagram.com/fade"
            href="https://www.instagram.com/fade_mart013/"
          />
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12">
          {/* Features */}
          <div className="space-y-6">
            <h1 className='text-xl font-semibold mb-4'>Why Choose Our Support?</h1>
            <Feature
              icon={<FaTruck />}
              title="All Over India Shipping"
              desc="Fast and secure delivery across India."
            />
            <Feature
              icon={<FaMobileAlt />}
              title="100% Online Store"
              desc="Fade runs fully online — shop anytime, from anywhere."
            />
            <Feature
              icon={<FaHeadset />}
              title="Customer Support"
              desc="Reach us through Email or Discord for support or queries."
            />
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Send a Message</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your Name"
                className="w-full border dark:border-gray-700 px-4 py-2 rounded bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring focus:ring-blue-200"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Your Email"
                className="w-full border dark:border-gray-700 px-4 py-2 rounded bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring focus:ring-blue-200"
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                placeholder="Your Message"
                rows="4"
                className="w-full border dark:border-gray-700 px-4 py-2 rounded resize-none bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring focus:ring-blue-200"
              />
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-10 fade-in">
          <h2 className="text-lg font-semibold mb-2">Follow Us</h2>
          <div className="flex justify-center gap-6 mt-4">
            <SocialIcon href="https://www.facebook.com/profile.php?id=61577757806514" Icon={FaFacebookF} color="blue" name="Facebook" />
            <SocialIcon href="https://www.youtube.com/@FadeNetwork013" Icon={FaYoutube} color="red" name="YouTube" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-6 text-sm">© 2025 Fade. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

// Hover-enhanced Info Card
const InfoCard = ({ icon, title, text, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-lg shadow transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg  flex flex-col items-center text-center"
  >
    <div className="mb-2">{icon}</div>
    <h3 className="font-bold">{title}</h3>
    <p className="text-sm">{text}</p>
  </a>
);

// Hover-enhanced Feature Card
const Feature = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg ">
    <div className="text-blue-600 dark:text-blue-400 text-xl mt-1">{icon}</div>
    <div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
    </div>
  </div>
);

// Social Icon Button
const SocialIcon = ({ href, Icon, color, name }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`text-${color}-600 dark:text-${color}-400 hover:scale-110 transform transition-all`}
    title={name}
  >
    <Icon size={26} />
  </a>
);

export default Contact;
