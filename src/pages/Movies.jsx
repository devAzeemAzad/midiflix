import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Calendar, Star, TrendingUp } from "lucide-react";

import { getTMDBData, hasTmdbApiKey } from "../api/tmdbclient";
import CustomDropdown from "../components/CustomDropdown/CustomDropdown";

const moviecategoryOptions = [
  { value: "/now_playing", label: "Now Playing" },
  { value: "/popular", label: "Popular" },
  { value: "/top_rated", label: "Top Rated" },
  { value: "/upcoming", label: "Upcoming" },
];

const genrecategoryOptions = [
  { value: "", label: "All Genres" },
  { value: "28", label: "Action" },
  { value: "12", label: "Adventure" },
  { value: "16", label: "Animation" },
  { value: "35", label: "Comedy" },
  { value: "80", label: "Crime" },
  { value: "99", label: "Documentary" },
  { value: "18", label: "Drama" },
  { value: "10751", label: "Family" },
  { value: "14", label: "Fantasy" },
  { value: "36", label: "History" },
  { value: "27", label: "Horror" },
  { value: "10402", label: "Music" },
  { value: "9648", label: "Mystery" },
  { value: "10749", label: "Romance" },
  { value: "878", label: "Science Fiction" },
  { value: "10770", label: "TV Movie" },
  { value: "53", label: "Thriller" },
  { value: "10752", label: "War" },
  { value: "37", label: "Western" },
];

const DEFAULT_CATEGORY = moviecategoryOptions[0].value;

const normalizeCategoryValue = (value) => {
  if (!value) return DEFAULT_CATEGORY;
  return value.startsWith("/") ? value : `/${value}`;
};

const toRouteParam = (value) => String(value ?? "").replace(/^\/+/, "");

const Movies = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, });
  }, [])
  
  const { categorydata } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(() =>
    normalizeCategoryValue(categorydata)
  );
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [sentinel, setSentinel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isGenreMode = Boolean(genre);
  const currentTitle = isGenreMode
    ? genrecategoryOptions.find((opt) => opt.value === genre)?.label
    : moviecategoryOptions.find((opt) => opt.value === category)?.label;

  // Sync dropdown with route param (e.g. /movie/popular)
  useEffect(() => {
    if (!categorydata) return;
    setGenre("");
    setCategory(normalizeCategoryValue(categorydata));
  }, [categorydata]);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
    setMovies([]);
  }, [category, genre]);

  // Fetch data whenever page/filter changes
  useEffect(() => {
    if (!hasTmdbApiKey) return;

    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const endpoint = isGenreMode ? "discover/movie" : `movie${category}`;
        const params = isGenreMode
          ? { with_genres: genre, language: "en-US", page }
          : { language: "en-US", page };

        const response = await getTMDBData(endpoint, params);
        if (cancelled) return;

        setMovies((prev) =>
          page === 1 ? response || [] : [...prev, ...(response || [])]
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [page, category, genre, isGenreMode]);

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isLoading) return;
        // Avoid auto-incrementing page when the grid is empty (e.g. right after
        // changing a filter), which can cancel the page=1 fetch and look like
        // "nothing loads".
        if (movies.length === 0) return;
        if (entries[0]?.isIntersecting) setPage((p) => p + 1);
      },
      { threshold: 1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinel, isLoading, movies.length]);


  return (
    <div className="min-h-screen py-5 px-4 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-orange-900/20 via-black to-yellow-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]" />

      <div className="relative z-50 mb-5 px-5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-6xl md:text-7xl font-black bg-linear-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl mb-2">
            Movies
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Discover your next favorite film
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <CustomDropdown
            value={category}
            onChange={(value) => {
              setCategory(value);
              setGenre("");

              const categoryParam = toRouteParam(value);
              navigate(categoryParam ? `/movie/${categoryParam}` : "/movie");
            }}
            options={moviecategoryOptions}
            borderColor="orange-500"
          />

          <CustomDropdown
            value={genre}
            onChange={(value) => {
              setGenre(value);

              if (!value) {
                const defaultParam = toRouteParam(DEFAULT_CATEGORY);
                navigate(defaultParam ? `/movie/${defaultParam}` : "/movie");
              }
            }}
            options={genrecategoryOptions}
            borderColor="yellow-500"
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <TrendingUp className="text-orange-400" size={32} />
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
            {currentTitle}
          </h2>
        </div>

        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((item) => (
            <Link
              target="_blank"
              key={item.id}
              to={`/alldetails/movie/${item.id}`}
              className="group relative rounded-2xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30"
            >
              <div className="relative overflow-hidden">
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
                      : "https://via.placeholder.com/342x513?text=No+Image"
                  }
                  alt={item.title || "Movie Poster"}
                  className="w-full h-72 sm:h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {item.vote_average > 0 && (
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-yellow-500/50 flex items-center gap-1.5 shadow-lg">
                    <Star
                      size={14}
                      fill="#eab308"
                      className="text-yellow-500"
                    />
                    <span className="text-white font-bold text-sm">
                      {item.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black via-black/95 to-transparent">
                <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 mb-2 group-hover:text-orange-400 transition-colors duration-300">
                  {item.title}
                </h3>

                {item.release_date && (
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <Calendar size={12} />
                    <span>{new Date(item.release_date).getFullYear()}</span>
                  </div>
                )}
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 via-transparent to-yellow-500/20" />
              </div>
            </Link>
          ))}

          <div ref={setSentinel} className="h-1" />
        </div>

        {movies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-4" />
            <p className="text-gray-400 text-lg">Loading amazing movies...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
