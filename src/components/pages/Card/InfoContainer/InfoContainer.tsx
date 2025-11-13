import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { Product } from '../../../types/Product';
// Import only necessary icons if used in the course button, otherwise removed.
// We will keep the Link to avoid issues with missing functionality.
import { FaExternalLinkAlt } from 'react-icons/fa'; 

import './infoContainer.scss';

type Props = {
  product: Product;
};

const InfoContainer: React.FC<Props> = ({ product }) => {
  const { t } = useTranslation();

  // The text content is translated and rendered directly here
  const translatedDescription = t(`products.${product.id}.description`);
  
  // NOTE: I am REMOVING the previous 'product.medium !== 'Course'' filter,
  // as the parent (CardPage) already ensures the correct product is loaded.

  return (
    <div className="infoContainer">
      {/* This component acts as the text column in the 50/50 layout */}
      
      {product.medium && <p className="medium">{product.medium}</p>}
      {product.date && <p className="infodate">{product.date}</p>}

      {/* Description Rendering Logic */}
      {/* This structure is correct for handling both array and single string descriptions */}
      {Array.isArray(product.description) ? (
        <div className="description">
          {product.description.map((_paragraph, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: t(`products.${product.id}.description`) }} />
          ))}
        </div>
      ) : (
        <p className="description" dangerouslySetInnerHTML={{ __html: translatedDescription }} />
      )}

      {/* 🛑 Technology Icons Section REMOVED (As per request) */}
      {/* 🛑 External Link Container REMOVED (As per request) */}
      
      {/* ✅ ADDING THE "EXPLORE THIS COURSE" BUTTON/LINK BACK */}
      {/* Assuming the "Explore this Course" button should link to the same card page if it's a course */}
      {product.medium === 'Course' && (
        <div className="course-button-container">
          <Link to={`/card/${product.id}`} className="explore-button">
            <FaExternalLinkAlt size={16} /> {/* Using an appropriate icon */}
            <span className="link-text">{t('coursesPage.exploreCourseButton') || 'Explore this Course'}</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default InfoContainer;

