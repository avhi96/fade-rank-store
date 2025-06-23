import React, { useState } from 'react';

const Terms = () => {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <div className="min-h-screen px-6 py-12 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-4">Terms of Service</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Please read these terms carefully before using our services.
        </p>

        {/* Tab Buttons */}
        <div className="flex justify-center space-x-4 mb-10">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              activeTab === 'terms'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('refund')}
            className={`px-5 py-2 rounded-lg font-semibold transition ${
              activeTab === 'refund'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700'
            }`}
          >
            Refund Policy
          </button>
        </div>

        {/* Terms Content */}
        {activeTab === 'terms' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6 border border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-lg font-bold mb-1">1. Acceptance of Terms</h2>
              <p>
                By using this website or placing an order, you agree to Fade Terms of Service and all applicable laws and regulations.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-1">2. Digital Products</h2>
              <p>
                All digital items (e.g. game plugins, bots, tools) are delivered instantly or within 24 hours after payment. These items are non-refundable once delivered.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-1">3. Physical Products</h2>
              <p>
                For items shipped physically (like merchandise or print-on-demand goods), orders will be processed via our partner platforms or vendors. Estimated delivery times and shipping charges will be mentioned on the product page. Tracking may be provided based on the carrier.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-1">4. Shopify Integration</h2>
              <p>
                Our storefront is partially powered by Shopify for enhanced product listings and secure checkout. All purchases made through Shopify are subject to Shopify’s standard terms. We only sell verified products and handle customer support directly.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-1">5. Payments</h2>
              <p>
                We use Razorpay and other secure gateways for payment processing. We do not store or collect your credit/debit card information on our servers.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-1">6. User Responsibilities</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Use the platform legally and responsibly.</li>
                <li>Do not share or resell products without permission.</li>
                <li>Provide valid and up-to-date contact and payment details.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-1">7. Intellectual Property</h2>
              <p>
                All content, tools, products, and branding on Fade are protected by copyright, trademark, and other intellectual property laws.
              </p>
            </div>

            <p className="text-sm text-gray-400 dark:text-gray-500 text-right mt-8">Last updated: June 2025</p>
          </div>
        )}

        {/* Refund Policy */}
        {activeTab === 'refund' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-2">Refund Policy</h2>
            <p>
              Fade follows a strict refund policy based on the type of product purchased:
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Digital Goods:</strong> Non-refundable once delivered or downloaded.
              </li>
              <li>
                <strong>Physical Products:</strong> Refunds or exchanges are only available for defective or damaged items. You must contact us within 3 days of delivery.
              </li>
              <li>
                <strong>Duplicate Payments:</strong> If you accidentally paid twice for the same item, we will refund the extra charge.
              </li>
            </ul>

            <p className="mt-4">
              To request a refund, email us at{' '}
              <span className="text-blue-600 dark:text-blue-400">fademart@maio.io</span> with your order ID and issue description.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terms;
