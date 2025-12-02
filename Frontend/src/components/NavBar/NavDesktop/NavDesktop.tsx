import { NavLink, Link } from 'react-router-dom';
import './navDesktop.scss';
import logo from '../../../assets/images/icons/Group 177.svg';
import { FaShoppingBasket } from 'react-icons/fa'; // Elegant basket icon
import LanguageSwitcher from '../../Languege-switcher/Languege-switcher';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../context/CartContext/CartContext';

const NavDesktop = () => {
  const { t } = useTranslation('translation');
  const { cart } = useCart();

  const routes = [
    { label: t('home'), path: '/' },
    { label: t('courses'), path: '/courses' },
    { label: t('about'), path: '/about' },
    { label: t('contact'), path: '/contact' },
  ];

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="nav-logo" aria-label="Homepage">
          <img src={logo} alt="Logo" className="nav-logo-img" />
        </Link>

        <ul className="nav-menu">
          {routes.map(route => (
            <li key={route.path} className="nav-item">
              <NavLink
                to={route.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={route.path === '/'}
              >
                {route.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-right-actions">
          <LanguageSwitcher />

          <Link to="/basket" className="basket-icon">
            <FaShoppingBasket size={24} />
            {cart.length > 0 && (
              <span className="basket-badge">{cart.length}</span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavDesktop;

