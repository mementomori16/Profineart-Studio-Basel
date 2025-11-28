// src/routes/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../../src/layouts/MainLayout"; // Import the new MainLayout component

import Home from "../components/pages/Home/Home";
import About from "../components/pages/About/About";
import Contact from "../components/pages/Contact/Contact";
import Services from "../components/pages/ServicesPage/Services";
import CardPage from "../components/pages/Card/CardPage/CardPage";
import LegalInfo from "../components/pages/Attributions/Legal-info";
import Cv from "../components/pages/CV/Cv";
import Courses from "../components/pages/Courses/Courses";
import OrderPage from "../components/pages/OrderPage/OrderPage";
import SuccessPage from "../components/Order/SucsessPage.tsx/SuccessPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, 
    children: [
     
      { path: "/", element: <Home /> }, 
      
      { path: "home", element: <Navigate to="/" replace /> }, 
      
      { path: "about", element: <About /> },
      { path: "courses", element: <Courses /> },
      { path: "services", element: <Services /> },
      { path: "card", element: <CardPage /> },
      { path: "card/:id", element: <CardPage /> },
      { path: "contact", element: <Contact /> },
      { path: "legalinfo", element: <LegalInfo /> },
      { path: "cv", element: <Cv /> },

      { path: "order/success", element: <SuccessPage /> }, // Success page route
      { path: "order/:id", element: <OrderPage /> }  
    ],      
  },
]);

export default router;
