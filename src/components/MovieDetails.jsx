import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./MovieDetails.css";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}?append_to_response=credits,videos,similar`,
          API_OPTIONS
        );

        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }

        const data = await response.json();
        console.log(data);
        setMovie(data);
      } catch (error) {
        console.error(error);
        setError("Error fetching movie details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (isLoading) return <p className="loading">Loading movie details...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!movie) return <p className="not-found">Movie not found</p>;

  const {
    title,
    overview,
    poster_path,
    backdrop_path,
    release_date,
    vote_average,
    genres,
    runtime,
    credits,
    videos,
    similar
  } = movie;

  // Find trailer if available
  const trailer = videos?.results?.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  // Get director
  const director = credits?.crew?.find((person) => person.job === "Director");

  // Get cast (top 5)
  const cast = credits?.cast?.slice(0, 6) || [];

  return (
    <div className="movie-details">
      <div className="back-button">
        <Link to="/" className="btn-back font-semibold">
          ← Home
        </Link>
      </div>

      {backdrop_path && (
        <div className="backdrop" style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), 
          url(https://image.tmdb.org/t/p/original/${backdrop_path})` 
        }}>
        </div>
      )}

      <div className="movie-content">
        <div className="movie-poster">
          <img
            src={
              poster_path
                ? `https://image.tmdb.org/t/p/w500/${poster_path}`
                : "/no-movie.png"
            }
            alt={title}
          />
           {director && (
            <div className="director mt-6">
              <h3>Director</h3>
              <p>{director.name}</p>
            </div>
          )}

          {movie.production_companies && movie.production_companies.length > 0 && (
          <div className="production-logos mt-6">
            <h3>Produced by</h3>
            <div className="logos">
            {movie.production_companies.slice(0, 2).map((company) => (
              <div key={company.id} className="logos">
              {company.logo_path ? (
                <img
                src={`https://image.tmdb.org/t/p/w200/${company.logo_path}`}
                alt={company.name}
                />
              ) : (
                <p>{company.name}</p>
              )}
              </div>
            ))}
            </div>
          </div>
          )}
        </div>

        <div className="movie-info">
          <h1>{title}  ({release_date && (
              <span>{new Date(release_date).getFullYear()}</span>
            )})</h1>
          
          <div className="movie-meta">
            
            {runtime && <span>{runtime} min</span>}
            {vote_average && (
              <span className="rating">
                <img src="/star.svg" alt="rating" />
                {vote_average.toFixed(1)}
              </span>
            )}
          </div>

          {genres && (
            <div className="genres">
              {genres.map((genre) => (
                <span key={genre.id} className="genre">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="overview">
            <h3>Overview</h3>
            <p>{overview}</p>
          </div>
          {cast.length > 0 && (
            <div className="cast">
              <h3>Cast</h3>
              <div className="cast-list">
                {cast.map((person) => (
                  <div key={person.id} className="cast-member">
                    {person.profile_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w200/${person.profile_path}`}
                        alt={person.name}
                      />
                    )}
                    <p>{person.name}</p>
                    <p className="character">{person.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

       
        </div>
      </div>
      {trailer && (
            <div className="trailer mt-8">
              <h3>Trailer</h3>
              <div className="video-container">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Trailer"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
          
          {similar && similar.results && similar.results.length > 0 && (
            <div className="similar-movies">
              <h3>Similar Movies</h3>
              <div className="similar-movies-grid">
                {similar.results.slice(0, 8).map((movie) => (
                  <Link 
                    key={movie.id} 
                    to={`/movie/${movie.id}`} 
                    className="similar-movie-card"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w200/${movie.poster_path}`
                          : "/no-movie.png"
                      }
                      alt={movie.title}
                    />
                    <h4>{movie.title}</h4>
                    {movie.vote_average && (
                      <div className="rating">
                        <img src="/star.svg" alt="rating" />
                        <span>{movie.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
    </div>
  );
};

export default MovieDetails;