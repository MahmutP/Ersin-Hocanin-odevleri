import { movies } from '../data/movies';
import MovieCard from '../components/MovieCard';
import './Movies.css';

const Movies = () => {
  return (
    <div className="movies-container">
      <h2 className="section-title">Filmleri Keşfet</h2>
      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Movies;
