"use client";
import { useEffect, useState } from "react";
import "./CookieBanner.scss";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <p>We use cookies to improve your experience.</p>
      <div className="cookie-buttons">
        <button className="btn-accept" onClick={handleAccept}>Accept</button>
        <button className="btn-decline" onClick={handleDecline}>Decline</button>
      </div>
    </div>
  );
}

