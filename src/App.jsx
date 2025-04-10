import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Search from "./components/Search";
import MovieCard from "./components/MovieCard";
import MovieDetails from "./components/MovieDetails";
import { useDebounce } from "react-use";
import { updateSearchCount , getTrendingMovies } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isloading, setIsloading] = useState(false);
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
const [trendingMovies, setTrendingMovies] = useState([]);

//debounce  the  search  term  to  prevent making  too many  api  calls
useDebounce(
  ()=> setDebouncedSearchTerm(searchTerm),500,[searchTerm]
)

  const fetchMovies = async (query = "") => {
    setIsloading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      if (data.results.length === 0) {
        setErrorMessage("No movies found matching your search");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
if(query && data.results.length>0){
  await updateSearchCount(query, data.results[0]);
}
    } catch (error) {
      console.error(error);
      setErrorMessage("Error fetching movies. Please try again later");
    } finally {
      setIsloading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
   loadTrendingMovies();
  }, [])
  

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="/hero.png" alt="Hero" />
            <h1 className="text-gradient">MOVIEPEDIA</h1>
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>
          {
            trendingMovies.length > 0 && (
              <section className="trending">
                <h2>Trending Movies</h2>

                <ul>
                  {trendingMovies.map((movie, index)=>(
                    <li key={movie.$id}>
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt="movietitle" />
                    </li>
                  ))}
                </ul>
              </section>
            )
          }
          <section className="all-movies">
            <h2>All movies</h2>
            {isloading ? (
              <p className="loading">Loading...</p>
            ) : errorMessage ? (
              <p className="error">{errorMessage}</p>
            ) : (
              <ul className="movie-grid">
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
