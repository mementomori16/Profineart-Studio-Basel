// src/pages/Home/Home.tsx
import React from 'react';
import Courses from '../Courses/Courses';
import Testimonials from '../Testimonials/Testimonials';
import Contact from '../Contact/Contact';
import WelcomeHero from '../WelcomeHero/WelcomeHero';

const Home: React.FC = () => {
    return (
        <div className="homepage-wrapper">
            <WelcomeHero />
            <Courses />
            <Testimonials />
            <Contact />
        </div>
    );
};

export default Home;