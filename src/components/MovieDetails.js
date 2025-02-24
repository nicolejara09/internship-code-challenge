import React, { useEffect, useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import "../styles/MovieDetails.css";
import { dotSpinner } from 'ldrs';
import {
    fetchMovieDetails,
    fetchMovieCredits,
    fetchMovieImages,
    fetchMovieVideos,
} from "../services/tmdbService";
import { IMAGE_BASE_URL, YOUTUBE_BASE_URL } from "../config/ApiConfig";

dotSpinner.register();

const MovieDetails = () => {
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const getMovieDetails = async () => {
            try {
                const [movieData, castData, imagesData, videosData] = await Promise.all([
                    fetchMovieDetails(id),
                    fetchMovieCredits(id),
                    fetchMovieImages(id),
                    fetchMovieVideos(id),
                ]);

                setMovie(movieData);
                setCast(castData);
                setImages(imagesData);
                setVideos(videosData);
                setLoading(false);

                const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
                const isMovieFavorite = favorites.some((fav) => fav.id === movieData.id);
                setIsFavorite(isMovieFavorite);
            } catch (error) {
                console.error("Error fetching movie details:", error);
                setLoading(false);
            }
        };

        getMovieDetails();
    }, [id]);

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

    if (loading) {
        return (
            <div className="loading-container-ref">
                <l-dot-spinner size="40" speed="0.9" color="gray"></l-dot-spinner>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="not-found-container-ref">
                <FontAwesomeIcon icon={faExclamationCircle} className="icon-ref" />
                <p>The movie was not found.</p>
            </div>
        );
    }

    return (
        <div className="movie-details-container-ref">
            <div className="movie-card-details-ref">
                <div className="movie-poster-container-ref">
                    <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} />
                    <button className="favorite-ref" onClick={toggleFavorite}>
                        <FontAwesomeIcon
                            icon={isFavorite ? solidHeart : regularHeart}
                            className={isFavorite ? "favorite-icon-ref active" : "favorite-icon-ref"}
                        />
                    </button>
                </div>

                <div className="movie-info-ref">
                    <h1 className="movie-title-ref">{movie.title}</h1>
                    <p className="movie-tagline-ref">{movie.tagline}</p>
                    <p className="movie-overview-ref">{movie.overview}</p>
                    <p className="movie-genres-ref"><strong>Genres:</strong> {movie.genres.map((genre) => genre.name).join(", ")}</p>
                    <p className="movie-release-date-ref"><strong>Release Date:</strong> {movie.release_date}</p>
                    <p className="movie-rating-ref"><strong>Rating:</strong> ⭐ {movie.vote_average} / 10</p>
                </div>
            </div>

            <div className="movie-crew">
                <h2>Main Cast</h2>
                <div className="cast-grid-ref">
                    {cast.length > 0 ? (
                        cast.map((actor) => (
                            <div key={actor.id} className="cast-member-ref">
                                <img src={`${IMAGE_BASE_URL}${actor.profile_path}`} alt={actor.name} className="cast-image-ref" />
                                <p className="cast-name-ref">{actor.name}</p>
                                <p className="cast-character-ref">{actor.character}</p>
                            </div>
                        ))
                    ) : (
                        <p>No cast available.</p>
                    )}
                </div>
            </div>

            <div className="movie-gallery">
                <h2>Image Gallery</h2>
                <div className="gallery-grid-ref">
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <img key={index} src={`${IMAGE_BASE_URL}${image.file_path}`} alt={`Backdrop ${index + 1}`} className="gallery-image-ref" />
                        ))
                    ) : (
                        <p>No images available.</p>
                    )}
                </div>
            </div>

            <div className="movie-videos">
                <h2>Movie Trailer</h2>
                {videos.length > 0 ? (
                    <div className="video-container-ref">
                        <iframe
                            src={`${YOUTUBE_BASE_URL}${videos[0].key}`}
                            title="Trailer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <p>No trailer available.</p>
                )}
            </div>
        </div>
    );
};

export default MovieDetails;