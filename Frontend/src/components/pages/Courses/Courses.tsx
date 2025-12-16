import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { courses } from '../../../../../Backend/data/products'; 
import './courses.scss';

const Courses: React.FC = () => { 
    const { t } = useTranslation();

    return (
        <div className="coursesPage">
            <h1 className="heading">{t('coursesPage.title', 'Our Courses')}</h1>

            <div className="gallery">
                {courses
                    .filter(product => product)
                    .map((product) => (
                        <div key={product.id} className="serviceItem">

                            {/* Badge per product */}
                            {product.badge && (
                                <div className="badge">
                                    {t(`products.${product.id}.badge`)}
                                </div>
                            )}

                            <Link to={`/card/${product.id}`}>
                                <div className="image-wrapper">
                                    <img
                                        src={product.image?.lowResUrl || '/assets/placeholder-course.jpg'}
                                        alt={t(`products.${product.id}.title`)}
                                        className="image"
                                    />
                                </div>
                            </Link>

                            <h2 className="title">{t(`products.${product.id}.title`)}</h2>

                            {/* Brief description */}
                            {product.briefDescription && (
                                <p className="subtitle">
                                    {t(`products.${product.id}.briefDescription`)}
                                </p>
                            )}

                            <Link to={`/card/${product.id}`}>
                                <button className="viewButton">
                                    {t('coursesPage.viewButton', 'Learn More')}
                                </button>
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Courses;


