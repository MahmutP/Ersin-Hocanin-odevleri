import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useContext(UserContext);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'profile', label: 'Profil', icon: '👤' },
  ];

  // Conditionally add 'Ayarlar' tab if user is Admin
  if (user.role === 'Admin') {
    navItems.push({ id: 'settings', label: 'Ayarlar', icon: '⚙️' });
  }

  return (
    <aside className="sidebar">
      <ul className="nav-list">
        {navItems.map((item) => (
          <li 
            key={item.id} 
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
