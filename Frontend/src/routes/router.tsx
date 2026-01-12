// src/routes/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../../src/layouts/MainLayout"; 

// Component Imports
import Home from "../components/pages/Home/Home";
import About from "../components/pages/About/About";
import Contact from "../components/pages/Contact/Contact";
import CardPage from "../components/pages/Card/CardPage/CardPage";
import LegalInfo from "../components/pages/Attributions/Legal-info";
import Courses from "../components/pages/Courses/Courses";
import OrderPage from "../components/pages/OrderPage/OrderPage";
import SuccessPage from "../components/Order/SucsessPage.tsx/SuccessPage";
import Basket from "../components/pages/Cart/Basket/Basket";
import TermsOfUse from "../components/pages/TermsOfUse/TermsOfUse";
import HowItWorks from "../components/pages/HowitWorks/Pricing";
import StudentsWorks from "../components/pages/StudentsWorks/StudentsWorks";
import Testimonials from "../components/pages/Testimonials/Testimonials";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [

            // --- BASIC ROUTES ---
            { path: "/", element: <Home /> },
            { path: "home", element: <Navigate to="/" replace /> },
            { path: "about", element: <About /> },
            { path: "contact", element: <Contact /> },
            { path: "courses", element: <Courses /> },
            { path: "how-it-works", element: <HowItWorks /> },
            { path: "students-works", element: <StudentsWorks /> },
            { path: "legalinfo", element: <LegalInfo /> },
            { path: "terms-of-use", element: <TermsOfUse /> },
            { path: "testimonials", element: <Testimonials /> },
         

            // ---------------------------------------------------------
            // 🛒 *** FIXED ROUTE ORDER ***
            // Basket must be BEFORE card/:id to prevent route swallowing
            // ---------------------------------------------------------
            { path: "basket", element: <Basket /> },

            // PRODUCT PAGE (Dynamic Route)
            { path: "card/:id", element: <CardPage /> },

            // --- ORDER PROCESS ---
            { path: "order/:id", element: <OrderPage /> },
            { path: "order/success", element: <SuccessPage /> },
        ],
    },
]);

export default router;

