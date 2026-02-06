import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { courses } from '../../../../functions/src/data/products'; 
import { 
    FaLayerGroup, 
    FaMapMarkerAlt, 
    FaCalendarCheck, 
    FaUserFriends 
} from 'react-icons/fa'; 
import './courseTeaser.scss';

const CourseTeaser: React.FC = () => {
    const { t } = useTranslation();

    const priorityIds = ["803", "801", "800"]; 
    const teaserCourses = courses
        .filter(c => priorityIds.includes(c.id.toString()))
        .sort((a, b) => priorityIds.indexOf(a.id.toString()) - priorityIds.indexOf(b.id.toString()));

    return (
        <section className="course-teaser-section">
            <div className="container">
                <header className="teaser-header">
                    <h2 className="teaser-title">{t('home.courses')}</h2>
                    <div className="teaser-line"></div>
                </header>

                <div className="teaser-grid">
                    {teaserCourses.map((course) => (
                        <Link 
                            to={`/card/${course.id}`} 
                            key={course.id} 
                            className="teaser-card"
                        >
                            <div className="teaser-image-wrapper">
                                <img 
                                    src={course.image?.lowResUrl} 
                                    alt={t(`products.${course.id}.title`)} 
                                />
                                <div className="teaser-overlay">
                                    <span>{t('coursesPage.viewButton')}</span>
                                </div>
                            </div>

                            <div className="teaser-info">
                                <h3>{t(`products.${course.id}.title`)}</h3>
                                
                                <div className="unified-meta-line">
                                    <div className="meta-item">
                                        <FaLayerGroup /> 
                                        <span>{t('coursesPage.meta.level')}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FaMapMarkerAlt /> 
                                        <span>{t('coursesPage.meta.location')}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FaCalendarCheck /> 
                                        <span>{t('coursesPage.meta.date')}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FaUserFriends /> 
                                        <span>{t('coursesPage.meta.format')}</span>
                                    </div>
                                </div>

                                <p>{t(`products.${course.id}.briefDescription`)}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="teaser-footer">
                    <Link to="/courses" className="view-all-link">
                        {t('homePage.learnMoreButton')} 
                        <span className="arrow">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CourseTeaser;