import React from 'react';

const Shipping = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
                    Shipping and Delivery Policy
                </h1>
                <hr />
                <p className="text-sm text-gray-500 dark:text-gray-400 text-end mt-3 mb-6">
                    Last Updated: July 21, 2025
                </p>

                <div className="space-y-6 text-gray-700 dark:text-gray-300 text-base">
                    <p>
                        For international buyers, orders are shipped and delivered through registered international courier
                        companies and/or international speed post only. For domestic buyers, orders are shipped through
                        registered domestic courier companies and/or speed post only.
                    </p>

                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">1. Shipping Timeline</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>
                                Orders are typically shipped within 0–7 business days or as per the delivery date agreed upon at
                                the time of order confirmation, subject to the norms of the courier company or postal authorities.
                            </li>
                            <li>
                                Fade guarantees to hand over the consignment to the courier company or postal authorities within
                                the mentioned timeline (0–7 days from the date of order and payment) or as per the mutually agreed
                                delivery date.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">2. Delivery Responsibility</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>
                                Fade is not liable for delays caused by courier companies or postal authorities once the consignment is handed over to them.
                            </li>
                            <li>
                                Delivery of all orders will be made to the address provided by the buyer at the time of order placement.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">3. Service Confirmation</h2>
                        <p>
                            Delivery or activation of services (for digital or hosting services) will be confirmed via the email ID provided during registration.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">4. Customer Support</h2>
                        <p>
                            For any issues related to shipping, delivery, or service usage, you may contact our helpdesk at:
                        </p>
                        <ul className="mt-2 ml-4">
                            <li>📞 Phone: <a href="tel:+918789785951" className="text-blue-600 dark:text-blue-400 hover:underline">+91 8789785951</a></li>
                            <li>📧 Email: <a href="mailto:fade@mail.io" className="text-blue-600 dark:text-blue-400 hover:underline">fade@mail.io</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
