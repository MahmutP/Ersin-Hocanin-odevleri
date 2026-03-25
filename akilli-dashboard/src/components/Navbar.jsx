import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { ThemeContext } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { user } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar glass">
      <div className="navbar-brand">
        <h1>Akıllı Dashboard</h1>
      </div>
      
      <div className="navbar-controls">
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
        
        <div className="user-profile">
          <img src={user.profilePicture} alt="Profile" className="avatar" />
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role-badge">{user.role}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
