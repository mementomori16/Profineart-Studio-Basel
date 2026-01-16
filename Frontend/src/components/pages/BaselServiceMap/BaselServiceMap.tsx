import React from 'react';
import './baselServiceMap.scss';

const BaslerServiceArea: React.FC = () => {
    return (
        <section className="service-area-minimal">
            <div className="text-wrapper">
                {/* Your Mission Statement as the Lead */}
                <p className="description">
                    A mobile educational project providing high-level fine art education within your own environment. 
                    By traveling directly to your personal studio space, this structure ensures the learning process 
                    is fully integrated into your own creative setting.
                </p>

                {/* The "Geography" as a simple, elegant footer to the text */}
                <div className="area-footer">
                    <div className="country-group">
                        <span className="city">St. Louis</span>
                        <span className="code">FR</span>
                    </div>
                    
                    <div className="country-group main">
                        <span className="city">Basel & Region</span>
                        <span className="code">CH</span>
                    </div>

                    <div className="country-group">
                        <span className="city">Lörrach</span>
                        <span className="code">DE</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BaslerServiceArea;
