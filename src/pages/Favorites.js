import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faEdit, faSave, faPlus } from "@fortawesome/free-solid-svg-icons";
import "../styles/Favorites.css";

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editedNote, setEditedNote] = useState("");
    const sortedFavorites = [...favorites].sort((a, b) => {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
    });

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(storedFavorites);
    }, []);

    const toggleFavorite = (id) => {
        const updatedFavorites = favorites.filter((movie) => movie.id !== id);
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    const startEditing = (movie) => {
        setEditingId(movie.id);
        setEditedNote(movie.note || "");
    };

    const saveChanges = (id) => {
        const updatedFavorites = favorites.map((movie) =>
            movie.id === id
                ? { ...movie, note: editedNote }
                : movie
        );
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        setEditingId(null);
    };

    return (
        <div className="favorites-page">
            {favorites.length === 0 ? (
                <div className="not-fav-container">
                    <FontAwesomeIcon icon={faExclamationCircle} className="icon-ref" />
                    <p className="no-favorites">You have no favorite movies yet.</p>
                </div>
            ) : (
                <div className="favorites">
                    <h1>My Favorite Movies</h1>
                    <div className="favorites-grid">
                        {sortedFavorites.map((movie) => (
                            <div key={movie.id} className="movie-card">
                                <button
                                    className="favorite-button"
                                    onClick={() => toggleFavorite(movie.id)}
                                    title="Remove"
                                >
                                    <FontAwesomeIcon icon={faHeart} className="favorite-icon active" />
                                </button>
                                <Link to={`/movie/${movie.id}`} className="movie-link">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                        className="movie-poster"
                                    />
                                    <h3 className="movie-title">{movie.title}</h3>
                                </Link>
                                {editingId === movie.id ? (
                                    <div className="edit-form">
                                        <textarea
                                            value={editedNote}
                                            onChange={(e) => setEditedNote(e.target.value)}
                                            placeholder="Add a note..."
                                            className="edit-note"
                                        />
                                        <button onClick={() => saveChanges(movie.id)} className="save-button">
                                            <FontAwesomeIcon icon={faSave} /> Save
                                        </button>
                                    </div>
                                ) : (
                                    <div className="movie-details">
                                        {movie.note && <p className="movie-note">{movie.note}</p>}
                                        <button onClick={() => startEditing(movie)} className="edit-button">
                                            <FontAwesomeIcon icon={movie.note ? faEdit : faPlus} />{" "}
                                            {movie.note ? "Edit" : "Add Note"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Favorites;