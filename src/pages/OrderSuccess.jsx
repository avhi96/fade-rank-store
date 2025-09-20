import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaCopy, 
  FaDownload, 
  FaDiscord, 
  FaHome, 
  FaShoppingBag,
  FaGift,
  FaCrown,
  FaRocket,
  FaCreditCard,
  FaServer,
  FaCheck,
  FaCube
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import OrderProcessingAnimation from '../components/OrderProcessingAnimation';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check for order data immediately - prevent direct URL access
  const orderData = location.state?.orderData || JSON.parse(localStorage.getItem('lastOrder') || 'null');
  
  // Block rendering if no order data
  if (!orderData) {
    toast.error('No order data found. Please complete a purchase first.');
    navigate('/products');
    return null;
  }

  const [showProcessingAnimation, setShowProcessingAnimation] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [processingSteps, setProcessingSteps] = useState([
    { id: 1, title: 'Payment Confirmed', description: 'Your payment has been successfully processed and confirmed. You\'ll receive an email receipt shortly.', status: 'loading', icon: FaCreditCard },
    { id: 2, title: 'Rank Provisioned', description: 'Your Minecraft rank has been automatically set up and is now active in your account.', status: 'pending', icon: FaCrown },
    { id: 3, title: 'Ready to Use', description: 'Access your Minecraft server to enjoy your new rank privileges and exclusive features.', status: 'pending', icon: FaRocket }
  ]);

  const handleAnimationComplete = () => {
    setShowProcessingAnimation(false);
    
    // Trigger success animations and processing steps after processing animation
    setTimeout(() => setShowConfetti(true), 500);
    setTimeout(() => setAnimationStep(1), 800);
    setTimeout(() => setAnimationStep(2), 1200);
    setTimeout(() => setAnimationStep(3), 1600);

    // Simulate processing steps with realistic timing
    setTimeout(() => {
      setProcessingSteps(prev => prev.map(step => 
        step.id === 1 ? { ...step, status: 'completed' } : step
      ));
    }, 2000);

    setTimeout(() => {
      setProcessingSteps(prev => prev.map(step => 
        step.id === 2 ? { ...step, status: 'loading' } : step
      ));
    }, 2500);

    setTimeout(() => {
      setProcessingSteps(prev => prev.map(step => 
        step.id === 2 ? { ...step, status: 'completed' } : step
      ));
    }, 4000);

    setTimeout(() => {
      setProcessingSteps(prev => prev.map(step => 
        step.id === 3 ? { ...step, status: 'loading' } : step
      ));
    }, 4500);

    setTimeout(() => {
      setProcessingSteps(prev => prev.map(step => 
        step.id === 3 ? { ...step, status: 'completed' } : step
      ));
    }, 6000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', {
      icon: '📋',
      style: {
        background: '#374151',
        color: 'white',
      }
    });
  };

  const downloadOrderDetails = () => {
    if (!orderData) return;
    
    const orderText = `
FADE STORE - ORDER CONFIRMATION
═══════════════════════════════════════

ORDER DETAILS
Order ID: order_${orderData.paymentId}
Product: ${orderData.productName}
Price: ₹${orderData.price}
Status: ${orderData.status}
Date: ${new Date(orderData.createdAt).toLocaleString()}

CUSTOMER INFORMATION
Email: ${orderData.userEmail}
Minecraft Username: ${orderData.minecraftUsername}
Discord Username: ${orderData.discordUsername || 'Not provided'}

MINECRAFT RANK CODE
${orderData.assignedCode ? `Your Code: ${orderData.assignedCode}` : 'Manual activation required - Contact admin'}

NEXT STEPS
1. Join our Discord server: https://discord.gg/P9FMyM5C
2. ${orderData.assignedCode ? 'Use the code above to claim your Minecraft rank' : 'Contact admin for manual rank activation'}
3. Enjoy your new Minecraft rank privileges!

Thank you for choosing FADE Store!
    `;
    
    const blob = new Blob([orderText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FADE-Order-${orderData.paymentId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Order details downloaded!', {
      icon: '📥',
      style: {
        background: '#374151',
        color: 'white',
      }
    });
  };

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show processing animation first
  if (showProcessingAnimation) {
    return <OrderProcessingAnimation onComplete={handleAnimationComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Professional Midnight Header */}
          <div className={`text-center mb-12 transform transition-all duration-1000 ${animationStep >= 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full shadow-2xl shadow-green-500/25">
                <FaCheckCircle className="text-3xl text-white" />
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white drop-shadow-lg">
              Order Confirmed
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Your order has been successfully processed.
            </p>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            
            {/* Left Column - Order Details */}
            <div className={`transform transition-all duration-1000 delay-300 ${animationStep >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-lg border border-gray-700/50 shadow-2xl shadow-black/25 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/25">
                      <FaShoppingBag className="text-white text-sm" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Order Details</h2>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-green-400 mb-1">ORDER ID</p>
                      <p className="text-sm font-mono text-white bg-black/50 px-3 py-2 rounded border border-gray-700/30">
                        order_{orderData.paymentId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-400 mb-1">AMOUNT</p>
                      <p className="text-2xl font-bold text-green-400">₹{orderData.price}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-purple-400 mb-1">PRODUCT</p>
                      <p className="text-sm font-semibold text-white">{orderData.productName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-cyan-400 mb-1">DATE & TIME</p>
                      <p className="text-sm text-gray-300">
                        {new Date(orderData.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-yellow-400 mb-1">MINECRAFT USERNAME</p>
                    <p className="text-sm font-semibold text-white">{orderData.minecraftUsername}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-orange-400 mb-1">PAYMENT ID</p>
                    <p className="text-sm font-mono text-white bg-black/50 px-3 py-2 rounded border border-gray-700/30">
                      {orderData.paymentId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-lg border border-green-500/30 shadow-xl shadow-green-500/10 p-4 hover:border-green-400/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
                      <FaCheck className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Payment Secured</h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300">
                    Your payment has been processed securely.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-lg border border-blue-500/30 shadow-xl shadow-blue-500/10 p-4 hover:border-blue-400/50 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <FaServer className="text-white text-sm" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Rank Activated</h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300">
                    Your Minecraft rank is ready to use.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Processing Steps & Discord Code */}
            <div className="space-y-6">
              
              {/* Processing Steps */}
              <div className={`transform transition-all duration-1000 delay-500 ${animationStep >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-lg border border-gray-700/50 shadow-2xl shadow-black/25 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                    <h2 className="text-xl font-semibold text-white">Processing Status</h2>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {processingSteps.map((step, index) => {
                      const IconComponent = step.icon;
                      return (
                        <div key={step.id} className="flex items-start gap-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700/20 hover:bg-gray-800/50 transition-all duration-300">
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                              step.status === 'completed' 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/25' 
                                : step.status === 'loading'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 animate-pulse shadow-blue-500/25'
                                : 'bg-gray-600 shadow-gray-600/25'
                            }`}>
                              {step.status === 'completed' ? (
                                <FaCheck className="text-white text-sm" />
                              ) : (
                                <IconComponent className="text-white text-sm" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${
                                step.status === 'completed' ? 'bg-green-500 text-white shadow-green-500/25' : 'bg-gray-600 text-gray-300 shadow-gray-600/25'
                              }`}>
                                {step.id}
                              </span>
                              <h4 className="font-semibold text-white text-sm">{step.title}</h4>
                              {step.status === 'completed' && (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30 font-medium">
                                  Completed
                                </span>
                              )}
                              {step.status === 'loading' && (
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30 animate-pulse font-medium">
                                  Processing...
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-300">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Discord Code Section */}
              {orderData.assignedCode && (
                <div className={`transform transition-all duration-1000 delay-700 ${animationStep >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-lg border border-purple-500/30 shadow-2xl shadow-purple-500/10 overflow-hidden hover:border-purple-400/50 transition-all duration-300">
                    <div className="px-6 py-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-indigo-900/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
                          <FaCube className="text-white text-sm" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Minecraft Rank Code</h2>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="bg-black/50 rounded-lg p-4 border border-purple-500/20 mb-4 shadow-inner">
                        <div className="flex items-center justify-between">
                          <code className="text-lg font-mono font-bold text-purple-300 tracking-wider">
                            {orderData.assignedCode}
                          </code>
                          <button
                            onClick={() => copyToClipboard(orderData.assignedCode)}
                            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/25 text-sm font-medium"
                          >
                            <FaCopy className="text-sm" />
                            Copy
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-lg p-4">
                        <h4 className="text-purple-300 font-semibold mb-3 flex items-center gap-2 text-sm">
                          <FaGift className="animate-bounce" />
                          How to use your code:
                        </h4>
                        <ol className="text-gray-300 text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                            <span>Join our Minecraft server</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                            <span>Go to the #rank-codes channel</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                            <span>Type: <code className="bg-black/50 px-2 py-1 rounded text-xs font-mono text-purple-300 border border-purple-500/20">/redeem {orderData.assignedCode}</code></span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                            <span>Enjoy your new rank privileges!</span>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={downloadOrderDetails}
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors"
            >
              <FaDownload />
              Download Receipt
            </button>

            <a
              href="https://discord.gg/9KUjJQRm9e"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors"
            >
              <FaDiscord />
              Join Discord
            </a>

            <Link
              to="/products"
              className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors"
            >
              <FaShoppingBag />
              Shop More
            </Link>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <FaHome />
              Back to Home
            </Link>
          </div>

        </div>
      </div>

      {/* Minimal Animation Styles */}
      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        
        .animate-confetti {
          animation: confetti 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;
