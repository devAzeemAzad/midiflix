import { useEffect, useRef, useState } from "react";
import { getTMDBData, hasTmdbApiKey } from "../api/tmdbclient";
import { Star, Calendar, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import CustomDropdown from "../components/CustomDropdown/CustomDropdown";

const moviecategoryOptions = [
  { value: "movie/now_playing", label: "Now Playing" },
  { value: "movie/popular", label: "Popular" },
  { value: "movie/top_rated", label: "Top Rated" },
  { value: "movie/upcoming", label: "Upcoming" }
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
  { value: "37", label: "Western" }
];

const Movies = () => {
  if (!hasTmdbApiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
        <div className="max-w-xl text-center">
          <h1 className="text-2xl font-extrabold mb-2">TMDB API key missing</h1>
          <p className="text-gray-400">
            Set <span className="font-semibold text-gray-200">VITE_TMDB_API_KEY</span> in Netlify Environment variables and redeploy.
          </p>
        </div>
      </div>
    );
  }

  const [category, setCategory] = useState(moviecategoryOptions[0].value);
  const [genre, setGenre] = useState("");
  const [isCategoryDisabled, setIsCategoryDisabled] = useState(false);
  let wholepage = useRef();
  const [pages, setpages] = useState(1);
  const [movieDetials, setMovieDetials] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let response;
      if (genre && genre !== "") {
        response = await getTMDBData("/discover/movie", {
          with_genres: genre,
          language: "en-US",
          page: pages,
        });
      } else {
        response = await getTMDBData(category, {
          language: "en-US",
          page: pages,
        });
      }
      if (pages === 1) {
        setMovieDetials(response || []);
      } else {
        setMovieDetials((prev) => [...prev, ...(response || [])]);
      }
    };
    fetchData();
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setpages((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (wholepage.current) {
      observer.observe(wholepage.current);
    }
    return () => observer.disconnect();
  }, [pages, category, genre]);

  useEffect(() => {
    setpages(1);
    setMovieDetials([]);
  }, [category, genre]);

  return (
    <div className="min-h-screen py-5 px-4 bg-black relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-linear-to-br from-orange-900/20 via-black to-yellow-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]"></div>
      
      {/* Header Section */}
      <div className="relative z-50 mb-5 px-5 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-6xl md:text-7xl font-black bg-linear-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl mb-2">
            Movies
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Discover your next favorite film</p>
        </div>
        
        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <CustomDropdown
            value={category}
            onChange={(value) => {
              setCategory(value);
              setGenre("");
              setIsCategoryDisabled(false);
            }}
            options={moviecategoryOptions}
            borderColor="orange-500"
          />
          <CustomDropdown
            value={genre}
            onChange={(value) => {
              setGenre(value);
              if (value && value !== "") {
                setIsCategoryDisabled(true);
              } else {
                setIsCategoryDisabled(false);
                setCategory(moviecategoryOptions[0].value);
              }
            }}
            options={genrecategoryOptions}
            borderColor="yellow-500"
          />
        </div>
      </div>
      
      {/* Category Title */}
      <div className="relative z-10 max-w-7xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <TrendingUp className="text-orange-400" size={32} />
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
            {isCategoryDisabled
              ? (genrecategoryOptions.find(opt => opt.value === genre)?.label)
              : (moviecategoryOptions.find(opt => opt.value === category)?.label)}
          </h2>
        </div>
        
        {/* Movies Grid */}
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movieDetials &&
            movieDetials.map((item, index) => (
              <Link target="_blank"
                key={index}
                to={`/alldetails/movie/${item.id}`}
                className="group relative rounded-2xl overflow-hidden bg-gray-900/50 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/30"
              >
                {/* Movie Poster */}
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
                  
                  {/* Rating Badge */}
                  {item.vote_average > 0 && (
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-yellow-500/50 flex items-center gap-1.5 shadow-lg">
                      <Star size={14} fill="#eab308" className="text-yellow-500" />
                      <span className="text-white font-bold text-sm">{item.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                </div>
                
                {/* Movie Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black via-black/95 to-transparent">
                  <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 mb-2 group-hover:text-orange-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  {/* Release Date */}
                  {item.release_date && (
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Calendar size={12} />
                      <span>{new Date(item.release_date).getFullYear()}</span>
                    </div>
                  )}
                </div>
                
                {/* Hover Effect Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 via-transparent to-yellow-500/20"></div>
                </div>
              </Link>
            ))}
          <div ref={wholepage} className="h-1"></div>
        </div>
        
        {/* Loading Indicator */}
        {movieDetials.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-4"></div>
            <p className="text-gray-400 text-lg">Loading amazing movies...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
