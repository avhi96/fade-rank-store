import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Terms and Conditions
        </h1>
        <hr />
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 mt-5 text-end">
          Last Updated: <span className="font-medium text-gray-700 dark:text-gray-300">July 21, 2025</span>
        </p>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          For the purposes of these Terms and Conditions, the terms <strong>"we," "us," "our"</strong> refer to Fade,
          and <strong>"you," "your," "user," "visitor"</strong> refer to anyone visiting our website and/or purchasing from us.
        </p>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          By using our website and/or making a purchase from us, you agree to be bound by the following Terms and Conditions:
        </p>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">1. Website Content</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>1.1. The content of the pages on this website is subject to change without prior notice.</li>
              <li>1.2. We do not guarantee the accuracy, timeliness, performance, completeness, or suitability of the information and materials provided.</li>
              <li>1.3. We are not liable for any inaccuracies or errors to the fullest extent permitted by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">2. Use of Information and Materials</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>2.1. Use of any content or materials is at your own risk.</li>
              <li>2.2. Ensure products or services meet your personal requirements before use or purchase.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">3. Intellectual Property</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>3.1. The design, layout, look, and graphics are owned/licensed by us.</li>
              <li>3.2. Reproduction is prohibited except under copyright laws.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">4. Trademarks</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>4.1. All third-party trademarks are acknowledged on the site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">5. Unauthorized Use</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>5.1. Misuse of our materials may lead to legal claims or criminal offense.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">6. External Links</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>6.1. External links are for information only.</li>
              <li>6.2. We are not responsible for their content or accuracy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">7. Linking to Our Website</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>7.1. You must obtain written consent from Fade to link to our website.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">8. Governing Law</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>8.1. These terms are governed by the laws of India.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">9. Payment Authorization</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>9.1. We are not responsible for declined transactions due to exceeded limits.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
