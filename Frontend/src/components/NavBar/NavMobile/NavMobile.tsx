import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Hamburger from 'hamburger-react';
import { useTranslation } from 'react-i18next';
import { FaShoppingBasket, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useCart } from '../../../context/CartContext/CartContext';
import './navMobile.scss';
import logo from '../../../assets/images/icons/Group 177.svg';
import LanguageSwitcher from '../../Languege-switcher/Languege-switcher';

const NavMobile = () => {
  const [isOpen, setOpen] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const { t } = useTranslation('translation');
  const { cart } = useCart();

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

  const closeMenu = () => {
    setOpen(false);
    setShowSubMenu(false);
  };

  const toggleSubMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSubMenu(!showSubMenu);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isOpen]);

  return (
    <header className="header-mobile">
      <nav className="navbarmobile">
        <Link to="/" className="mobile-logo" onClick={closeMenu}>
          <img src={logo} alt="Logo" className="mobile-logo-img" />
        </Link>

        <div className="mobile-right">
          <Link to="/basket" className="basket-icon" onClick={closeMenu}>
            <FaShoppingBasket size={24} />
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </Link>

          <div className="mobile-hamburger">
            <Hamburger toggled={isOpen} toggle={setOpen} size={24} />
          </div>
        </div>
      </nav>

      <ul className={`mobile-menu ${isOpen ? 'active' : ''}`}>
        {routes.map((route) => (
          <li key={route.path} className="mobile-item">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <NavLink
                to={route.path}
                className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
                end={route.path === '/'}
                onClick={closeMenu}
              >
                {route.label}
              </NavLink>
              
              {route.subRoutes && (
                <div onClick={toggleSubMenu} style={{ padding: '0.5rem', cursor: 'pointer' }}>
                  <FaChevronDown style={{ 
                    color: 'white', 
                    transform: showSubMenu ? 'rotate(180deg)' : 'rotate(0)', 
                    transition: 'transform 0.3s' 
                  }} />
                </div>
              )}
            </div>

            {route.subRoutes && (
              <ul className={`mobile-submenu ${showSubMenu ? 'open' : ''}`}>
                {route.subRoutes.map((sub) => (
                  <li key={sub.path}>
                    <Link to={sub.path} className="mobile-sublink" onClick={closeMenu}>
                      <span>{sub.label}</span>
                      <FaChevronRight size={10} style={{ opacity: 0.3, marginRight: '1rem' }} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
        
        <li className="mobile-item language-item">
          <LanguageSwitcher onCloseMenu={closeMenu} />
        </li>
      </ul>
    </header>
  );
};

export default NavMobile;
