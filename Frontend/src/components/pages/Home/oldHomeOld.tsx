import React, { useRef } from "react";
import New from "../../costumcarousel/CustomCarousel";
// Removed import Services from "../ServicesPage/Services";
import Testimonials from "../Testimonials/oldTestimonials";
import Contact from "../Contact/Contact";
// Removed import Projects from "../Projects/Projects";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import './home.scss';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);


  return (
    <div className="home-page">
      <New /> 
      
      <div className="stripes-container" ref={contentRef}>
        
        {/* Divider before About Teaser */}
        <div className="section-divider"></div>
        
        <div className="stripe homepage-section about-teaser-section">
          <h2 className="about-teaser-title">{t('homePage.aboutTeaserTitle')}</h2>
          <div className="about-teaser-content">
            <img
              src="https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/0tfzD7K/received-341071728732999.png"
              alt="Ilya Medvedev - Founder of Hieroglyph Code"
              className="about-teaser-image"
            />
            <div className="about-teaser-description" dangerouslySetInnerHTML={{ __html: t('homePage.aboutTeaserDescription') }} />
          </div>
          <Link to="/about" className="learn-more-button">{t('homePage.learnMoreButton')}</Link>
        </div>

        <div className="section-divider"></div>

        {/* SERVICES SECTION - REMOVED FOR NOW */}
        {/*
        <div className="stripe homepage-section">
          <Services />
        </div>
        
        <div className="section-divider"></div> 
        */}
        
        {/* PROJECTS SECTION - REMOVED FOR NOW */}
        {/*
        <div className="stripe homepage-section">
          <Projects />
        </div>
        
        <div className="section-divider"></div>
        */}

        <div className="stripe homepage-section">
          <Testimonials />
        </div>

        <div className="section-divider"></div>

        <div className="stripe homepage-section contact-section">
          <Contact />
        </div>
      </div>
    </div>
  );
};

export default Home;