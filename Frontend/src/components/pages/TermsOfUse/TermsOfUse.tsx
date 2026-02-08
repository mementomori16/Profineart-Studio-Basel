import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './termsOfUse.scss';

const TermsOfUse: React.FC = () => {
    const { t } = useTranslation();
    const sections = Array.from({ length: 9 }, (_, i) => i + 1);

    useEffect(() => {
        // Syncing background color with LegalInfo/StudentsWorks
        document.body.style.backgroundColor = '#171717'; 
        return () => { document.body.style.backgroundColor = ''; };
    }, []);

    return (
        <div className="legal-page-root">
            <div className="container">
                <header className="legal-page-header">
                    <h2>{t('termsPage.mainTitle')}</h2>
                </header>

                <div className="legal-content-stack">
                    {sections.map((num) => (
                        <section className="legal-stack-item" key={num}>
                            <div className="item-text">
                                <h3>{num}. {t(`termsPage.section${num}.title`)}</h3>
                                <div className="legal-body">
                                    <p>{t(`termsPage.section${num}.text`)}</p>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;