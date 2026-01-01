# 🎬 How to Add Genres to Hover Card

## 📋 Overview

The TMDB API list endpoints don't include genre information. To display genres in the hover card, you need to:
1. Fetch movie details when hovering
2. Get genre IDs from the movie data
3. Map genre IDs to genre names using TMDB's genre list

---

## 🔧 Step 1: Update tmdbclient.js to Fetch Genres and Movie Details

Add a new function to fetch movie details with genres:

```javascript
// In d:\CODING\React JS\01\midiflix\src\api\tmdbclient.js

// Add this new function to fetch movie details
export async function getMovieDetails(movieId) {
  try {
    const params = {
      api_key: API_KEY,
    };
    
    const response = await tmdb.get(`/movie/${movieId}`, { params });
    return response.data; // Returns full movie details including genres
  } catch (error) {
    console.log('TMDB Fetch Error:', error);
    return null;
  }
}

// Add this to fetch all genres
export async function getAllGenres() {
  try {
    const params = {
      api_key: API_KEY,
    };
    
    const response = await tmdb.get('/genre/movie/list', { params });
    return response.data.genres; // Returns array of genres
  } catch (error) {
    console.log('TMDB Fetch Error:', error);
    return [];
  }
}
```

---

## 🎯 Step 2: Update MovieCorasol.jsx to Fetch Genres

Add a state to store genres and fetch them on mount:

```javascript
import { getAllGenres } from "../api/tmdbclient";

const MovieCorasol = ({movies}) => {
    const [hoveredMovie, setHoveredMovie] = useState(null);
    const [genres, setGenres] = useState({}); // Add this
    const [hoverPosition, setHoverPosition] = useState(null);
    const hideTimeoutRef = useRef(null);

    // Add this useEffect to fetch genres once
    useEffect(() => {
      const fetchGenres = async () => {
        const genreList = await getAllGenres();
        // Convert array to object for easy lookup
        // { 28: "Action", 12: "Adventure", ... }
        const genreMap = {};
        genreList.forEach(genre => {
          genreMap[genre.id] = genre.name;
        });
        setGenres(genreMap);
      };
      fetchGenres();
    }, []);

    // Rest of the component...
```

Pass genres to MovieHoverdDetails:

```javascript
<MovieHoverdDetails 
  movie={hoveredMovie}
  genres={genres}
  position={hoverPosition}
  onMouseLeave={handleHoverCardLeave}
  onMouseEnter={handleHoverCardEnter}
/>
```

---

## 💎 Step 3: Update MovieHoverdDetails.jsx to Show Genres

{% raw %}
```javascript
import React, { useState, useEffect } from "react";
import { PlusIcon, Star, Play, Info } from "lucide-react";

const MovieHoverdDetails = ({ movie, position, genres, onMouseLeave, onMouseEnter }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!movie) {
      setIsVisible(false);
      return;
    }
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, [movie, position]);

  if (!movie || !position) return null;

  // Get genre names from IDs
  const genreNames = movie.genre_ids?.map(id => genres[id]).filter(Boolean) || [];

  return (
    <div
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      style={{ left: `${position.x}px`, top: `${position.y - 300}px` }}
      className={`absolute z-50 w-72 rounded-xl shadow-2xl overflow-hidden bg-linear-to-b from-gray-900 to-black backdrop-blur-lg pointer-events-auto transition-all duration-300 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {/* ... existing image and rating code ... */}

      <div className="p-3 space-y-2">
        <div>
          <span className="text-xs text-gray-400">
            {movie.release_date || movie.first_air_date
              ? new Date(movie.release_date || movie.first_air_date).getFullYear()
              : "N/A"}
          </span>
          <h3 className="text-white font-bold text-sm line-clamp-1">
            {movie.original_title || movie.name}
          </h3>
        </div>

        {/* ADD THIS: Genre Tags */}
        {genreNames.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {genreNames.map((genre, index) => (
              <span 
                key={index}
                className="bg-purple-500/30 text-purple-300 text-xs px-2 py-1 rounded-full border border-purple-500/50"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        <p className="text-gray-300 text-xs line-clamp-2">
          {movie.overview || "No description"}
        </p>

        {/* ... rest of existing code ... */}
      </div>
    </div>
  );
};

export default MovieHoverdDetails;
```
{% endraw %}

---

## 📊 Visual Result

```
Hover Card Layout:
┌─────────────────────────┐
│ Movie Image + Rating    │
├─────────────────────────┤
│ Release Year            │
│ Movie Title             │
│ [Action] [Sci-Fi]       │ ← GENRES
│ [Thriller]              │
│                         │
│ Movie description...    │
│                         │
│ [Play] [Add] [Details]  │
└─────────────────────────┘
```

---

## 🎨 Customization Options

### Option 1: Inline Genres (Side by Side)
```jsx
<div className="flex flex-wrap gap-1">
  {genreNames.slice(0, 2).map((genre) => (
    <span className="bg-purple-500/30 text-purple-300 text-xs px-2 py-1 rounded-full">
      {genre}
    </span>
  ))}
</div>
```

### Option 2: Comma Separated Text
```jsx
<p className="text-gray-400 text-xs">
  Genres: {genreNames.join(", ")}
</p>
```

### Option 3: Colored Badges by Genre
```jsx
const getGenreColor = (genre) => {
  const colorMap = {
    "Action": "bg-red-500/30 text-red-300",
    "Comedy": "bg-yellow-500/30 text-yellow-300",
    "Drama": "bg-blue-500/30 text-blue-300",
    "Horror": "bg-purple-500/30 text-purple-300",
  };
  return colorMap[genre] || "bg-gray-500/30 text-gray-300";
};

{genreNames.map((genre) => (
  <span className={`text-xs px-2 py-1 rounded-full ${getGenreColor(genre)}`}>
    {genre}
  </span>
))}
```

---

## ⚠️ Important Notes

1. **TMDB Data Structure:**
   - List endpoints return `genre_ids` (array of IDs)
   - Detail endpoints return `genres` (array of objects with id and name)

2. **Performance:**
   - Genres are fetched once and cached
   - No additional API calls per hover

3. **Fallback:**
   - If genres aren't available, the section won't show
   - No errors if genre data is missing

---

## 🚀 Complete Code Example

**tmdbclient.js** - Add these functions:
```javascript
export async function getMovieDetails(movieId) {
  try {
    const params = { api_key: API_KEY };
    const response = await tmdb.get(`/movie/${movieId}`, { params });
    return response.data;
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
}

export async function getAllGenres() {
  try {
    const params = { api_key: API_KEY };
    const response = await tmdb.get('/genre/movie/list', { params });
    return response.data.genres;
  } catch (error) {
    console.log('Error:', error);
    return [];
  }
}
```

**MovieCorasol.jsx** - Add genre fetching:
```javascript
const [genres, setGenres] = useState({});

useEffect(() => {
  const fetchGenres = async () => {
    const genreList = await getAllGenres();
    const genreMap = {};
    genreList.forEach(g => { genreMap[g.id] = g.name; });
    setGenres(genreMap);
  };
  fetchGenres();
}, []);
```

**MovieHoverdDetails.jsx** - Display genres:
```javascript
const genreNames = movie.genre_ids?.map(id => genres[id]).filter(Boolean) || [];

// In JSX:
{genreNames.length > 0 && (
  <div className="flex flex-wrap gap-1">
    {genreNames.map((genre, i) => (
      <span key={i} className="bg-purple-500/30 text-purple-300 text-xs px-2 py-1 rounded-full">
        {genre}
      </span>
    ))}
  </div>
)}
```

---

That's it! Now your hover card will display movie genres! 🎬
