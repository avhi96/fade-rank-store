import React, { useState } from 'react';

const Terms = () => {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <div className="min-h-screen px-6 py-12 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Terms & Policies</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Please read our terms, privacy, and refund policies before using our services.
        </p>

        {/* Tab Buttons */}
        <div className="flex justify-center space-x-4 mb-10">
          {['terms', 'privacy', 'refund'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700'
              }`}
            >
              {tab === 'terms' && 'Terms of Service'}
              {tab === 'privacy' && 'Privacy Policy'}
              {tab === 'refund' && 'Refund Policy'}
            </button>
          ))}
        </div>

        {/* Terms of Service */}
        {activeTab === 'terms' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold"> Terms of Service</h2>
            <p><strong>Effective Date:</strong> June 26, 2025</p>

            <div>
              <h3 className="font-bold">1. Eligibility</h3>
              <p>You must be at least 13 years old to use our services.</p>
            </div>

            <div>
              <h3 className="font-bold">2. Services Offered</h3>
              <p>We provide physical products, digital products, and hosting services.</p>
            </div>

            <div>
              <h3 className="font-bold">3. Account Responsibility</h3>
              <p>You're responsible for maintaining your account credentials.</p>
            </div>

            <div>
              <h3 className="font-bold">4. Orders and Payments</h3>
              <p>Prices are in INR. Payments are handled by Razorpay, PayPal, or Stripe. Orders are processed after payment.</p>
            </div>

            <div>
              <h3 className="font-bold">5. Shipping & Delivery</h3>
              <p>Physical items are shipped to the address provided. Digital and hosting services are delivered within 24 hours.</p>
            </div>

            <div>
              <h3 className="font-bold">6. Acceptable Use</h3>
              <p>No illegal activities, DDoS tools, or pirated content allowed. Violators may be suspended without refund.</p>
            </div>

            <div>
              <h3 className="font-bold">7. Intellectual Property</h3>
              <p>All content is owned by Fade Store or its licensors and may not be reused.</p>
            </div>

            <div>
              <h3 className="font-bold">8. Liability Disclaimer</h3>
              <p>Services are provided “as is”. We are not responsible for indirect damages, data loss, or downtime.</p>
            </div>

            <div>
              <h3 className="font-bold">9. Termination</h3>
              <p>We may terminate access if terms are violated.</p>
            </div>

            <div>
              <h3 className="font-bold">10. Governing Law</h3>
              <p>These terms are governed by the laws of Punjab, India. Disputes will be handled in courts of Sangrur, Punjab.</p>
            </div>

            <p className="text-sm text-gray-400 dark:text-gray-500 text-right mt-8">Last updated: June 26, 2025</p>
          </div>
        )}

        {/* Privacy Policy */}
        {activeTab === 'privacy' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold"> Privacy Policy</h2>
            <p><strong>Effective Date:</strong> June 26, 2025</p>

            <div>
              <h3 className="font-bold">1. Information We Collect</h3>
              <ul className="list-disc list-inside">
                <li>Personal Data: name, email, phone</li>
                <li>Payment Data: via secure gateways (not stored)</li>
                <li>IP address, device/browser info</li>
                <li>Cookies for analytics and login sessions</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold">2. How We Use Your Info</h3>
              <ul className="list-disc list-inside">
                <li>To deliver services and support</li>
                <li>To improve performance</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold">3. Data Sharing</h3>
              <p>We do not sell your data. We may share it with payment gateways, hosting providers, and government agencies if legally required.</p>
            </div>

            <div>
              <h3 className="font-bold">4. Cookies & Tracking</h3>
              <p>Used to keep you logged in and track analytics. Disabling cookies may affect experience.</p>
            </div>

            <div>
              <h3 className="font-bold">5. Your Rights</h3>
              <p>Email <span className="text-blue-600 dark:text-blue-400">support@fade013.store</span> to request access, deletion, or corrections.</p>
            </div>

            <div>
              <h3 className="font-bold">6. Data Security</h3>
              <p>We protect your info using SSL encryption and firewall systems. Data is only kept as long as needed.</p>
            </div>

            <p className="text-sm text-gray-400 dark:text-gray-500 text-right mt-8">Last updated: June 26, 2025</p>
          </div>
        )}

        {/* Refund Policy */}
        {activeTab === 'refund' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold"> Refund Policy</h2>
            <p><strong>Effective Date:</strong> June 26, 2025</p>

            <div>
              <h3 className="font-bold">1. Physical Products</h3>
              <p>Refunds or replacements are only issued for damaged or incorrect items reported within 3 days. Return shipping may be required.</p>
            </div>

            <div>
              <h3 className="font-bold">2. Digital Products</h3>
              <p>Non-refundable once delivered. Please read descriptions carefully before buying.</p>
            </div>

            <div>
              <h3 className="font-bold">3. Hosting Services</h3>
              <p>Refunds available only within 48 hours if the service wasn’t delivered or was faulty from our side.</p>
            </div>

            <div>
              <h3 className="font-bold">4. Duplicate Transactions</h3>
              <p>We will fully refund accidental duplicate payments within 3–7 business days.</p>
            </div>

            <div>
              <h3 className="font-bold">5. Request a Refund</h3>
              <p>Email <span className="text-blue-600 dark:text-blue-400">support@fade013.store</span> with your order number, proof of payment, and issue description.</p>
            </div>

            <p className="text-sm text-gray-400 dark:text-gray-500 text-right mt-8">Last updated: June 26, 2025</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terms;
