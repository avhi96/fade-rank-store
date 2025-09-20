import React, { useState, useEffect } from 'react';
import { FaCube, FaCheckCircle, FaCrown, FaRocket } from 'react-icons/fa';

const OrderProcessingAnimation = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { icon: FaCube, text: 'Processing Payment...', color: 'from-blue-500 to-cyan-500' },
    { icon: FaCrown, text: 'Activating Minecraft Rank...', color: 'from-yellow-500 to-orange-500' },
    { icon: FaRocket, text: 'Finalizing Order...', color: 'from-green-500 to-emerald-500' },
    { icon: FaCheckCircle, text: 'Order Complete!', color: 'from-green-600 to-emerald-600' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsComplete(true);
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentStep, steps.length, onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <div className={`w-1 h-1 bg-gradient-to-r ${steps[currentStep]?.color || 'from-blue-500 to-cyan-500'} rounded-full opacity-60`}></div>
            </div>
          ))}
        </div>

        {/* Ambient Lighting */}
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r ${steps[currentStep]?.color || 'from-blue-500 to-cyan-500'} opacity-10 rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r ${steps[currentStep]?.color || 'from-blue-500 to-cyan-500'} opacity-5 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Minecraft Cube Animation */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className={`absolute inset-0 bg-gradient-to-r ${steps[currentStep]?.color || 'from-blue-500 to-cyan-500'} rounded-lg animate-ping opacity-20`}></div>
            <div className={`relative w-20 h-20 bg-gradient-to-r ${steps[currentStep]?.color || 'from-blue-500 to-cyan-500'} rounded-lg flex items-center justify-center shadow-2xl transform transition-all duration-500 ${isComplete ? 'scale-110' : 'scale-100'}`}>
              {React.createElement(steps[currentStep]?.icon || FaCube, {
                className: `text-3xl text-white transition-all duration-500 ${isComplete ? 'animate-bounce' : ''}`
              })}
            </div>
          </div>
        </div>

        {/* Progress Text */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 transition-all duration-500">
            {steps[currentStep]?.text || 'Processing...'}
          </h2>
          
          {/* Progress Bar */}
          <div className="w-80 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${steps[currentStep]?.color || 'from-blue-500 to-cyan-500'} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          
          <p className="text-gray-400 mt-4 text-sm">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index <= currentStep 
                  ? `bg-gradient-to-r ${step.color} shadow-lg` 
                  : 'bg-gray-700'
              }`}
            ></div>
          ))}
        </div>

        {/* Completion Message */}
        {isComplete && (
          <div className="mt-8 animate-fade-in">
            <p className="text-green-400 font-semibold">
              Redirecting to order confirmation...
            </p>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OrderProcessingAnimation;
