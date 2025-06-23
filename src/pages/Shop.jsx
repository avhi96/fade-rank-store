import React, { useEffect } from 'react';

const Shop = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    script.onload = initShopifyBuyButton;
    document.body.appendChild(script);

    function initShopifyBuyButton() {
      if (window.ShopifyBuy && window.ShopifyBuy.UI) {
        loadComponent();
      }
    }

    function loadComponent() {
      const client = window.ShopifyBuy.buildClient({
        domain: 'your-store-name.myshopify.com', // 🔁 REPLACE
        storefrontAccessToken: 'your-storefront-access-token', // 🔁 REPLACE
      });

      window.ShopifyBuy.UI.onReady(client).then((ui) => {
        ui.createComponent('collection', {
          id: 'your-collection-id', // 🔁 REPLACE with your collection ID
          node: document.getElementById('collection-component'),
          moneyFormat: '₹{{amount}}',
          options: {
            product: {
              styles: {
                product: {
                  'border': '1px solid #e5e7eb',
                  'border-radius': '12px',
                  'box-shadow': '0 10px 20px rgba(0,0,0,0.06)',
                  'padding': '16px',
                  'margin-bottom': '20px',
                  'text-align': 'center',
                  'background-color': '#fff',
                },
                title: {
                  'font-size': '1.2rem',
                  'color': '#1f2937',
                },
                price: {
                  'font-weight': 'bold',
                  'color': '#10b981',
                },
                button: {
                  'background-color': '#2563eb',
                  'color': '#fff',
                  'padding': '10px 20px',
                  'border-radius': '8px',
                  'font-weight': 'bold',
                  ':hover': {
                    'background-color': '#1e40af',
                  },
                },
              },
              contents: {
                img: true,
                title: true,
                price: true,
                button: true,
              },
              text: {
                button: 'Buy Now',
              },
            },
            cart: {
              startOpen: false,
              styles: {
                button: {
                  'background-color': '#2563eb',
                },
              },
            },
            toggle: {
              styles: {
                toggle: {
                  'background-color': '#2563eb',
                },
              },
            },
          },
        });
      });
    }
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">🛍️ Shop</h1>
      <div id="collection-component" className="max-w-7xl mx-auto" />
    </div>

  );
};

export default Shop;
