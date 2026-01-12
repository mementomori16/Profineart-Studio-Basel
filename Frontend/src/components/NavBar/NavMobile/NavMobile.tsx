// NavMobile.tsx
import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Hamburger from 'hamburger-react';
import { useTranslation } from 'react-i18next';
import { FaShoppingBasket } from 'react-icons/fa';
import { useCart } from '../../../context/CartContext/CartContext';
import './navMobile.scss';
import logo from '../../../assets/images/icons/Group 177.svg';

const NavMobile = () => {
  const [isOpen, setOpen] = useState(false);
  const { t } = useTranslation('translation');
  const { cart } = useCart();

  const routes = [
    { label: t('home.home'), path: '/' },
    { label: t('home.courses'), path: '/courses' },
    { label: t('home.howItWorks'), path: '/how-it-works' },
    { label: t('home.studentsWorks'), path: '/students-works' },
    { label: t('home.about'), path: '/about' },
  ];

  const closeMenu = () => setOpen(false);

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
            <NavLink
              to={route.path}
              className={({ isActive }) => `mobile-link ${isActive ? 'active' : ''}`}
              end={route.path === '/'}
              onClick={closeMenu}
            >
              {route.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </header>
  );
};

export default NavMobile;
