import { useParams, useNavigate } from 'react-router-dom';
import { movies } from '../data/movies';
import './MovieDetail.css';

const MovieDetail = () => {
  const { filmSlug } = useParams();
  const navigate = useNavigate();

  const movie = movies.find((m) => m.slug === filmSlug);

  if (!movie) {
    return (
      <div className="detail-container error-state">
        <h2>Film Bulunamadı</h2>
        <p>Aradığınız film veritabanımızda yok.</p>
        <button className="primary-button" onClick={() => navigate('/filmler')}>
          Filmlere Dön
        </button>
      </div>
    );
  }

  // Pick a random movie that is not the current one.
  const handleRandomMovie = () => {
    const otherMovies = movies.filter(m => m.slug !== filmSlug);
    const randomMovie = otherMovies[Math.floor(Math.random() * otherMovies.length)];
    navigate(`/film/${randomMovie.slug}`);
  };

  return (
    <div className="detail-container">
      <div className="detail-card">
        <div className="detail-image-wrapper">
          <img src={movie.image} alt={movie.title} className="detail-image" />
        </div>
        <div className="detail-info">
          <h2 className="detail-title">{movie.title} <span className="detail-year">({movie.year})</span></h2>
          <p className="detail-director"><strong>Yönetmen:</strong> {movie.director}</p>
          <div className="detail-rating"><strong>IMDb Puanı:</strong> ⭐ {movie.rating}</div>
          <p className="detail-desc">{movie.description}</p>
          
          <div className="action-buttons">
            <button className="secondary-button" onClick={() => navigate('/filmler')}>
              ← Listeye Dön
            </button>
            <button className="primary-button" onClick={handleRandomMovie}>
              🎲 Rastgele Film Keşfet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
