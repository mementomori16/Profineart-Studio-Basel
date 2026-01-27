import React, { useEffect, useRef } from 'react';
import './home.scss'; 
import WelcomeHero from '../WelcomeHero/WelcomeHero';
import VideoPage from '../VideoPage/VideoPage';
import Reviews from '../Reviews/Reviews';
import Text from '../Text/Text';
import TextReview from '../TextReview/TextReview';
import BaslerServiceArea from '../BaselServiceMap/BaselServiceMap';
import IconsHowItWorks from '../IconsHowItWorks/IconsHowItWorks';
import CourseTeaser from '../../CourseTeaser/CourseTeaser';

const Home: React.FC = () => {
    // Reference to the Text section
    const textSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.body.style.backgroundColor = '#171717';
        return () => {
            document.body.style.backgroundColor = ''; 
        };
    }, []);

    const handleScrollToNext = () => {
        if (textSectionRef.current) {
            textSectionRef.current.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start' 
            });
        }
    };

    return (
        <div className="homepage-wrapper">
            {/* Pass the scroll handler to the Hero component */}
            <WelcomeHero onArrowClick={handleScrollToNext} />
            
            {/* Wrapper around the target component to attach the Ref */}
            <div ref={textSectionRef}>
                <Text />
            </div>

            <VideoPage />
            <CourseTeaser />
            <IconsHowItWorks />
            <TextReview />
            <Reviews />
            <BaslerServiceArea />
        </div>
    );
};

export default Home;