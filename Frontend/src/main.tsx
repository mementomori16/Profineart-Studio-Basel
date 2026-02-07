import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from "./routes/router";
import "./global.scss";
import i18n from './i18n'; 
import { I18nextProvider } from 'react-i18next';
import { CartProvider } from './context/CartContext/CartContext'; 

// Note: HelmetProvider is currently disabled due to React 19 compatibility issues.
// SEO is currently handled via index.html static meta tags.

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* I18nextProvider ensures translations are available to the whole app */}
      <I18nextProvider i18n={i18n}>
        <CartProvider>
          {/* Suspense catches the loading state if i18n or routes are lazy-loaded */}
          <Suspense fallback={
            <div style={{ 
              backgroundColor: '#171717', 
              color: 'white', 
              height: '100vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontFamily: 'sans-serif'
            }}>
              Loading Studio...
            </div>
          }>
            <RouterProvider 
              router={router} 
              future={{ v7_startTransition: true }} 
            />
          </Suspense>
        </CartProvider>
      </I18nextProvider>
    </React.StrictMode>
  );
}

// --- PWA Service Worker Registration ---
// This enables the "Install App" functionality and offline capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        console.log('PWA Service Worker registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.error('PWA Service Worker registration failed:', err);
      });
  });
}