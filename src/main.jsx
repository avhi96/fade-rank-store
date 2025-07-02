import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import { CartProvider } from './context/cartContext'; // ✅ Import this
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <DarkModeProvider>
      <AuthProvider>
        <CartProvider> {/* ✅ Wrap App with CartProvider */}
          <App />
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </CartProvider>
      </AuthProvider>
    </DarkModeProvider>
  </BrowserRouter>
);
