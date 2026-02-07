import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock, FaDownload } from 'react-icons/fa'; 
import './footer.scss'; 

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  const paymentMethods = t('footer.paymentMethods', { returnObjects: true }) as string[];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4 className="footer-header">{t('home.welcomeHero.companyName')}</h4>
          <p className="footer-description">{t('home.welcomeHero.serviceTitle')}</p>
        </div>

        <div className="footer-column">
          <h4 className="footer-header">{t('footer.explore')}</h4>
          <ul className="footer-links">
            <li><Link to="/courses" className="footer-nav-link">{t('home.courses')}</Link></li>
            <li><Link to="/how-it-works" className="footer-nav-link">{t('home.howItWorks')}</Link></li>
            <li><Link to="/students-works" className="footer-nav-link">{t('home.studentsWorks')}</Link></li>
            {/* PWA Install Link */}
            {installPrompt && (
              <li>
                <button onClick={handleInstallClick} className="footer-pwa-button">
                  <FaDownload className="pwa-icon" /> {t('footer.installApp')}
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-header">{t('home.contact')}</h4>
          <div className="footer-contact-item">
            <FaEnvelope className="footer-icon" />
            <a href="mailto:info@profineart.ch" className="footer-nav-link">info@profineart.ch</a>
          </div>
          <Link to="/about" className="footer-nav-link about-link">{t('home.about')}</Link>
        </div>

        <div className="footer-column">
          <h4 className="footer-header">{t('footer.payments')}</h4>
          <div className="footer-stripe-info">
            <FaLock className="footer-icon-lock" />
            <span>{t('footer.processedBy')} <strong>Stripe</strong></span>
          </div>
          <div className="footer-payment-icons">
             {Array.isArray(paymentMethods) && paymentMethods.map((method) => (
               <span key={method} className="payment-badge">{method}</span>
             ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="footer-copyright">
            &copy; 2012-2026 {t('home.welcomeHero.companyName')}. {t('footer.rights')}
          </p>
          <div className="footer-legal-section">
            <div className="footer-legal-links">
              <Link to="/legalinfo" className="footer-bottom-link">{t('footer.legal')}</Link>
              <span className="footer-separator">|</span>
              <Link to="/terms-of-use" className="footer-bottom-link">{t('footer.terms')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;