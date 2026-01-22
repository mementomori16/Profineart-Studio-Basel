import React, { useState, useEffect } from 'react';
import './backtoTop.scss';

const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const toggleVisibility = () => {
        // Appears only after scrolling 2 full screen heights
        if (window.pageYOffset > window.innerHeight * 2) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        setIsClicked(true);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setTimeout(() => setIsClicked(false), 300);
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div
            className={`back-to-top-minimal ${isVisible ? 'visible' : ''} ${isClicked ? 'clicked' : ''}`}
            onClick={scrollToTop}
            role="button"
            aria-label="Scroll to top"
        >
            <span className="arrow-icon">↑</span>
        </div>
    );
};

export default BackToTop;