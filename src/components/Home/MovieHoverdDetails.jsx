import React, { useState, useEffect } from "react";
import { PlusIcon, Star, Play, Info } from "lucide-react";
import { Link } from "react-router-dom";


const MovieHoverCard = ({ movie, genres = [], position, onMouseLeave, onMouseEnter }) => {

  const [isCardVisible, setIsCardVisible] = useState(false);
  useEffect(() => {
    if (!movie) {
      setIsCardVisible(false);
      return;
    }
    const showCardTimer = setTimeout(() => setIsCardVisible(true), 1000);
    return () => clearTimeout(showCardTimer);
  }, [movie, position]);

  
  const getGenreNamesFromIds = (genreIds) => {
    if (!genreIds || !Array.isArray(genres) || genres.length === 0) return [];
    return genreIds
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean);
  };


  

  if (!movie || !position) return null;

  const detailsType = movie.media_type || (movie.title ? "movie" : "tv");
  const detailsUrl = `/alldetails/${detailsType}/${movie.id}`;

  // Extract and format all needed data
  const displayedGenres = getGenreNamesFromIds(movie.genre_ids);
  const movieRating = (movie.vote_average || 0).toFixed(1);
  const releaseYear = movie.release_date || movie.first_air_date
    ? new Date(movie.release_date || movie.first_air_date).getFullYear()
    : "N/A";
  const voteCountInThousands = ((movie.vote_count || 0) / 1000).toFixed(1);
  const popularityScore = (movie.popularity || 0).toFixed(0);
  const movieTitle = movie.original_title || movie.name || "Untitled";
  const movieDescription = movie.overview || "No description";
  const posterUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : "https://via.placeholder.com/300x160?text=No+Image";

  return (
    <div
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      style={{ left: `${position.x}px`, top: `${position.y - 300}px` }}
      className={`absolute z-50 w-72 rounded-xl shadow-2xl overflow-hidden bg-gradient-to-b from-gray-900 to-black backdrop-blur-lg pointer-events-auto transition-all duration-300 ${
        isCardVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {/* POSTER IMAGE WITH OVERLAY */}
      <div className="relative w-full h-32">
        <img
          className="w-full h-full object-cover"
          src={posterUrl}
          alt={movieTitle}
        />
        {/* GRADIENT OVERLAY ON IMAGE */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* RATING BADGE */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          <Star size={12} fill="white" />
          {movieRating}
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-3 space-y-2">
        {/* YEAR AND TITLE */}
        <div>
          <span className="text-xs text-gray-400">
            {releaseYear}
          </span>
          <h3 className="text-white font-bold text-sm line-clamp-1">
            {movieTitle}
          </h3>
        </div>
        
        {/* GENRE BADGES */}
        {displayedGenres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {displayedGenres.map((genre, idx) => (
              <span key={idx} className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {genre}
              </span>
            ))}
          </div>
        )}
        
        {/* DESCRIPTION */}
        <p className="text-gray-300 text-xs line-clamp-2">
          {movieDescription}
        </p>

        {/* STATS */}
        <div className="flex gap-2 text-xs">
          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
            {voteCountInThousands}K
          </span>
          <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded">
            {popularityScore} 🔥
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          {/* PLAY BUTTON */}
          <a
            href={`https://www.vidking.net/embed/${
              (movie.media_type || (movie.title ? "movie" : "tv")) === "tv" ? "tv" : "movie"}/${movie.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-red-600 hover:bg-red-700 active:scale-95 py-2 rounded-lg transition-all text-white text-xs font-semibold flex items-center justify-center gap-1 pointer-events-auto cursor-pointer"
          >
            <Play size={14} fill="white" /> Play
          </a>

          {/* ADD TO LIST BUTTON */}
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 py-2 rounded-lg transition-all text-white text-xs font-semibold flex items-center justify-center gap-1 pointer-events-auto cursor-pointer">
            <PlusIcon size={14} /> Add
          </button>

          {/* DETAILS BUTTON */}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            to={detailsUrl}
            title="Details"
            className="flex-1 bg-white/20 hover:bg-white/30 active:scale-95 py-2 rounded-lg transition-all text-white text-xs font-semibold flex items-center justify-center backdrop-blur-md pointer-events-auto cursor-pointer"
          >
            <Info size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieHoverCard;
