<<<<<<< HEAD
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
=======
import { useEffect, useMemo, useState } from "react";
import { MoveLeft, MoveRight, Plus, Play, Info } from "lucide-react";
import { getAllGenres, getTMDBData } from "../../api/tmdbclient";
import { Link } from "react-router-dom";
const HeroCarousel = () => {
 
>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530

  // ============ STATE ============
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [allGenres, setAllGenres] = useState([]);

<<<<<<< HEAD
  // ============ INITIALIZATION ============
  useEffect(() => {
    // Fetch trending movies from TMDB API
=======
  const currentItem = trendingMovies?.[currentMovieIndex];

  // ============ INITIALIZATION ============
  useEffect(() => {
>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530
    const fetchTrendingMovies = async () => {
      const response = await getTMDBData("trending/all/day", {
        language: "en-US",
        page: 1,
      });
<<<<<<< HEAD
      setTrendingMovies(response.results || response);
    };
    fetchTrendingMovies();

    // Fetch all genres from TMDB API
=======
      setTrendingMovies(response?.results || response || []);
    };

>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530
    const fetchAllGenres = async () => {
      let movieGenres = [];
      let tvGenres = [];
      try {
        movieGenres = await getAllGenres("movie");
<<<<<<< HEAD
      } catch (error) {
=======
      } catch {
>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530
        movieGenres = [];
      }
      try {
        tvGenres = await getAllGenres("tv");
<<<<<<< HEAD
      } catch (error) {
        tvGenres = [];
      }
      // Merge and deduplicate by id
=======
      } catch {
        tvGenres = [];
      }

      // Merge and deduplicate by id (project pattern)
>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530
      const all = [...movieGenres, ...tvGenres];
      const merged = Object.values(
        all.reduce((acc, genre) => {
          acc[genre.id] = genre;
          return acc;
        }, {})
      );
<<<<<<< HEAD
      setAllGenres(merged);
    };
    fetchAllGenres();
  }, []);

  // ============ UTILITY FUNCTIONS ============
  const getGenreNames = (genreIds) => {
    if (!genreIds) return [];
=======

      setAllGenres(merged);
    };

    fetchTrendingMovies();
    fetchAllGenres();
  }, []);

  // ============ UTILITY ============
  const getGenreNames = (genreIds) => {
    if (!genreIds?.length) return [];
>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530
    return genreIds
      .map((id) => allGenres.find((g) => g.id === id)?.name)
      .filter(Boolean);
  };

<<<<<<< HEAD
  // Get genres for the currently displayed movie
  const currentMovieGenres = trendingMovies[currentMovieIndex]
    ? getGenreNames(trendingMovies[currentMovieIndex].genre_ids)
    : [];

  // ============ NAVIGATION HANDLERS ============
