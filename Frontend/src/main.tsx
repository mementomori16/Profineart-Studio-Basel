import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from "./routes/router";
import "./global.scss";
import i18n from './i18n'; 
import { I18nextProvider } from 'react-i18next';
import { CartProvider } from './context/CartContext/CartContext'; 

/**
 * SENIOR ARCHITECTURE NOTE:
 * HelmetProvider is disabled to ensure React 19 stability. 
 * SEO is handled via index.html (static) and useSeo custom hook (dynamic).
 */

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <CartProvider>
          <Suspense fallback={
            <div style={{ 
              backgroundColor: '#171717', 
              color: 'white', 
              height: '100vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              {/* Keep this empty or a very light SVG to speed up initial paint */}
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

// --- PWA Service Worker Registration (Optimized) ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Senior Strategy: Delay PWA registration by 4 seconds.
    // This allows the Hero Image and YouTube API to claim 100% of the bandwidth first.
    setTimeout(() => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('PWA Ready (Backgrounded):', reg.scope);
        })
        .catch((err) => {
          console.error('PWA Registration Deferred Error:', err);
        });
    }, 4000); 
  });
}