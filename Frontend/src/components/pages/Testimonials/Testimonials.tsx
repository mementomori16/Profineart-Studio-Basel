// src/components/pages/Testimonials/Testimonials.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import './testimonials.scss';

const Testimonials: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="cardPageContainer">
            <div className="cardContentWrapper">
                <h1 className="pageTitle">{t('testimonials.mainTitle')}</h1>
                <div className="testimonial-grid">
                    {[1, 2, 3].map((num) => (
                        <div className="testimonial-item" key={num}>
                            <p className="quote">{t(`testimonials.item${num}.text`)}</p>
                            <h5 className="author">- {t(`testimonials.item${num}.author`)}</h5>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Testimonials;