import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Assuming 'courses' is imported from your data file
import { courses } from '../../data/products'; 
import './courses.scss'; 

const Courses: React.FC = () => { 
    const { t } = useTranslation();
    
    // Using the courses array imported from your data
    const filteredProducts = courses; 

    return (
        <div className="coursesPage">
            <h1 className="heading">{t('coursesPage.title')}</h1>
            <div className="gallery">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="serviceItem">
                        <Link to={`/card/${product.id}`}>
                            <img
                                // FIX: Access the lowResUrl property to get the image source
                                src={product.image.lowResUrl}
                                alt={t(`products.${product.id}.title`)}
                                className="image"
                            />
                        </Link>
                        <h2 className="title">{t(`products.${product.id}.title`)}</h2>
                        <Link to={`/card/${product.id}`}>
                            <button className="viewButton">{t('coursesPage.viewButton')}</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;