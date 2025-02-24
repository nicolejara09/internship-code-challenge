import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import MovieDetails from "./components/MovieDetails";
import Footer from "./components/Footer";
import Genres from "./pages/Genres";
import Favorites from "./pages/Favorites";
import SearchResults from "./components/SearchResults";
import "./styles/Themes.css";

const App = () => {
  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (movie) => {
    if (!favorites.some((fav) => fav.id === movie.id)) {
      setFavorites([...favorites, movie]);
    }
  };

  const removeFromFavorites = (movie) => {
    setFavorites(favorites.filter((fav) => fav.id !== movie.id));
  };

  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  favorites={favorites}
                  addToFavorites={addToFavorites}
                  removeFromFavorites={removeFromFavorites}
                />
              }
            />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/genre/:genreId" element={<Genres />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
