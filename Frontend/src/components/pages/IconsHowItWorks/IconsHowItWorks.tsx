import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaList, FaRegCreditCard, FaRegComments, FaPalette } from 'react-icons/fa';
import './iconsHowItWorks.scss';

// Map keys to their respective icons
const stepIcons: Record<string, React.ElementType> = {
    'step1': FaList,
    'step2': FaRegCreditCard,
    'step3': FaRegComments,
    'step4': FaPalette
};

const IconsHowItWorks: React.FC = () => {
    const { t } = useTranslation();
    const stepKeys = ['step1', 'step2', 'step3', 'step4'];

    return (
        <section className="how-it-works-section">
            <div className="container">
                <header className="section-header">
                    <h2 className="how-main-title">{t('howItWorks.mainTitle')}</h2>
                </header>

                <div className="how-flow-container">
                    {stepKeys.map((key, index) => {
                        const Icon = stepIcons[key];
                        
                        return (
                            <React.Fragment key={key}>
                                <div className="flow-step">
                                    <div className="step-icon-box">
                                        {Icon && <Icon className="step-icon" />}
                                        <div className="step-number">{index + 1}</div>
                                    </div>
                                    <h4 className="step-title">{t(`howItWorks.${key}.title`)}</h4>
                                    <p className="step-desc">{t(`howItWorks.${key}.desc`)}</p>
                                </div>
                                
                                {index < stepKeys.length - 1 && (
                                    <div className="flow-arrow">→</div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default IconsHowItWorks;