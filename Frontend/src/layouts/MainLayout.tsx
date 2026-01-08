// src/layouts/MainLayout.tsx
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavDesktop from "../components/NavBar/NavDesktop/NavDesktop";
import NavMobile from "../components/NavBar/NavMobile/NavMobile";
import Footer from "../components/Footer/Footer";
import BackToTop from "../components/BacktoTopButton/BacktoTopButton";
import "./MainLayout.scss";
import CookieBanner from "../components/Cookies/Cookiebanner";

export default function MainLayout() {
  const [isMobile, setMobile] = useState<boolean>(window.innerWidth < 992);
  const location = useLocation();

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="app-container">
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
