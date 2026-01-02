import React, { useEffect, useState } from "react";
import { MoveLeft, MoveRight, Plus, Play, Info } from "lucide-react";
import { getAllGenres, getTMDBData, hasTmdbApiKey } from "../../api/tmdbclient";

const HeroCarousel = () => {
  if (!hasTmdbApiKey) {
    return (
      <section className="w-full h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-xl text-center text-white">
          <h1 className="text-2xl font-extrabold mb-2">TMDB API key missing</h1>
          <p className="text-gray-400">
            Set{" "}
            <span className="font-semibold text-gray-200">
              VITE_TMDB_API_KEY
            </span>{" "}
            in Netlify Environment variables and redeploy.
          </p>
        </div>
      </section>
    );
  }

  // ============ STATE ============
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [allGenres, setAllGenres] = useState([]);

  // ============ INITIALIZATION ============
  useEffect(() => {
    // Fetch trending movies from TMDB API
    const fetchTrendingMovies = async () => {
      const response = await getTMDBData("trending/all/day", {
        language: "en-US",
        page: 1,
      });
      setTrendingMovies(response.results || response);
    };
    fetchTrendingMovies();

    // Fetch all genres from TMDB API
    const fetchAllGenres = async () => {
      let movieGenres = [];
      let tvGenres = [];
      try {
        movieGenres = await getAllGenres("movie");
      } catch (error) {
        movieGenres = [];
      }
      try {
        tvGenres = await getAllGenres("tv");
      } catch (error) {
        tvGenres = [];
      }
      // Merge and deduplicate by id
      const all = [...movieGenres, ...tvGenres];
      const merged = Object.values(
        all.reduce((acc, genre) => {
          acc[genre.id] = genre;
          return acc;
        }, {})
      );
      setAllGenres(merged);
    };
    fetchAllGenres();
  }, []);

  // ============ UTILITY FUNCTIONS ============
  const getGenreNames = (genreIds) => {
    if (!genreIds) return [];
    return genreIds
      .map((id) => allGenres.find((g) => g.id === id)?.name)
      .filter(Boolean);
  };

  // Get genres for the currently displayed movie
  const currentMovieGenres = trendingMovies[currentMovieIndex]
    ? getGenreNames(trendingMovies[currentMovieIndex].genre_ids)
    : [];

  // ============ NAVIGATION HANDLERS ============
  const goToNextMovie = () => {
    setCurrentMovieIndex((prev) =>
      trendingMovies.length ? (prev + 1) % trendingMovies.length : 0
    );
  };
  const goToPreviousMovie = () => {
    setCurrentMovieIndex((prev) =>
      trendingMovies.length
        ? (prev - 1 + trendingMovies.length) % trendingMovies.length
        : 0
    );
  };

  // ============ AUTO-PLAY EFFECT ============
  useEffect(() => {
    const autoPlayInterval = setInterval(goToNextMovie, 5000);
    return () => clearInterval(autoPlayInterval);
  }, [trendingMovies]);

  return (
    <section className="w-full h-screen bg-black overflow-hidden">
      {/* RENDER ONLY IF MOVIES ARE LOADED */}
      {trendingMovies.length > 0 && (
        <div className="relative w-full h-full">
          {/* MAIN CAROUSEL CONTAINER */}
          <div className="relative w-full h-full group">
            {/* BACKGROUND IMAGE */}
            <img
              src={`https://image.tmdb.org/t/p/original${trendingMovies[currentMovieIndex].backdrop_path}`}
              alt={trendingMovies[currentMovieIndex].original_title}
              className="w-full h-full object-cover transition-opacity duration-1000"
            />

            {/* GRADIENT OVERLAYS */}
            <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-black/30"></div>
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent"></div>

            {/* CONTENT: TITLE, GENRES, DESCRIPTION, BUTTONS */}
            <div className="absolute inset-0 flex flex-col justify-center items-start pl-8 md:pl-16">
              <div className="max-w-3xl space-y-6">
                {/* MOVIE TITLE */}
                <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl leading-tight">
                  {trendingMovies[currentMovieIndex].title ||
                    trendingMovies[currentMovieIndex].name}
                </h1>

                {/* GENRE BADGES */}
                {currentMovieGenres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentMovieGenres.map((genre, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* RATING AND YEAR */}
                <div className="flex gap-4 items-center flex-wrap">
                  <div className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-full font-bold">
                    <span>⭐</span>
                    {trendingMovies[currentMovieIndex].vote_average.toFixed(1)}
                  </div>
                  <span className="text-white text-lg font-semibold">
                    {trendingMovies[currentMovieIndex].release_date?.split(
                      "-"
                    )[0] || "N/A"}
                  </span>
                </div>

                {/* MOVIE DESCRIPTION */}
                <p className="text-white text-lg max-w-2xl drop-shadow-lg line-clamp-4 leading-relaxed">
                  {trendingMovies[currentMovieIndex].overview ||
                    "No description available"}
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex gap-4 pt-4">
                  <a target="_blank"
                    href={trendingMovies[currentMovieIndex].media_type === 'tv'
      ? `https://www.vidking.net/embed/${trendingMovies[currentMovieIndex].media_type}/${trendingMovies[currentMovieIndex].id}/1/1?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`
      : `https://www.vidking.net/embed/${trendingMovies[currentMovieIndex].media_type}/${trendingMovies[currentMovieIndex].id}?color=9146ff&autoPlay=true`}
                    className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all shadow-xl flex items-center gap-2"
                  >
                    <Play size={20} fill="white" /> Watch Now
                  </a>

                  <a
                    href="#my-list"
                    className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all shadow-lg flex items-center gap-2 border border-white/30"
                  >
                    <Plus size={20} /> My List
                  </a>
                </div>
              </div>
            </div>

            {/* PREVIOUS BUTTON */}
            <button
              onClick={goToPreviousMovie}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform"
            >
              <div className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700">
                <MoveLeft size={24} />
              </div>
            </button>

            {/* NEXT BUTTON */}
            <button
              onClick={goToNextMovie}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 hover:scale-110 transition-transform"
            >
              <div className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700">
                <MoveRight size={24} />
              </div>
            </button>
          </div>

          {/* DOT INDICATORS */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {trendingMovies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentMovieIndex(idx)}
                className={`cursor-pointer transition-all ${
                  idx === currentMovieIndex
                    ? "bg-red-600 w-8 h-2.5"
                    : "bg-white/40 hover:bg-white/60 w-2.5 h-2.5"
                } rounded-full`}
              ></button>
            ))}
          </div>

          {/* MOVIE COUNTER */}
          <div className="absolute bottom-8 right-8 text-white text-sm font-bold bg-black/60 px-4 py-2 rounded-lg backdrop-blur-lg border border-white/10">
            {currentMovieIndex + 1} / {trendingMovies.length}
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
