import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchGenres } from "../services/tmdbService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Lightbulb } from "@theme-toggles/react";
import "@theme-toggles/react/css/Lightbulb.css";
import "../styles/NavBar.css";

const Navbar = () => {
    const [genres, setGenres] = useState([]);
    const [theme, setTheme] = useState("light");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    useEffect(() => {
        const getGenres = async () => {
            try {
                const data = await fetchGenres();
                setGenres(data);
            } catch (error) {
                console.error("Error fetching genres:", error);
                setGenres([]);
            }
        };

        getGenres();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="navBar">
            <div className="navbar-left">
                <Link to="/" className="navbar-brand no-link-style">
                    MoviesHW
                </Link>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/favorites" className="navbar-link">
                            Favorites
                        </Link>
                    </li>
                    <li className="nav-item dropdown" ref={dropdownRef}>
                        <span
                            className="navbar-link dropdown-toggle"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{ cursor: "pointer" }}
                        >
                            Genres
                        </span>
                        <ul
                            className={`dropdown-menu ${isDropdownOpen ? "open" : ""}`}
                            style={{
                                display: isDropdownOpen ? "block" : "none",
                            }}
                        >
                            {genres && genres.length > 0 ? (
                                genres.map((genre) => (
                                    <li key={genre.id} className="dropdown-item">
                                        <Link
                                            to={{
                                                pathname: `/genre/${genre.id}`,
                                            }}
                                            state={{ genreName: genre.name }}
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            {genre.name}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li>No genres available.</li>
                            )}
                        </ul>
                    </li>
                </ul>
            </div>

            <div className="search-and-theme">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </form>

                <div className="theme-toggle">
                    <Lightbulb duration={750} toggled={theme === "dark"} toggle={toggleTheme} />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;