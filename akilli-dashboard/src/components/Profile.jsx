import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({ name: '', role: '' });

  // Sync internal state with context when context changes or loads
  useEffect(() => {
    setFormData({ name: user.name, role: user.role });
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...user, name: formData.name, role: formData.role });
  };

  return (
    <div className="profile-container animate-fade-in">
      <div className="profile-header">
        <h2>Profil Düzenle</h2>
        <p>Bilgilerinizi ve yetkinizi buradan güncelleyebilirsiniz. Tüm uygulama anında güncellenecektir (Global State).</p>
      </div>

      <div className="profile-card">
        <form onSubmit={handleSave} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Ad Soyad</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Kullanıcı Rolü</label>
            <select 
              id="role" 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="Admin">Admin (Tam Yetkili)</option>
              <option value="User">User (Sınırlı Yetki)</option>
            </select>
          </div>

          <button type="submit" className="save-btn">Değişiklikleri Kaydet</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
