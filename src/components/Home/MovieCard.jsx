import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ item, onMouseEnter, onMouseLeave }) => (
  <Link 
    to={`/alldetails/${item.media_type || (item.title ? 'movie' : 'tv')}/${item.id}`}
    className="relative min-w-[200px] max-w-[200px] h-70 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group block"
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <img
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 bg-gray-900"
      src={
        item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : "https://via.placeholder.com/235x288?text=No+Image"
      }
      alt={item.original_title || item.name}
      loading="lazy"
    />
    <div className="absolute bottom-0 left-0 w-full h-full p-4 flex flex-col justify-end bg-linear-to-t from-black/90 via-black/60 to-transparent">
      <h2 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors duration-200">
        {item.title || item.name}
      </h2>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-300 font-medium">
          {item.release_date || item.first_air_date
            ? new Date(item.release_date || item.first_air_date).getFullYear()
            : "N/A"}
        </span>
        <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1 border border-yellow-500/30">
          ⭐ {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
        </span>
      </div>
    </div>
  </Link>
);

export default MovieCard;
