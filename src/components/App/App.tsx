import css from "./App.module.css";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isMoviesLoading, setMoviesLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const openModal = (movie: Movie): void => {
    setSelectedMovie(movie);
  };

  const closeModal = (): void => {
    setSelectedMovie(null);
  };

  const handleSearch = async (input: string): Promise<void> => {
    try {
      setMovies([]);
      setMoviesLoading(true);
      setIsError(false);

      const foundMovies = await fetchMovies(input);

      if (foundMovies.length === 0) {
        toast.error("No movies found for your request.");
      }
      setMovies(foundMovies);
    } catch {
      setIsError(true);
    } finally {
      setMoviesLoading(false);
    }
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {movies.length > 0 && <MovieGrid movies={movies} onSelect={openModal} />}
      {isMoviesLoading && <Loader />}
      {isError && <ErrorMessage />}
      <Toaster />
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
