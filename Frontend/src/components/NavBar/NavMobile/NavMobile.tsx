// NavMobile.tsx
import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Hamburger from 'hamburger-react';
import { useTranslation } from 'react-i18next';
import { FaShoppingBasket } from 'react-icons/fa'; // <-- Added basket icon
import './navMobile.scss';
import logo from '../../../assets/images/icons/Group 177.svg';
import LanguageSwitcher from '../../Languege-switcher/Languege-switcher';
import { useCart } from '../../../context/CartContext/CartContext'; // <-- your cart context

interface Route {
  label: string;
  path: string;
}

const routes: Route[] = [
  { label: 'home', path: '/' },
  { label: 'courses', path: '/courses' },
  { label: 'about', path: '/about' },
  { label: 'contact', path: '/contact' },
];

const NavMobile = () => {
  const [isOpen, setOpen] = useState(false);
  const { t } = useTranslation('translation');
  const { cart } = useCart(); // <-- get cart

  const toggleMenu = () => setOpen(!isOpen);
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
        <Link to="/" className="mobile-logo" aria-label="Homepage">
          <img src={logo} alt="Ilya Medvedev Logo" className="mobile-logo-img" />
        </Link>

        <div className="mobile-right">
          {/* Shopping basket */}
          <Link to="/basket" className="basket-icon">
            <FaShoppingBasket size={24} />
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
          </Link>

          {/* Hamburger menu */}
          <div className="mobile-hamburger" onClick={toggleMenu}>
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
              {t(route.label)}
            </NavLink>
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
