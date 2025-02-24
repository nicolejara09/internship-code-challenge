import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import "../styles/SearchResults.css";
import { searchMovies } from "../services/tmdbService";

const SearchResults = () => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [query, setQuery] = useState("");
    const observerRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const newQuery = new URLSearchParams(location.search).get("query") || "";
        if (newQuery !== query) {
            setMovies([]);
            setPage(1);
            setHasMore(true);
            setQuery(newQuery);
        }
    }, [location.search, query]);

    useEffect(() => {
        const fetchMovies = async () => {
            if (!query) return;

            setLoading(true);

            try {
                const newMovies = await searchMovies(query, page);

                if (newMovies.length === 0) {
                    setHasMore(false);
                } else {
                    setMovies((prevMovies) => [...prevMovies, ...newMovies]);
                }
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [query, page]);

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
        <div className="search-results">
            <h2>
                {query
                    ? `Search Results for "${query}"`
                    : "Please search for a movie"}
            </h2>
            <div className="movie-grid">
                {movies.length > 0 ? (
                    movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
                ) : (
                    !loading && <p>No movies found.</p>
                )}
            </div>
            {loading && movies.length === 0 && (
                <div className="loading-container">
                    <l-dot-spinner size="40" speed="0.9" color="gray"></l-dot-spinner>
                </div>
            )}
            {loading && movies.length > 0 && (
                <div className="pagination-loading-container">
                    <l-dot-spinner size="40" speed="0.9" color="gray"></l-dot-spinner>
                    <p className="pagination-loading-text">Loading more results...</p>
                </div>
            )}
            <div ref={observerRef} className="observer-trigger"></div>
        </div>
    );
};

export default SearchResults;