import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './legal-info.scss'; 

const LegalInfo: React.FC = () => {
    const { t } = useTranslation();
    const sections = Array.from({ length: 11 }, (_, i) => i + 1);

    useEffect(() => {
        // Matching background with StudentsWorks and TermsOfUse
        document.body.style.backgroundColor = '#171717'; 
        return () => { document.body.style.backgroundColor = ''; };
    }, []);

    return (
        <div className="legal-page-root">
            <div className="container">
                <header className="legal-page-header">
                    <h2>{t('legalPage.mainTitle')}</h2>
                </header>

                <div className="legal-content-stack">
                    {sections.map((num) => (
                        <section className="legal-stack-item" key={num}>
                            <div className="item-text">
                                <h3>{num}. {t(`legalPage.privacyPolicy.section${num}.title`)}</h3>
                                <div className="legal-body">
                                    <p>{t(`legalPage.privacyPolicy.section${num}.text`)}</p>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LegalInfo;