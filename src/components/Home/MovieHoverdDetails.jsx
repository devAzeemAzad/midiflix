import { useEffect, useState } from "react";
import { Info, Play, PlusIcon, Star } from "lucide-react";
import { Link } from "react-router-dom";

const MovieHoverCard = ({
  movie,
  genres = [],
  position,
  onMouseLeave,
  onMouseEnter,
}) => {
  const [isCardVisible, setIsCardVisible] = useState(false);

  useEffect(() => {
    if (!movie) {
      setIsCardVisible(false);
      return;
    }
    const timer = setTimeout(() => setIsCardVisible(true), 1000);
    return () => clearTimeout(timer);
  }, [movie, position]);

  if (!movie || !position) return null;

  const type = movie.media_type || (movie.title ? "movie" : "tv");
  const detailsUrl = `/alldetails/${type}/${movie.id}`;

  const displayedGenres =
    Array.isArray(movie.genre_ids) && genres.length
      ? movie.genre_ids
          .map((id) => genres.find((g) => g.id === id)?.name)
          .filter(Boolean)
      : [];

  const title = movie.original_title || movie.name || "Untitled";
  const description = movie.overview || "No description";
  const rating = (movie.vote_average || 0).toFixed(1);
  const voteCountK = ((movie.vote_count || 0) / 1000).toFixed(1);
  const popularity = (movie.popularity || 0).toFixed(0);

  const date = movie.release_date || movie.first_air_date;
  const year = date ? new Date(date).getFullYear() : "N/A";

  const posterUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : "https://via.placeholder.com/300x160?text=No+Image";

  return (
    <div
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      style={{ left: `${position.x}px`, top: `${position.y - 300}px` }}
      className={`absolute z-50 w-72 overflow-hidden rounded-xl shadow-2xl bg-linear-to-b from-gray-900 to-black backdrop-blur-lg pointer-events-auto transition-all duration-300 ${
        isCardVisible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="relative h-32 w-full">
        <img className="h-full w-full object-cover" src={posterUrl} alt={title} />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
          <Star size={12} fill="white" />
          {rating}
        </div>
      </div>

      <div className="space-y-2 p-3">
        <div>
          <span className="text-xs text-gray-400">{year}</span>
          <h3 className="line-clamp-1 text-sm font-bold text-white">{title}</h3>
        </div>

        {displayedGenres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {displayedGenres.map((g, i) => (
              <span
                key={`${g}-${i}`}
                className="rounded-full bg-purple-600 px-2 py-1 text-xs font-semibold text-white"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        <p className="line-clamp-2 text-xs text-gray-300">{description}</p>

        <div className="flex gap-2 text-xs">
          <span className="rounded bg-blue-500/20 px-2 py-1 text-blue-300">
            {voteCountK}K
          </span>
          <span className="rounded bg-red-500/20 px-2 py-1 text-red-300">
            {popularity} 🔥
          </span>
        </div>

        <div className="flex gap-2">
          <a
            href={ type === "movie" ? `https://www.vidking.net/embed/${type}/${movie.id}`: `https://www.vidking.net/embed/${type}/${movie.id}/1/1`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg bg-red-600 py-2 text-xs font-semibold text-white transition-all hover:bg-red-700 active:scale-95 flex pointer-events-auto"
          >
            <Play size={14} fill="white" /> Play
          </a>

          <button className="flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 flex pointer-events-auto">
            <PlusIcon size={14} /> Add
          </button>

          <Link
            target="_blank"
            rel="noopener noreferrer"
            to={detailsUrl}
            title="Details"
            className="flex-1 cursor-pointer items-center justify-center rounded-lg bg-white/20 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/30 active:scale-95 flex pointer-events-auto"
          >
            <Info size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieHoverCard;
