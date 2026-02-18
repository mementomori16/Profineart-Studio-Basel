import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './navDesktop.scss';
import logo from '../../../assets/images/icons/Group 177.svg';
import { FaShoppingBasket, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../context/CartContext/CartContext';
import LanguageSwitcher from '../../Languege-switcher/Languege-switcher';

const NavDesktop = () => {
  const { t } = useTranslation('translation');
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setTimeout(() => setIsMenuOpen(true), 300);
  };

  const routes = [
    { label: t('home.home'), path: '/' },
    { 
      label: t('home.courses'), 
      path: '/courses',
      subRoutes: [
        { label: t('home.courseList.oil'), path: '/course/oil-painting-course' },
        { label: t('home.courseList.byzantine'), path: '/course/byzantine-iconography-course' },
        { label: t('home.courseList.aquarelle'), path: '/course/aquarelle-course' },
        { label: t('home.courseList.academic'), path: '/course/academic-drawing-course' },
        { label: t('home.courseList.mixed'), path: '/course/mixed-media-drawing-course' },
        { label: t('home.courseList.stone'), path: '/course/stone-painting-course' },
        { label: t('home.courseList.contemporary'), path: '/course/contemporary-painting-course' },
      ]
    },
    { label: t('home.howItWorks'), path: '/how-it-works' },
    { label: t('home.studentsWorks'), path: '/students-works' },
    { label: t('home.about'), path: '/about' },
  ];

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="nav-logo" aria-label="Homepage">
          <img src={logo} alt="Logo" className="nav-logo-img" />
        </Link>

        <ul className="nav-menu">
          {routes.map(route => (
            <li key={route.path} className="nav-item" onMouseLeave={() => setIsMenuOpen(true)}>
              <NavLink
                to={route.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={route.path === '/'}
              >
                {route.label}
                {route.subRoutes && <FaChevronDown style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }} />}
              </NavLink>

              {route.subRoutes && (
                <ul className={`dropdown-menu ${!isMenuOpen ? 'force-hide' : ''}`}>
                  {route.subRoutes.map(sub => (
                    <li key={sub.path}>
                      <Link to={sub.path} className="dropdown-link" onClick={handleLinkClick}>
                        <span>{sub.label}</span>
                        <FaChevronRight className="nudge-icon" style={{ fontSize: '0.6rem', opacity: 0.3 }} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <div className="nav-right-actions">
          <LanguageSwitcher /> 
          <Link to="/basket" className="basket-icon" aria-label="View Cart">
            <FaShoppingBasket size={24} />
            {cart.length > 0 && <span className="basket-badge">{cart.length}</span>}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavDesktop;
