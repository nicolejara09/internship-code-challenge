import React, { useEffect, useState, useRef } from "react";
import MovieCard from "../components/MovieCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import {
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
} from "../services/tmdbService";
import "../styles/Home.css";

const Home = ({ favorites, addToFavorites, removeFromFavorites }) => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const popularRef = useRef(null);
  const topRatedRef = useRef(null);
  const upcomingRef = useRef(null);

  const scrollInterval = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popular, topRated, upcoming] = await Promise.all([
          fetchPopularMovies(),
          fetchTopRatedMovies(),
          fetchUpcomingMovies(),
        ]);

        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setUpcomingMovies(upcoming);
        setError(null);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Movies cannot be loaded. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const startScroll = (ref, direction, amount = 520, speed = 100) => {
    scrollInterval.current = setInterval(() => {
      if (ref.current) {
        ref.current.scrollBy({
          left: direction === "left" ? -amount : amount,
        });
      }
    }, speed);
  };

  const stopScroll = () => {
    clearInterval(scrollInterval.current);
  };

  const renderCategory = (title, movies, ref) => (
    <div className="category-section">
      <h2 className="category-title">{title}</h2>
      <div className="scroll-buttons">
        <button
          onMouseDown={() => startScroll(ref, "left")}
          onMouseUp={stopScroll}
          onMouseLeave={stopScroll}
          className="scroll-left"
        >
          &#8249;
        </button>
        <button
          onMouseDown={() => startScroll(ref, "right")}
          onMouseUp={stopScroll}
          onMouseLeave={stopScroll}
          className="scroll-right"
        >
          &#8250;
        </button>
      </div>
      <div className="movie-list" ref={ref}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={favorites.some((fav) => fav.id === movie.id)}
            onAddToFavorites={addToFavorites}
            onRemoveFromFavorites={removeFromFavorites}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <l-dot-spinner size="40" speed="0.9" color="gray"></l-dot-spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="not-found-container">
        <FontAwesomeIcon icon={faExclamationCircle} className="icon-ref" />
        <p>The movies have not been shown.</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {loading ? (
        <div className="loading-container">
          <l-dot-spinner size="40" speed="0.9" color="gray"></l-dot-spinner>
        </div>
      ) : (
        <>
          {renderCategory("Popular Movies", popularMovies, popularRef)}
          {renderCategory("Top Rated Movies", topRatedMovies, topRatedRef)}
          {renderCategory("Upcoming Movies", upcomingMovies, upcomingRef)}
        </>
      )}
    </div>
  );
};

export default Home;