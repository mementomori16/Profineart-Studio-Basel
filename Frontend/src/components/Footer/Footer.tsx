// src/components/Footer/Footer.tsx
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
        {/* Brand Column */}
        <div className="footer-column">
          <h4 className="footer-header">{t('footer.brandName')}</h4>
          <p className="footer-description">{t('footer.description')}</p>
        </div>

        {/* Navigation Column */}
        <div className="footer-column">
          <h4 className="footer-header">{t('footer.explore')}</h4>
          <ul className="footer-links">
            <li><Link to="/courses">{t('navbar.courses')}</Link></li>
            <li><Link to="/how-it-works">{t('navbar.howItWorks')}</Link></li>
            <li><Link to="/students-works">{t('navbar.studentsWorks')}</Link></li>
          </ul>
        </div>

        {/* Modern Contact Column (No Form) */}
        <div className="footer-column">
          <h4 className="footer-header">{t('contactPage.connectTitle')}</h4>
          <div className="footer-contact-item">
            <FaEnvelope className="footer-icon" />
            <a href={`mailto:${t('contactPage.contactEmail')}`}>
              {t('contactPage.contactEmail')}
            </a>
          </div>
          <p className="footer-subtext">{t('contactPage.imageCaption')}</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; 2012-2026 {t('footer.brandName')}. {t('footer.rights')} |
          <Link to="/legalinfo" className="footer-link"> {t('footer.legal')}</Link> |
          <Link to="/terms-of-use" className="footer-link"> {t('footer.terms')}</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;