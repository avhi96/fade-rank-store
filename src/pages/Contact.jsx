import React, { useState } from 'react';
import { 
  FaEnvelope, 
  FaCube, 
  FaDiscord, 
  FaPhone, 
  FaClock, 
  FaMapMarkerAlt, 
  FaHeadset, 
  FaQuestionCircle,
  FaShieldAlt,
  FaCreditCard,
  FaServer,
  FaUsers,
  FaPaperPlane,
  FaCheckCircle
} from 'react-icons/fa';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const Contact = () => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    subject: '',
    category: 'general',
    message: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save to Firebase
      await addDoc(collection(db, 'contactMessages'), {
        ...form,
        createdAt: Timestamp.now(),
      });

      // Send to Discord webhook
      const webhookUrl = 'https://discordapp.com/api/webhooks/1418606148797464767/ifUqOdiHqJqmIq_T1gQxiFsvVq4KcVCECEfYTLkcr1aRtDDmXAyC03gYJzn1ZBD4b_n1';
      
      const discordEmbed = {
        embeds: [{
          title: "🎮 New Contact Form Submission",
          color: 0x00ff00, // Green color
          fields: [
            {
              name: "👤 Name",
              value: form.name,
              inline: true
            },
            {
              name: "📧 Email",
              value: form.email,
              inline: true
            },
            {
              name: "📝 Subject",
              value: form.subject,
              inline: false
            },
            {
              name: "🏷️ Category",
              value: form.category.charAt(0).toUpperCase() + form.category.slice(1),
              inline: true
            },
            {
              name: "💬 Message",
              value: form.message.length > 1000 ? form.message.substring(0, 1000) + "..." : form.message,
              inline: false
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Fade Store Contact Form"
          }
        }]
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordEmbed)
      });

      toast.success("Message sent successfully! We'll get back to you within 24 hours.");
      setForm({ name: '', email: '', subject: '', category: 'general', message: '' });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: <FaDiscord className="text-2xl" />,
      title: "Discord Support",
      description: "Join our Discord server for instant help",
      contact: "discord.gg/fade",
      link: "https://discord.gg/ZZBSErJj6u",
      color: "from-indigo-500 to-purple-600",
      available: "24/7 Community Support"
    },
    {
      icon: <FaEnvelope className="text-2xl" />,
      title: "Email Support",
      description: "Send us an email for detailed assistance",
      contact: "fade013@mail.io",
      color: "from-blue-500 to-cyan-600",
      available: "Response within 24 hours"
    }
  ];

  const supportCategories = [
    {
      icon: <FaCreditCard className="text-xl" />,
      title: "Payment Issues",
      description: "Problems with purchases or refunds"
    },
    {
      icon: <FaServer className="text-xl" />,
      title: "Server Access",
      description: "Can't access your purchased rank"
    },
    {
      icon: <FaShieldAlt className="text-xl" />,
      title: "Account Security",
      description: "Account safety and security concerns"
    },
    {
      icon: <FaQuestionCircle className="text-xl" />,
      title: "General Questions",
      description: "General inquiries about our services"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col py-12 px-4">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Professional Header */}
        <div className="text-center mb-16 animate-fade-in-down">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-400 px-8 py-4 rounded-full font-semibold mb-8 backdrop-blur-sm">
            <FaHeadset className="text-xl" />
            <span className="text-lg">24/7 Customer Support</span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl font-black leading-tight mb-6">
            <span className="text-gradient bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Need help with your Minecraft ranks or have questions? Our dedicated support team is here to assist you every step of the way.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>Average response time: 2 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>99.9% customer satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>Expert Minecraft support</span>
            </div>
          </div>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {contactMethods.map((method, index) => (
            <div 
              key={index}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {method.link ? (
                <a 
                  href={method.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="professional-card hover-lift p-8 text-center h-full cursor-pointer">
                    <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <div className="text-white">
                        {method.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">{method.title}</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">{method.description}</p>
                    
                    <div className="space-y-2">
                      <p className="text-blue-400 font-semibold group-hover:text-blue-300 transition-colors duration-200">{method.contact}</p>
                      <p className="text-sm text-gray-400">{method.available}</p>
                    </div>
                  </div>
                </a>
              ) : (
                <div className="professional-card hover-lift p-8 text-center h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <div className="text-white">
                      {method.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{method.title}</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">{method.description}</p>
                  
                  <div className="space-y-2">
                    <p className="text-blue-400 font-semibold">{method.contact}</p>
                    <p className="text-sm text-gray-400">{method.available}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Contact Form */}
          <div className="animate-fade-in-up">
            <div className="professional-card p-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FaPaperPlane className="text-2xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Send us a Message</h2>
                <p className="text-gray-300">Fill out the form below and we'll get back to you as soon as possible</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Your Name *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="Brief description of your inquiry"
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 text-white"
                    style={{
                      colorScheme: 'dark'
                    }}
                  >
                    <option value="general" className="bg-gray-800 text-white">General Questions</option>
                    <option value="payment" className="bg-gray-800 text-white">Payment Issues</option>
                    <option value="server" className="bg-gray-800 text-white">Server Access</option>
                    <option value="account" className="bg-gray-800 text-white">Account Security</option>
                    <option value="technical" className="bg-gray-800 text-white">Technical Support</option>
                    <option value="refund" className="bg-gray-800 text-white">Refund Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    placeholder="Please provide as much detail as possible about your inquiry..."
                    rows="6"
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200 text-white placeholder-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
                >
                  <FaPaperPlane className={loading ? 'animate-pulse' : ''} />
                  {loading ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Support Categories & Info */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            
            {/* Support Categories */}
            <div className="professional-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaQuestionCircle className="text-blue-500" />
                Common Support Topics
              </h3>
              
              <div className="space-y-4">
                {supportCategories.map((category, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors duration-200 group cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <div className="text-blue-400">
                        {category.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{category.title}</h4>
                      <p className="text-sm text-gray-400">{category.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="professional-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaClock className="text-emerald-500" />
                Support Hours
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">Monday - Friday</span>
                  <span className="text-white font-semibold">9:00 AM - 6:00 PM EST</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">Saturday</span>
                  <span className="text-white font-semibold">10:00 AM - 4:00 PM EST</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">Sunday</span>
                  <span className="text-orange-400 font-semibold">Limited Support</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300">Emergency Support</span>
                  <span className="text-green-400 font-semibold">24/7 Available</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
