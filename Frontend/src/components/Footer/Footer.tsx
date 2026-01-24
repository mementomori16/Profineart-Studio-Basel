import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa'; 
import './footer.scss'; 

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Column 1: Brand/Logo Area */}
        <div className="footer-column">
          <h4 className="footer-header">{t('home.welcomeHero.companyName')}</h4>
          <p className="footer-description">{t('home.welcomeHero.serviceTitle')}</p>
        </div>

        {/* Column 2: Internal Navigation */}
        <div className="footer-column">
          <h4 className="footer-header">{t('footer.explore')}</h4>
          <ul className="footer-links">
            <li><Link to="/courses" className="footer-nav-link">{t('home.courses')}</Link></li>
            <li><Link to="/how-it-works" className="footer-nav-link">{t('home.howItWorks')}</Link></li>
            <li><Link to="/students-works" className="footer-nav-link">{t('home.studentsWorks')}</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="footer-column">
          <h4 className="footer-header">{t('home.contact')}</h4>
          <div className="footer-contact-item">
            <FaEnvelope className="footer-icon" />
            <a href="mailto:info@profineart.ch" className="footer-nav-link">
              info@profineart.ch
            </a>
          </div>
          <Link to="/about" className="footer-nav-link about-link">
            {t('home.about')}
          </Link>
        </div>

        {/* Column 4: Trust & Payments */}
        <div className="footer-column">
          <h4 className="footer-header">{t('footer.payments', 'Secure Payments')}</h4>
          <div className="footer-stripe-info">
            <FaLock className="footer-icon-lock" />
            <span>Processed by <strong>Stripe</strong></span>
          </div>
          <div className="footer-payment-icons">
             <span className="payment-badge">TWINT</span>
             <span className="payment-badge">Visa</span>
             <span className="payment-badge">Mastercard</span>
             <span className="payment-badge">Apple Pay</span>
             <span className="payment-badge">Google Pay</span>
             <span className="payment-badge">Klarna</span>
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