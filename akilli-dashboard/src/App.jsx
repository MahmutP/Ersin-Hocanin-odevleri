import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import Settings from './components/Settings';
import './App.css';

const DashboardContent = () => {
  return (
    <div className="dashboard-content animate-fade-in">
      <div className="welcome-banner">
        <h2>Akıllı Dashboard'a Hoş Geldiniz! 🚀</h2>
        <p>Bu alan React Context API kullanılarak "Prop Drilling" problemi olmadan geliştirilmiştir.</p>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Toplam Görüntülenme</h4>
          <span className="stat-value">24,592</span>
        </div>
        <div className="stat-card">
          <h4>Aktif Kullanıcı</h4>
          <span className="stat-value">1,245</span>
        </div>
        <div className="stat-card">
          <h4>Sistem Sağlığı</h4>
          <span className="stat-value text-success">%99.9</span>
        </div>
      </div>
    </div>
  );
};

const AppLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-wrapper">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-content">
          {activeTab === 'dashboard' && <DashboardContent />}
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppLayout />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
