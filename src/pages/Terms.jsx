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
              className={`px-5 py-2 rounded-lg font-semibold transition ${activeTab === tab
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
              <p>We provide physical products. All orders will be delivered within 3-4 working days</p>
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
              <p>Physical items are shipped to the address provided.</p>
            </div>
            <div>
              <h3 className="font-bold">6. Acceptable Use</h3>
              <p>No illegal activities, DDoS tools, or pirated content allowed. Violators may be suspended without refund.</p>
            </div>
            <div>
              <h3 className="font-bold">7. Intellectual Property</h3>
              <p>All content is owned by Fade or its licensors and may not be reused.</p>
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

        {/* Updated Privacy Policy */}
        {activeTab === 'privacy' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold"> Privacy Policy</h2>
            <p><strong>Effective Date:</strong> June 26, 2025</p>

            <div>
              <h3 className="font-bold">1. Information We Collect</h3>
              <ul className="list-disc list-inside">
                <li><strong>Personal Information:</strong> Name, Email, Phone number</li>
                <li><strong>Payment Information:</strong> Payments processed securely via Razorpay, Stripe, PayPal. No card or bank info is stored.</li>
                <li><strong>Device & Usage Data:</strong> IP address, browser/device, pages visited, time spent</li>
                <li><strong>Cookies & Tracking:</strong> For login sessions and analytics (e.g., Google Analytics)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold">2. How We Use Your Information</h3>
              <ul className="list-disc list-inside">
                <li>To deliver products and services</li>
                <li>To provide customer support</li>
                <li>To process and confirm payments</li>
                <li>To improve our website performance and security</li>
                <li>To comply with legal and financial regulations</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold">3. Sharing of Information</h3>
              <p>We do not sell or rent your personal data. We may share it with:</p>
              <ul className="list-disc list-inside">
                <li>Trusted Third Parties: Payment gateways, hosting services, fraud prevention systems</li>
                <li>Government Agencies: Only when legally required or in case of fraud, misuse, or investigation</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold">4. Cookies and Tracking</h3>
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside">
                <li>Keep you logged in</li>
                <li>Remember your preferences</li>
                <li>Analyze site traffic</li>
              </ul>
              <p>You can disable cookies, but doing so may affect your user experience.</p>
            </div>

            <div>
              <h3 className="font-bold">5. Your Rights</h3>
              <ul className="list-disc list-inside">
                <li>Access your personal data</li>
                <li>Correct or update inaccurate information</li>
                <li>Request deletion of your data (where legally allowed)</li>
              </ul>
              <p>Contact: <a href="mailto:support@fade013.store" className="text-blue-500">support@fade013.store</a> for any requests.</p>
            </div>

            <div>
              <h3 className="font-bold">6. Data Security</h3>
              <ul className="list-disc list-inside">
                <li>SSL encryption</li>
                <li>Secure server infrastructure</li>
                <li>Regular vulnerability monitoring</li>
                <li>Role-based access control for staff</li>
              </ul>
              <p>While we take reasonable precautions, no method of transmission over the internet is 100% secure.</p>
            </div>

            <div>
              <h3 className="font-bold">7. Data Retention</h3>
              <p>We retain your data:</p>
              <ul className="list-disc list-inside">
                <li>For as long as needed to provide services</li>
                <li>For accounting, tax, or legal compliance</li>
              </ul>
              <p>You may request early deletion if no longer necessary.</p>
            </div>

            <div>
              <h3 className="font-bold">8. Consent</h3>
              <p>By using our services, you consent to:</p>
              <ul className="list-disc list-inside">
                <li>This privacy policy</li>
                <li>Our use of third-party processors (e.g., payment gateways)</li>
                <li>International data transfer if required by services like cloud hosting</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold">9. Changes to Policy</h3>
              <p>We may update this policy from time to time. Major changes will be announced via email or website notification.</p>
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
              <p>If you receive a damaged or defective product, please contact us within 24 hours.We have 7 days refund policy We will arrange a re-delivery, exchange, or replacement within 5–7 working days.</p>
            </div>
            <div>
              <h3 className="font-bold">2. Products</h3>
              <p>Due to the digital nature of the product and instant access to the source code, all sales are final and non-refundable once the bot or license key has been delivered or accessed.</p>
            </div>
            <div>
              <h3 className="font-bold">4. Duplicate Transactions</h3>
              <p>We will fully refund accidental duplicate payments within 3–7 business days.</p>
            </div>
            <div>
              <h3 className="font-bold">5. Request a Refund</h3>
              <p>Email <a href="mailto:support@fade013.store" className="text-blue-600 dark:text-blue-400">support@fade013.store</a> with your order number, proof of payment, and a description of the issue. Once your refund is approved, the amount will be credited to your bank account within 5–7 working days.
              </p>
            </div>

            <p className="text-sm text-gray-400 dark:text-gray-500 text-right mt-8">Last updated: June 26, 2025</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terms;
