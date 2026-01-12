import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { courses } from '../../../../../Backend/data/products'; 
import './courses.scss';

const Courses: React.FC = () => { 
    const { t } = useTranslation();

    /**
     * PRIORITY RANKING:
     * 1. 806 - Contemporary (The Elite/Conceptual Hook)
     * 2. 801 - Oil Painting (Prestige/Versatility)
     * 3. 800 - Byzantine (Unique Historical Mastery)
     * 4. 804 - Academic Drawing (The Essential Foundation)
     * 5. 802 - Mixed Media (Versatility)
     * 6. 803 - Aquarelle (Technical Mastery)
     * 7. 805 - Stone Painting (Unique Specialty)
     */
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

