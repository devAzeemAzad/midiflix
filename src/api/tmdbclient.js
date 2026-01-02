import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const hasTmdbApiKey = Boolean(API_KEY);
let warnedMissingKey = false;

// Create an axios instance with TMDB base URL
const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

export async function getTMDBData(endpoint, extraParams = {}) {
  try {
    if (!API_KEY) {
      if (!warnedMissingKey) {
        // Vite env vars are injected at build time. If this is missing on Netlify,
        // the build did not have VITE_TMDB_API_KEY configured.
        console.error(
          'TMDB API key missing. Set VITE_TMDB_API_KEY in your environment (Netlify: Site settings → Environment variables) and redeploy.'
        );
        warnedMissingKey = true;
      }
      return [];
    }

    const params = {
      api_key: API_KEY,
      ...extraParams 
    };

    const response = await tmdb.get(endpoint, { params });

    if (response.data && response.data.results) {
      return response.data.results;
    } else {
      return response.data;
    }
  } catch (error) {
    console.log('TMDB Fetch Error:', error);
    return [];
  }
}

export async function getMovieDetails(type,id) {
  try {
    if (!API_KEY) {
      if (!warnedMissingKey) {
        console.error(
          'TMDB API key missing. Set VITE_TMDB_API_KEY in your environment (Netlify: Site settings → Environment variables) and redeploy.'
        );
        warnedMissingKey = true;
      }
      return null;
    }

    const params = {
      api_key: API_KEY,
    };
    
    const response = await tmdb.get(`/${type}/${id}`, { params });
    return response.data;
  } catch (error) {
    console.log('TMDB Fetch Error:', error);
    return null;
  }
}

export async function getAllGenres(type) {
  try {
    if (!API_KEY) {
      if (!warnedMissingKey) {
        console.error(
          'TMDB API key missing. Set VITE_TMDB_API_KEY in your environment (Netlify: Site settings → Environment variables) and redeploy.'
        );
        warnedMissingKey = true;
      }
      return [];
    }

    const params = {
      api_key: API_KEY,
    };
    
    const response = await tmdb.get(`/genre/${type}/list`, { params });
    return response.data.genres;
  } catch (error) {
    console.log('TMDB Fetch Error:', error);
    return [];
  }
}

export default tmdb;
