// src/components/pages/TermsOfUse/TermsOfUse.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './termsOfUse.scss';

const TermsOfUse: React.FC = () => {
  const { t } = useTranslation();

  // Array to map the 9 sections from translation.json
  const sections = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="cardPageContainer">
      <div className="cardContentWrapper">
        <div className="cardHeader">
          <h1 className="pageTitle">{t('termsPage.mainTitle')}</h1>
        </div>

        <div className="terms-body-content">
          {sections.map((num) => (
            <div className="terms-section" key={num}>
              <p className="section-text">
                <span className="section-number">{num}. </span>
                <span className="section-title">{t(`termsPage.section${num}.title`)}</span>
                <br />
                {t(`termsPage.section${num}.text`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;