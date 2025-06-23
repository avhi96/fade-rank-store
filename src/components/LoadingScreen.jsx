import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white z-[9999] animate-fadeIn">
      <div className="text-center space-y-4">
        <div className="text-3xl sm:text-5xl font-extrabold tracking-widest glow-text">
          FadeMart
        </div>
        <p className="text-sm text-gray-300 animate-pulse">Loading, please wait...</p>
        <div className="loader mx-auto mt-4" />
      </div>
    </div>
  );
}
