import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import './footer.scss'; 

const Footer: React.FC = () => {
  const { t } = useTranslation();

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
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-header">{t('home.contact')}</h4>
          <div className="footer-contact-item">
            <FaEnvelope className="footer-icon" />
            <a href="mailto:info@profineart.ch" className="footer-nav-link">
              info@profineart.ch
            </a>
          </div>
          {/* Changed this to a Link to make it clickable */}
          <Link to="/about" className="footer-nav-link about-link">
            {t('home.about')}
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; 2012-2026 {t('home.welcomeHero.companyName')}. {t('footer.rights')} |
          <Link to="/legalinfo" className="footer-bottom-link"> {t('footer.legal')}</Link> |
          <Link to="/terms-of-use" className="footer-bottom-link"> {t('footer.terms')}</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;