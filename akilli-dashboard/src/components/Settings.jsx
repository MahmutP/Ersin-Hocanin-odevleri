import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './Settings.css';

const Settings = () => {
  const { user } = useContext(UserContext);

  if (user.role !== 'Admin') {
    return (
      <div className="settings-container error animate-fade-in">
        <h2>Yetkisiz Erişim! 🛑</h2>
        <p>Bu sayfayı görüntülemek için yeterli yetkiniz bulunmamaktadır.</p>
      </div>
    );
  }

  return (
    <div className="settings-container animate-fade-in">
      <h2>Sistem Ayarları ⚙️</h2>
      <p>Sadece <strong>Admin</strong> yetkisine sahip kullanıcıların görebileceği özel kontrol paneli alanı.</p>
      
      <div className="settings-grid">
        <div className="settings-card">
          <h3>Kullanıcı Yönetimi</h3>
          <p>Sistemdeki diğer kullanıcıları yönetin.</p>
          <button className="settings-action-btn">Yönet</button>
        </div>
        <div className="settings-card">
          <h3>Güvenlik Duvarı</h3>
          <p>Gelişmiş güvenlik ve erişim ayarlarını yapılandırın.</p>
          <button className="settings-action-btn">Yapılandır</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