=======
  const currentMovieGenres = useMemo(() => {
    if (!currentItem) return [];
    return getGenreNames(currentItem.genre_ids);
  }, [currentItem, allGenres]);

  const title = currentItem?.title || currentItem?.name || "Trending";
  const year =
    currentItem?.release_date?.split("-")?.[0] ||
    currentItem?.first_air_date?.split("-")?.[0] ||
    "N/A";

  const rating = Number.isFinite(currentItem?.vote_average)
    ? currentItem.vote_average.toFixed(1)
    : "—";

  const mediaType = currentItem?.media_type || "movie";
  

  const backdrop = currentItem?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${currentItem.backdrop_path}`
    : null;

  // ============ NAVIGATION ============
>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530
  const goToNextMovie = () => {
    setCurrentMovieIndex((prev) =>
      trendingMovies.length ? (prev + 1) % trendingMovies.length : 0
    );
  };
<<<<<<< HEAD
=======

>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530
  const goToPreviousMovie = () => {
    setCurrentMovieIndex((prev) =>
      trendingMovies.length
        ? (prev - 1 + trendingMovies.length) % trendingMovies.length
        : 0
    );
  };

<<<<<<< HEAD
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
=======
  // ============ AUTO-PLAY ============
  useEffect(() => {
    if (!trendingMovies.length) return;
    const autoPlayInterval = setInterval(goToNextMovie, 5000);
    return () => clearInterval(autoPlayInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trendingMovies.length]);

  // ============ UI ============
  return (
    <section className="w-full min-h-svh bg-black overflow-hidden relative">
      {/* subtle ambient gradient */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-40 -left-40 h-[22rem] w-[22rem] sm:h-[28rem] sm:w-[28rem] rounded-full bg-purple-700/25 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[22rem] w-[22rem] sm:h-[28rem] sm:w-[28rem] rounded-full bg-red-700/20 blur-3xl" />
      </div>

      {/* Loading / Empty state */}
      {trendingMovies.length === 0 ? (
        <div className="relative z-10 flex min-h-svh items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl">
            <div className="h-8 w-2/3 animate-pulse rounded bg-white/10" />
            <div className="mt-5 h-4 w-1/2 animate-pulse rounded bg-white/10" />
            <div className="mt-7 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-white/10" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
            </div>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <div className="h-11 w-full sm:w-36 animate-pulse rounded-xl bg-white/10" />
              <div className="h-11 w-full sm:w-28 animate-pulse rounded-xl bg-white/10" />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full min-h-svh z-10">
          <div className="relative w-full min-h-svh group">
            {/* BACKDROP */}
            {backdrop ? (
              <img
                src={backdrop}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover object-[50%_20%] sm:object-center transition-transform duration-1600 ease-out will-change-transform group-hover:scale-[1.01] sm:group-hover:scale-[1.02] md:group-hover:scale-[1.03] lg:group-hover:scale-[1.04]"
              />
            ) : (
              <div className="absolute inset-0 h-full w-full bg-linear-to-br from-black via-zinc-950 to-black" />
            )}

           { /* OVERLAYS (vignette + gradient theme) */}
            <div className="absolute inset-0 bg-linear-to-r from-black via-black/55 to-black/20" />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/35 to-transparent" />
            <div className="absolute inset-0 shadow-[inset_0_0_220px_rgba(0,0,0,0.9)]" />

            {/* CONTENT */}
            <div className="absolute inset-0 flex  flex-col justify-end sm:justify-center items-start px-4 sm:px-6 md:px-16 pb-24 sm:pb-20">
              <div className="max-w-3xl space-y-4 sm:space-y-6">
                {/* top meta chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] sm:text-xs font-semibold text-white/90 backdrop-blur-md">
                    Trending Today
                  </span>
                  <span className="rounded-full border border-purple-500/30 bg-purple-600/15 px-3 py-1 text-[11px] sm:text-xs font-semibold text-purple-100 backdrop-blur-md">
                    {mediaType.toUpperCase()}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-white drop-shadow-2xl leading-[1.08]">
                  {title}
                </h1>

                {/* GENRES */}
                {currentMovieGenres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentMovieGenres.slice(0, 5).map((genre) => (
                      <span
                        key={genre}
                        className="bg-linear-to-r from-purple-600/90 to-purple-700/90 text-white px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold shadow-[0_12px_30px_rgba(147,51,234,0.18)] border border-white/10"
>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

<<<<<<< HEAD
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
=======
                {/* RATING + YEAR */}
                <div className="flex gap-3 items-center flex-wrap">
                  <div className="flex items-center gap-2 bg-linear-to-r from-yellow-500 to-amber-500 text-white px-3 sm:px-4 py-2 rounded-full font-extrabold shadow-lg">
                    <span className="text-base">⭐</span>
                    <span className="text-sm sm:text-base">{rating}</span>
                  </div>

                  <span className="text-white/90 text-sm sm:text-base md:text-lg font-semibold">
                    {year}
                  </span>

                  <span className="h-6 w-px bg-white/20 hidden sm:block" />

                  <span className="text-white/70 text-xs sm:text-sm md:text-base line-clamp-1">
                    {currentItem?.original_language?.toUpperCase?.() || ""}
                  </span>
                </div>

                {/* DESCRIPTION */}
                <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl drop-shadow-lg line-clamp-3 sm:line-clamp-4 leading-relaxed">
                  {currentItem?.overview || "No description available"}
                </p>

                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-1 sm:pt-2">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={
                      mediaType === "tv"
                        ? `https://www.vidking.net/embed/${mediaType}/${currentItem.id}/1/1?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`
                        : `https://www.vidking.net/embed/${mediaType}/${currentItem.id}?color=9146ff&autoPlay=true`
                    }
                    className="w-full sm:w-auto justify-center bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl font-extrabold text-sm sm:text-base md:text-lg transition-all shadow-[0_18px_40px_rgba(220,38,38,0.28)] flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500/60"
                  >
                    <Play size={18} className="sm:hidden" fill="white" />
                    <Play size={20} className="hidden sm:block" fill="white" />
                    Watch Now
