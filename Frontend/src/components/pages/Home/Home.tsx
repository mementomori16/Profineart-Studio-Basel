// src/pages/Home/Home.tsx
import React from 'react';
import Courses from '../Courses/Courses';
import WelcomeHero from '../WelcomeHero/WelcomeHero';

const Home: React.FC = () => {
    return (
        <div className="homepage-wrapper">
            <WelcomeHero />
            <Courses />
        </div>
    );
};

export default Home;