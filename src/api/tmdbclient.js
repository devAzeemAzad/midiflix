import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const hasTmdbApiKey = Boolean(API_KEY);
let warnedMissingKey = false;
let warnedInvalidKey = false;

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

    const normalizedEndpoint = String(endpoint || "").replace(/^\//, "");
    const response = await tmdb.get(normalizedEndpoint, { params });

    if (response.data && response.data.results) {
      return response.data.results;
    } else {
      return response.data;
    }
  } catch (error) {
    const status = error?.response?.status;
    if ((status === 401 || status === 403) && !warnedInvalidKey) {
      console.error(
        'Invalid TMDB API key. Verify VITE_TMDB_API_KEY is a valid TMDB v3 API key and restart the dev server.'
      );
      warnedInvalidKey = true;
    }

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
    
    const normalizedEndpoint = String(`/${type}/${id}`).replace(/^\//, "");
    const response = await tmdb.get(normalizedEndpoint, { params });
    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    if ((status === 401 || status === 403) && !warnedInvalidKey) {
      console.error(
        'Invalid TMDB API key. Verify VITE_TMDB_API_KEY is a valid TMDB v3 API key and restart the dev server.'
      );
      warnedInvalidKey = true;
    }

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
    
    const normalizedEndpoint = String(`/genre/${type}/list`).replace(/^\//, "");
    const response = await tmdb.get(normalizedEndpoint, { params });
    return response.data.genres;
  } catch (error) {
    const status = error?.response?.status;
    if ((status === 401 || status === 403) && !warnedInvalidKey) {
      console.error(
        'Invalid TMDB API key. Verify VITE_TMDB_API_KEY is a valid TMDB v3 API key and restart the dev server.'
      );
      warnedInvalidKey = true;
    }

    console.log('TMDB Fetch Error:', error);
    return [];
  }
}

export default tmdb;