>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530
                  </a>

                  <a
                    href="#my-list"
<<<<<<< HEAD
                    className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all shadow-lg flex items-center gap-2 border border-white/30"
                  >
                    <Plus size={20} /> My List
                  </a>
=======
                    className="w-full sm:w-auto justify-center bg-white/10 hover:bg-white/15 text-white px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all shadow-lg flex items-center gap-2 border border-white/15 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <Plus size={18} className="sm:hidden" />
                    <Plus size={20} className="hidden sm:block" />
                    My List
                  </a>

                  <Link
                    target="_blank"
                    rel="noreferrer"
                    to={`/alldetails/${mediaType}/${currentItem.id}`}
                    
                    className="w-full sm:w-auto justify-center bg-purple-600/15 hover:bg-purple-600/25 text-purple-50 px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all shadow-lg flex items-center gap-2 border border-purple-500/25 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <Info size={18} className="sm:hidden" />
                    <Info size={20} className="hidden sm:block" />
                    More Info
                  </Link>
>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530
                </div>
              </div>
            </div>

<<<<<<< HEAD
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
=======
            {/* PREV/NEXT */}
            <button
              onClick={goToPreviousMovie}
              aria-label="Previous"
              className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 z-10 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500/60 rounded-full"
            >
              <div className="bg-black/35 border border-white/15 text-white p-2 sm:p-3 rounded-full shadow-lg backdrop-blur-md hover:bg-red-600/70">
                <MoveLeft size={20} className="sm:hidden" />
                <MoveLeft size={24} className="hidden sm:block" />
              </div>
            </button>

            <button
              onClick={goToNextMovie}
              aria-label="Next"
              className="absolute right-2 sm:right-3 md:right-5 top-1/2 -translate-y-1/2 z-10 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500/60 rounded-full"
            >
              <div className="bg-black/35 border border-white/15 text-white p-2 sm:p-3 rounded-full shadow-lg backdrop-blur-md hover:bg-red-600/70">
                <MoveRight size={20} className="sm:hidden" />
                <MoveRight size={24} className="hidden sm:block" />
>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530
              </div>
            </button>
          </div>

<<<<<<< HEAD
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
=======
          {/* DOTS */}
          <div className="absolute bottom-3 sm:bottom-20 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/10 bg-black/25 px-2.5 sm:px-3 py-2 backdrop-blur-md max-w-[92vw] sm:max-w-none overflow-x-auto flex-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {trendingMovies.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentMovieIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-current={idx === currentMovieIndex ? "true" : undefined}
                  className={`shrink-0 cursor-pointer transition-all duration-300 rounded-full ${
                    idx === currentMovieIndex
                      ? "bg-red-600 w-5 sm:w-8 h-2 sm:h-2.5 shadow-[0_10px_20px_rgba(220,38,38,0.35)]"
                      : "bg-white/35 hover:bg-white/55 w-2 h-2 sm:w-2.5 sm:h-2.5"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* COUNTER */}
          <div className="hidden sm:block absolute bottom-20 right-3 md:right-8 text-white text-xs md:text-sm font-bold bg-black/35 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530
            {currentMovieIndex + 1} / {trendingMovies.length}
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
