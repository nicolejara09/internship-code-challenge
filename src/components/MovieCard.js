import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import "../styles/MovieCard.css";

const MovieCard = ({ movie }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isMovieFavorite = favorites.some((fav) => fav.id === movie.id);
    setIsFavorite(isMovieFavorite);
  }, [movie.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (isFavorite) {
        const updatedFavorites = favorites.filter((fav) => fav.id !== movie.id);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
        const updatedFavorites = [...favorites, { ...movie, note: "", rating: 0 }];
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
    setIsFavorite(!isFavorite);
};

  return (
    <div className="movie-card-ref">
      <Link to={`/movie/${movie.id}`} className="movie-link-ref">
        <div className="movie-poster-wrapper-ref">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="movie-poster-card-ref"
          />
        </div>
        <div className="movie-details-ref">
          <h3 className="movie-title-card-ref">{movie.title}</h3>
          <p className="movie-rating-card-ref">⭐ {movie.vote_average}</p>
        </div>
      </Link>
      <button className="favorite-button-ref" onClick={toggleFavorite}>
        <FontAwesomeIcon
          icon={isFavorite ? solidHeart : regularHeart}
          className={isFavorite ? "favorite-icon-ref active" : "favorite-icon-ref"}
        />
      </button>
    </div>
  );
};

export default MovieCard;
