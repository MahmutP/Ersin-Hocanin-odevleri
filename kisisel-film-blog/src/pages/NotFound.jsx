import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <h2 className="notfound-subtitle">Kaybolmuş Gibisiniz</h2>
      <p className="notfound-text">Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak ulaşılamıyor olabilir.</p>
      <button className="primary-button" onClick={() => navigate('/')}>
        Ana Sayfaya Dön
      </button>
    </div>
  );
};

export default NotFound;
