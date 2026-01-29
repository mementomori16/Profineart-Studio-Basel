import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This runs EVERY time the URL changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; 
};

export default ScrollToTop;