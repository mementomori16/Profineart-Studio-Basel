import React from 'react';
import { useTranslation } from 'react-i18next';
import './textReview.scss';

const TextReview: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="text-review-centered">
            <div className="container">
                <div className="text-layout">
                    <div className="review-wrapper">
                        <p className="review-quote">
                            "{t('textReview.quote')}"
                        </p>
                        <div className="review-attribution">
                            <span className="name">{t('textReview.author')}</span>
                            <span className="divider">|</span>
                            <span className="role">{t('textReview.role')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TextReview;