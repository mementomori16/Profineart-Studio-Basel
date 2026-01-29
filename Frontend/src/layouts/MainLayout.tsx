import { useEffect, useState } from "react";
// Removed useLocation from imports since we don't need to read it manually anymore
import { Outlet, ScrollRestoration } from "react-router-dom";
import NavDesktop from "../components/NavBar/NavDesktop/NavDesktop";
import NavMobile from "../components/NavBar/NavMobile/NavMobile";
import Footer from "../components/Footer/Footer";
import BackToTop from "../components/BacktoTopButton/BacktoTopButton";
import "./MainLayout.scss";
import CookieBanner from "../components/Cookies/Cookiebanner";

export default function MainLayout() {
  const [isMobile, setMobile] = useState<boolean>(window.innerWidth < 992);

  // 1. REMOVED: const location = useLocation(); 

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 992);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="app-container">
      {/* This handles all the scroll logic for you */}
      <ScrollRestoration />

      {isMobile ? <NavMobile /> : <NavDesktop />}

      <main className="main-content">
        <Outlet />
      </main>

      <BackToTop />
      <Footer />

      <CookieBanner /> 
    </div>
  );
}