import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { courses } from '../../../../../Backend/data/products'; 
import './courses.scss';

const Courses: React.FC = () => { 
    const { t } = useTranslation();

    /**
     * SYNC BACKGROUND WITH HOME PAGE
     * Forces the body to #171717 while this component is mounted
     */
    useEffect(() => {
        document.body.style.backgroundColor = '#171717';

        return () => {
            document.body.style.backgroundColor = ''; 
        };
    }, []);

    /**
     * PRIORITY RANKING:
     * 1. 806 - Contemporary
     * 2. 801 - Oil Painting
     * 3. 800 - Byzantine
     * 4. 804 - Academic Drawing
     * 5. 802 - Mixed Media
     * 6. 803 - Aquarelle
     * 7. 805 - Stone Painting
     */
    const priorityOrder = ["806", "801", "800", "804", "802", "803", "805"];

    const sortedCourses = [...courses].sort((a, b) => {
        const indexA = priorityOrder.indexOf(a.id.toString());
        const indexB = priorityOrder.indexOf(b.id.toString());
        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });

    return (
        <div className="courses-page-root">
            <div className="courses-content-grid">
                <header className="courses-header">
                    <h1 className="courses-title">
                        {t('coursesPage.title', 'Art Mastery Courses')}
                    </h1>
                </header>

                <div className="courses-gallery">
                    {sortedCourses
                        .filter(product => product)
                        .map((product) => (
                            <article key={product.id} className="course-card">
                                {product.badge && (
                                    <div className="course-badge">
                                        {t(`products.${product.id}.badge`)}
                                    </div>
                                )}

                                <Link to={`/card/${product.id}`} className="course-image-link">
                                    <div className="course-image-wrapper">
                                        <img
                                            src={product.image?.lowResUrl || '/assets/placeholder-course.jpg'}
                                            alt={t(`products.${product.id}.title`)}
                                            className="course-image"
                                        />
                                    </div>
                                </Link>

                                <h2 className="course-card-title">
                                    {t(`products.${product.id}.title`)}
                                </h2>

                                {/* This frame provides the subtle dark-glass background for the description */}
                                <div className="course-description-frame">
                                    <p className="course-text">
                                        {t(`products.${product.id}.briefDescription`)}
                                    </p>
                                </div>

                                <Link to={`/card/${product.id}`} className="course-button-link">
                                    <button className="course-view-btn">
                                        {t('coursesPage.viewButton', 'Explore Course')}
                                    </button>
                                </Link>
                            </article>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Courses;

/** 
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { courses } from '../../../../../Backend/data/products'; 
import './courses.scss';

const Courses: React.FC = () => { 
    const { t } = useTranslation();

    
    const priorityOrder = ["806", "801", "800", "804", "802", "803", "805"];

    const sortedCourses = [...courses].sort((a, b) => {
        const indexA = priorityOrder.indexOf(a.id.toString());
        const indexB = priorityOrder.indexOf(b.id.toString());
        // If an ID isn't in the list, it goes to the end
        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });

    return (
        <div className="cardPageContainer courses-section">
            <div className="cardContentWrapper">
                <div className="cardHeader">
                    <h1 className="pageTitle">{t('coursesPage.title', 'Art Mastery Courses')}</h1>
                </div>

                <div className="gallery">
                    {sortedCourses
                        .filter(product => product)
                        .map((product) => (
                            <div key={product.id} className="serviceItem">
                                {product.badge && (
                                    <div className="badge">
                                        {t(`products.${product.id}.badge`)}
                                    </div>
                                )}

                                <Link to={`/card/${product.id}`} className="image-link">
                                    <div className="image-wrapper">
                                        <img
                                            src={product.image?.lowResUrl || '/assets/placeholder-course.jpg'}
                                            alt={t(`products.${product.id}.title`)}
                                            className="image"
                                        />
                                    </div>
                                </Link>

                                <h2 className="title">{t(`products.${product.id}.title`)}</h2>

                                <div className="description-frame">
                                    <p className="subtitle">
                                        {t(`products.${product.id}.briefDescription`)}
                                    </p>
                                </div>

                                <Link to={`/card/${product.id}`} className="button-link">
                                    <button className="viewButton">
                                        {t('coursesPage.viewButton', 'Explore Course')}
                                    </button>
                                </Link>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Courses;
*/