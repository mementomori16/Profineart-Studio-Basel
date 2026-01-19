import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { courses } from '../../../../../Backend/data/products'; 
import './courses.scss';

const Courses: React.FC = () => { 
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState<'all' | 'Drawing' | 'Painting' | 'Mixed'>('all');

    useEffect(() => {
        document.body.style.backgroundColor = '#171717';
        return () => { document.body.style.backgroundColor = ''; };
    }, []);

    const priorityOrder = ["806", "801", "800", "804", "802", "803", "805"];

    const filteredAndSortedCourses = [...courses]
        .filter(product => {
            if (activeCategory === 'all') return true;
            if (activeCategory === 'Drawing') return product.category === 'Drawing' || product.category === 'Mixed';
            if (activeCategory === 'Painting') return product.category === 'Painting' || product.category === 'Mixed';
            return product.category === activeCategory;
        })
        .sort((a, b) => {
            const indexA = priorityOrder.indexOf(a.id.toString());
            const indexB = priorityOrder.indexOf(b.id.toString());
            return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
        });

    return (
        <div className="courses-page-root">
            <div className="courses-content-grid">
                <header className="courses-header">
                    <h1 className="courses-title">{t('coursesPage.title')}</h1>
                </header>

                <section className="courses-intro">
                    <p className="intro-text-primary">{t('coursesPage.intro')}</p>
                    <div className="filter-navigation">
                        {['all', 'Drawing', 'Painting', 'Mixed'].map((cat) => (
                            <button 
                                key={cat}
                                className={`filter-nav-btn ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat as any)}
                            >
                                {t(`coursesPage.filter${cat.charAt(0).toUpperCase() + cat.slice(1)}`, cat === 'all' ? 'All' : cat + 's')}
                            </button>
                        ))}
                    </div>
                </section>

                <div className="courses-gallery">
                    {filteredAndSortedCourses.map((product) => (
                        <article key={product.id} className="course-card">
                            {product.badge && <div className="course-badge">{t(`products.${product.id}.badge`)}</div>}
                            <Link to={`/card/${product.id}`} className="course-image-link">
                                <div className="course-image-wrapper">
                                    <img src={product.image?.lowResUrl} alt={t(`products.${product.id}.title`)} className="course-image" />
                                </div>
                            </Link>
                            <div className="course-card-content">
                                <h2 className="course-card-title">{t(`products.${product.id}.title`)}</h2>
                                <div className="course-description-frame">
                                    <p className="course-text">{t(`products.${product.id}.briefDescription`)}</p>
                                </div>
                                <Link to={`/card/${product.id}`} className="course-button-link">
                                    <button className="course-view-btn">{t('coursesPage.viewButton')}</button>
                                </Link>
                            </div>
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