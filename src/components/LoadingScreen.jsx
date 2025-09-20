import React from 'react';
import { FaCube } from 'react-icons/fa';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-[9999] animate-fadeIn">
      <div className="text-center space-y-4">
        {/* Simple Minecraft Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-16 minecraft-card-grass flex items-center justify-center animate-bounce">
            <FaCube className="text-white text-2xl" />
          </div>
        </div>
        
        <div className="text-4xl sm:text-5xl font-black text-minecraft-title">
          FADE
        </div>
        
        {/* Simple Loading Text */}
        <p className="text-lg text-minecraft-muted animate-pulse">
          Loading, please wait...
        </p>
        
        {/* Minecraft Style Loader */}
        <div className="flex justify-center">
          <div className="w-8 h-8 minecraft-block bg-green-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
