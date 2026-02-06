import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from "./routes/router";
import "./global.scss";
import i18n from './i18n'; 
import { I18nextProvider } from 'react-i18next';
import { CartProvider } from './context/CartContext/CartContext'; 
import { HelmetProvider } from 'react-helmet-async'; 

// Fix for React 19 Type Mismatch
const HelmetProviderComponent = HelmetProvider as any;

ReactDOM.createRoot(document.getElementById("root")!).render(
 <React.StrictMode>
 <Suspense fallback={<div>Loading...</div>}>
 <I18nextProvider i18n={i18n}>
 <HelmetProviderComponent> {/* Use the casted component here */}
 <CartProvider> 
 <RouterProvider router={router} future={{ v7_startTransition: true }} />
 </CartProvider>
 </HelmetProviderComponent>
 </I18nextProvider>
 </Suspense>
 </React.StrictMode>
);