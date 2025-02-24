import axios from "axios";
import { BEARER_TOKEN, API_BASE_URL } from "../config/ApiConfig";

export const fetchPopularMovies = async () => {
    const url = `${API_BASE_URL}/movie/popular`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error("Error fetching popular movies:", error);
        throw error;
    }
};

export const fetchTopRatedMovies = async () => {
    const url = `${API_BASE_URL}/movie/top_rated`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error("Error fetching top rated movies:", error);
        throw error;
    }
};

export const fetchUpcomingMovies = async () => {
    const url = `${API_BASE_URL}/movie/upcoming`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error("Error fetching upcoming movies:", error);
        throw error;
    }
};

export const fetchMoviesByGenre = async (genreId, page = 1) => {
    const url = `${API_BASE_URL}/discover/movie`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
            params: {
                with_genres: genreId,
                page: page,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
};

export const fetchGenres = async () => {
    const url = `${API_BASE_URL}/genre/movie/list`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
            params: {
                language: "en",
            },
        });
        return response.data.genres;
    } catch (error) {
        console.error("Error fetching genres:", error);
        throw error;
    }
};

export const searchMovies = async (query, page = 1) => {
    const url = `${API_BASE_URL}/search/movie`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
            params: {
                query: query,
                include_adult: false,
                language: "en-US",
                page: page,
            },
        });
        return response.data.results.filter(
            (movie) => movie.poster_path && movie.title && movie.overview
        );
    } catch (error) {
        console.error("Error searching movies:", error);
        throw error;
    }
};

export const fetchMovieDetails = async (id) => {
    const url = `${API_BASE_URL}/movie/${id}`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching movie details:", error);
        throw error;
    }
};

export const fetchMovieCredits = async (id) => {
    const url = `${API_BASE_URL}/movie/${id}/credits`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
        });
        return response.data.cast.slice(0, 5);
    } catch (error) {
        console.error("Error fetching movie credits:", error);
        throw error;
    }
};

export const fetchMovieImages = async (id) => {
    const url = `${API_BASE_URL}/movie/${id}/images`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
        });
        return response.data.backdrops.slice(0, 5);
    } catch (error) {
        console.error("Error fetching movie images:", error);
        throw error;
    }
};

export const fetchMovieVideos = async (id) => {
    const url = `${API_BASE_URL}/movie/${id}/videos`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
        });
        return response.data.results.filter((video) => video.site === "YouTube");
    } catch (error) {
        console.error("Error fetching movie videos:", error);
        throw error;
    }
};
