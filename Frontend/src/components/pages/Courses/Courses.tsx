import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { courses } from '../../../../../Backend/data/products'; 
import { FaLayerGroup, FaMapMarkerAlt, FaCalendarCheck, FaUserFriends, FaArrowRight } from 'react-icons/fa'; 
import { useSeo } from '../../../hooks/useSeo'; 
import './courses.scss';

const Courses: React.FC = () => { 
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState<'all' | 'Drawing' | 'Painting' | 'Mixed'>('all');

    // Default SEO for the list page
    useSeo();

    useEffect(() => {
        document.body.style.backgroundColor = '#171717';
        return () => { document.body.style.backgroundColor = ''; };
    }, []);

    const filteredAndSorted = useMemo(() => {
        const priorityOrder = ["801", "800", "803", "804", "802", "806", "805"];
        return [...courses]
            .filter(p => activeCategory === 'all' || p.category === activeCategory || p.category === 'Mixed')
            .sort((a, b) => {
                const iA = priorityOrder.indexOf(a.id.toString());
                const iB = priorityOrder.indexOf(b.id.toString());
                return (iA === -1 ? 99 : iA) - (iB === -1 ? 99 : iB);
            });
    }, [activeCategory]);

    return (
        <section className="courses-page-root">
            <div className="container"> 
                <header className="section-header">
                    <span className="label">{t('coursesPage.curriculumLabel')}</span>
                    <h2 className="courses-main-title">{t('coursesPage.title')}</h2>
                    <p className="intro-text-curated">{t('coursesPage.intro')}</p>
                    
                    <nav className="filter-navigation">
                        {['All', 'Drawing', 'Painting', 'Mixed'].map((cat) => (
                            <button 
                                key={cat}
                                className={`filter-nav-btn ${activeCategory === (cat === 'All' ? 'all' : cat) ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat === 'All' ? 'all' : cat as any)}
                            >
                                {t(`coursesPage.filter${cat}`)}
                            </button>
                        ))}
                    </nav>
                </header>

                <div className="courses-list-stack">
                    {filteredAndSorted.map((product) => (
                        <article key={product.id} className="course-card-row">
                            <div className="hero-text">
                                <span className="label">{product.category}</span>
                                <h3 className="row-title">{t(`products.${product.id}.title`)}</h3>
                                
                                <div className="unified-meta-line">
                                    <div className="meta-item"><FaLayerGroup /> <span>{t('coursesPage.meta.level')}</span></div>
                                    <div className="meta-item"><FaMapMarkerAlt /> <span>{t('coursesPage.meta.location')}</span></div>
                                    <div className="meta-item"><FaCalendarCheck /> <span>{t('coursesPage.meta.date')}</span></div>
                                    <div className="meta-item"><FaUserFriends /> <span>{t('coursesPage.meta.format')}</span></div>
                                </div>

                                <p className="row-desc">
                                    {t(`products.${product.id}.briefDescription`)}
                                </p>

                                {/* Updated to use slug for the URL */}
                                <Link to={`/course/${product.slug}`}>
                                    <button className="pill-button-wow">
                                        {t('coursesPage.viewButton')} 
                                        <FaArrowRight className="btn-icon" />
                                    </button>
                                </Link>
                            </div>

                            <div className="hero-media">
                                {/* Updated to use slug for the URL */}
                                <Link to={`/course/${product.slug}`} className="exhibition-frame">
                                    <img 
                                        src={product.image?.lowResUrl} 
                                        alt={t(`products.${product.id}.title`)} 
                                        className="premium-img" 
                                    />
                                    {product.badge && (
                                        <div className="row-badge">
                                            {t(`products.${product.id}.badge`)}
                                        </div>
                                    )}
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Courses;
/** 
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
*/