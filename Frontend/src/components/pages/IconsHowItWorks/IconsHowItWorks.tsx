import React from 'react';
import { FaList, FaRegCreditCard, FaRegComments, FaPalette } from 'react-icons/fa';
import './iconsHowItWorks.scss';

const IconsHowItWorks: React.FC = () => {
    return (
        <section className="how-it-works-section">
            <div className="container">
                <header className="section-header">
                    {/* Consistent Title with Reviews Component */}
                    <h2 className="how-main-title">How It Works</h2>
                </header>

                <div className="how-flow-container">
                    <div className="flow-step">
                        <div className="step-icon-box">
                            <FaList className="step-icon" />
                            <div className="step-number">1</div>
                        </div>
                        <h4 className="step-title">Choose Course</h4>
                        <p className="step-desc">Pick your preferred fine art subject from the catalog.</p>
                    </div>

                    <div className="flow-arrow">→</div>

                    <div className="flow-step">
                        <div className="step-icon-box">
                            <FaRegCreditCard className="step-icon" />
                            <div className="step-number">2</div>
                        </div>
                        <h4 className="step-title">Book & Pay</h4>
                        <p className="step-desc">Select format, amount, date, time, and your studio address.</p>
                    </div>

                    <div className="flow-arrow">→</div>

                    <div className="flow-step">
                        <div className="step-icon-box">
                            <FaRegComments className="step-icon" />
                            <div className="step-number">3</div>
                        </div>
                        <h4 className="step-title">Contact</h4>
                        <p className="step-desc">Instructor will contact you to advise on session preparation.</p>
                    </div>

                    <div className="flow-arrow">→</div>

                    <div className="flow-step">
                        <div className="step-icon-box">
                            <FaPalette className="step-icon" />
                            <div className="step-number">4</div>
                        </div>
                        <h4 className="step-title">Studio Session</h4>
                        <p className="step-desc">Instructor travels to your studio at the booked day and time.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IconsHowItWorks;