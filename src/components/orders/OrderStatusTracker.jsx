import React from 'react';

const OrderStatusTracker = ({ status }) => {
  const steps = ['Pending', 'Processing', 'Shipped', 'Completed'];
  const currentStep = steps.indexOf(status);

  return (
    <div className="flex items-center gap-2 text-xs">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-4 h-4 rounded-full ${
              i <= currentStep ? 'bg-green-500' : 'bg-gray-300'
            }`}
          ></div>
          {i < steps.length - 1 && (
            <div className={`w-6 h-1 ${i < currentStep ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          )}
        </div>
      ))}
      <span className="ml-2 font-medium text-gray-600 dark:text-gray-300">{status}</span>
    </div>
  );
};

export default OrderStatusTracker;