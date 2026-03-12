import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">🎬 ReelVault</div>
      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Ana Sayfa
        </NavLink>
        <NavLink to="/filmler" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Filmler
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
