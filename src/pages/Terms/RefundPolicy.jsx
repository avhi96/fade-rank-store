import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen px-4 py-10 md:px-20 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-3xl font-bold text-center mb-6 border-b border-gray-300 pb-4 dark:border-gray-600">
          Cancellation and Refund Policy
        </h1>
        <p className="text-sm text-right mb-4 text-gray-500 dark:text-gray-400">
          Last Updated: July 21, 2025
        </p>

        <p className="mb-6">
          Fade believes in maintaining a customer-friendly approach and has therefore adopted a liberal cancellation and refund policy. The details are as follows:
        </p>

        <div className="space-y-6 text-sm leading-6">
          <div>
            <h2 className="font-semibold text-lg mb-1">1. Order Cancellation</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Cancellations are accepted only if requested within 7 days of placing the order.</li>
              <li>Cancellation requests may not be accepted if the order has already been processed, communicated to vendors/merchants, or shipped.</li>
              <li>Orders for perishable items (e.g., flowers, food items) are not eligible for cancellation.</li>
              <li>A refund or replacement will be issued if the customer can prove that the product delivered is of unsatisfactory quality.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">2. Damaged or Defective Products</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>If you receive a damaged or defective item, you must report it to our Customer Service Team within 7 days of delivery.</li>
              <li>Refunds or replacements will be processed only after the merchant/vendor verifies and confirms the defect.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">3. Product Not as Described</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>If the product delivered does not match its description or your expectations, you must inform our Customer Service Team within 7 days of receipt.</li>
              <li>After reviewing your complaint, our team will take the necessary action, which may include a refund or replacement.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">4. Warranty-Related Issues</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>For products covered under a manufacturer’s warranty, customers are requested to directly contact the manufacturer for claims or service.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">5. Refund Process</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Approved refunds will be processed within 3–4 business days and credited to the customer’s original payment method.</li>
              <li>Refund timelines may vary depending on the payment gateway or bank policies.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
