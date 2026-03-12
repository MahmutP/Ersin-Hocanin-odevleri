import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-content">
        <h1 className="hero-title">Sinemanın Büyülü Dünyasına Hoş Geldiniz</h1>
        <p className="hero-subtitle">
          En sevdiğiniz filmleri keşfedin, detaylarını inceleyin ve kendi kişisel film rehberinizi oluşturun.
        </p>
        <button className="primary-button" onClick={() => navigate('/filmler')}>
          Filmleri Keşfet
        </button>
      </div>
    </div>
  );
};

export default Home;
