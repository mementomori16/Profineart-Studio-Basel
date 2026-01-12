// src/pages/Home/Home.tsx
import React from 'react';
import Courses from '../Courses/Courses';
import WelcomeHero from '../WelcomeHero/WelcomeHero';
import Testimonials from '../Testimonials/Testimonials';

const Home: React.FC = () => {
    return (
        <div className="homepage-wrapper">
            <WelcomeHero />
            <Courses />
            <Testimonials />
        </div>
    );
};

export default Home;