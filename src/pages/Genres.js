import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { fetchMoviesByGenre } from "../services/tmdbService";
import "../styles/Genres.css";

const Genres = () => {
    const { genreId } = useParams();
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const location = useLocation();
    const { genreName } = location.state || {};
    const observerRef = useRef(null);

    useEffect(() => {
        setMovies([]);
        setPage(1);
        setHasMore(true);
        setError(null);
    }, [genreId]);

    useEffect(() => {
        const getMovies = async () => {
            try {
                setLoading(true);
                const data = await fetchMoviesByGenre(genreId, page);

                if (data.results.length === 0) {
                    setHasMore(false);
                } else {
                    setMovies((prevMovies) => [...prevMovies, ...data.results]);
                    setError(null);
                }
            } catch (err) {
                console.error("Error fetching movies:", err);
                setError("Failed to load movie list.");
            } finally {
                setLoading(false);
            }
        };

        getMovies();
    }, [genreId, page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 1.0 }
        );

        const currentObserverRef = observerRef.current;
        if (currentObserverRef) {
            observer.observe(currentObserverRef);
        }

        return () => {
            if (currentObserverRef) {
                observer.unobserve(currentObserverRef);
            }
        };
    }, [hasMore, loading]);

    return (
        <div className="genres-page">
            {loading && movies.length === 0 && (
                <div className="loading-container">
                    <l-dot-spinner size="40" speed="0.9" color="gray"></l-dot-spinner>
                </div>
            )}
            <h1 className="genre-title">{genreName} Genre Movies</h1>
            {error && <p className="error">{error}</p>}
            <div className="movie-grid">
                {movies.length > 0 ? (
                    movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
                ) : (
                    !loading && <p>No movies available</p>
                )}
            </div>
            {loading && movies.length > 0 && (
                <div className="pagination-loading-container">
                    <l-dot-spinner size="40" speed="0.9" color="gray"></l-dot-spinner>
                    <p className="pagination-loading-text">Loading more movies...</p>
                </div>
            )}
            <div ref={observerRef} className="observer-trigger"></div>
        </div>
    );
};

export default Genres;
