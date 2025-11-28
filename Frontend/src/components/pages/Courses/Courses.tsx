import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Assuming 'courses' is imported from your data file
import { courses } from '../../../../../Backend/data/products'; 
import './courses.scss'; 

const Courses: React.FC = () => { 
    const { t } = useTranslation();
    
    // Using the courses array imported from your data
    const filteredProducts = courses; 

    return (
        <div className="coursesPage">
            <h1 className="heading">{t('coursesPage.title')}</h1>
            <div className="gallery">
                {/* Only map over products that are defined and have basic structure
                  This adds a minor safety check in case the courses array contains null/undefined items.
                */}
                {filteredProducts.filter(product => product).map((product) => (
                    <div key={product.id} className="serviceItem">
                        <Link to={`/card/${product.id}`}>
                            <img
                                // 🛑 CRITICAL FIX: Use optional chaining (?.) on 'image' 
                                // to prevent crash if product.image is undefined/null.
                                // Fallback to a placeholder image if the URL is missing.
                                src={product.image?.lowResUrl || '/assets/placeholder-course.jpg'}
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