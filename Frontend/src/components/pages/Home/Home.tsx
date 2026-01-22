import React, { useEffect } from 'react';
import './home.scss'; 
import WelcomeHero from '../WelcomeHero/WelcomeHero';
import VideoPage from '../VideoPage/VideoPage';
import Reviews from '../Reviews/Reviews';
import Text from '../Text/Text';
import TextReview from '../TextReview/TextReview';
import BaslerServiceArea from '../BaselServiceMap/BaselServiceMap';
import IconsHowItWorks from '../IconsHowItWorks/IconsHowItWorks';

const Home: React.FC = () => {
    useEffect(() => {
        // When the Home page loads, make the body dark
        document.body.style.backgroundColor = '#171717';

        // When leaving the Home page, reset it to the global color
        return () => {
            document.body.style.backgroundColor = ''; 
        };
    }, []);

    return (
        <div className="homepage-wrapper">
            <WelcomeHero />
            <Text />
            <VideoPage />
            <IconsHowItWorks />
            <TextReview />
            <Reviews />
            <BaslerServiceArea />
            
        </div>
    );
};

export default Home;