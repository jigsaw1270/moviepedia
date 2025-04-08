import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  // Safely destructure movie object with fallbacks
  const { 
    id,
    title = 'Unknown Title', 
    vote_average = 'N/A', 
    poster_path = null, 
    release_date = 'Unknown Date', 
    original_language = 'N/A' 
  } = movie || {};

  return (
    <Link to={`/movie/${id}`} className="movie-card-link">
      <div className="movie-card">
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : "/no-movie.png"
          }
          alt={title}
        />
        <div className="mt-4">
          <h3>{title}</h3>
          <div className="content">
            <div className="rating">
              <img src="/star.svg" alt="star" />
              <p>{vote_average ? (typeof vote_average === 'number' ? vote_average.toFixed(1) : vote_average) : "N/A"}</p>
            </div>
            <span>.</span>
            <p className="lang">{original_language}</p>
            <span>.</span>
            <p className="year">
              {release_date ? release_date.split("-")[0] : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
