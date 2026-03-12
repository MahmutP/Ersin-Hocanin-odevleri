import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <div className="card-image-wrapper">
        <img src={movie.image} alt={movie.title} className="card-image" />
        <div className="card-rating">⭐ {movie.rating}</div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{movie.title} ({movie.year})</h3>
        <p className="card-director">{movie.director}</p>
        <Link to={`/film/${movie.slug}`} className="details-link">
          Detayları Gör
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
