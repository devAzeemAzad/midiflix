import { useEffect, useRef, useState } from "react";
import MovieHoverdDetails from "./MovieHoverdDetails";
import MovieCard from "./MovieCard";
import { getAllGenres } from "../../api/tmdbclient";

const CARD_WIDTH = 288;

const mergeGenresById = (movieGenres, tvGenres) => {
  const all = [...movieGenres, ...tvGenres];
  return Object.values(
    all.reduce((acc, genre) => {
      acc[genre.id] = genre;
      return acc;
    }, {})
  );
};

const MovieCarousel = ({ moviesData = [] }) => {
  // ========= STATE =========
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [allGenres, setAllGenres] = useState([]);
  const [hoverCardPosition, setHoverCardPosition] = useState(null);

  // ========= REFS =========
  const carouselScrollRef = useRef(null);
  const carouselContainerRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  // ========= FETCH GENRES (movie + tv) =========
  useEffect(() => {
    const fetchAllGenres = async () => {
      const [movieRes, tvRes] = await Promise.allSettled([
        getAllGenres("movie"),
        getAllGenres("tv"),
      ]);

      const movieGenres = movieRes.status === "fulfilled" ? movieRes.value : [];
      const tvGenres = tvRes.status === "fulfilled" ? tvRes.value : [];

      setAllGenres(mergeGenresById(movieGenres, tvGenres));
    };

    fetchAllGenres();
  }, []);

  // ========= MOUSE WHEEL => HORIZONTAL SCROLL =========
  useEffect(() => {
    const carousel = carouselScrollRef.current;
    if (!carousel) return;
    const handleWheelScroll = (event) => {
      event.preventDefault();
      carousel.scrollLeft += event.deltaY;
    };
    carousel.addEventListener("wheel", handleWheelScroll);
    return () => carousel.removeEventListener("wheel", handleWheelScroll);
  }, [moviesData]);

  // ========= HOVER CARD HANDLERS =========
  const clearHideTimer = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleMovieCardEnter = (e, item) => {
    clearHideTimer();

    const container = carouselContainerRef.current;
    if (!container) return;

    setHoveredMovie(item);

    const cardRect = e.currentTarget.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    let x = cardRect.left - containerRect.left;
    const y = cardRect.bottom - containerRect.top + 10;

    const maxX = containerRect.width - CARD_WIDTH - 10;
    x = Math.min(Math.max(x, 10), Math.max(10, maxX));

    setHoverCardPosition({ x, y });
  };

  const handleMovieCardLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredMovie(null);
      setHoverCardPosition(null);
    }, 300);
  };

  const handleHoverDetailsEnter = () => {
    clearHideTimer();
  };

  const handleHoverDetailsLeave = () => {
    setHoveredMovie(null);
    setHoverCardPosition(null);
  };

  return (
    <div>
      {moviesData.length > 0 ? (
        <div className="relative" ref={carouselContainerRef}>
          <div
            ref={carouselScrollRef}
            className="flex scroll-smooth overflow-x-auto gap-3 px-2 py-4 hide-scrollbar"
            style={{ scrollBehavior: "smooth", minWidth: "100%" }}
          >
            {moviesData.map((item) => (
              <MovieCard
                key={item?.id ?? `${item?.title ?? "item"}-${Math.random()}`}
                item={item}
                onMouseEnter={(e) => handleMovieCardEnter(e, item)}
                onMouseLeave={handleMovieCardLeave}
              />
            ))}
          </div>

          <MovieHoverdDetails
            movie={hoveredMovie}
            genres={allGenres}
            position={hoverCardPosition}
            onMouseLeave={handleHoverDetailsLeave}
            onMouseEnter={handleHoverDetailsEnter}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center h-72">
          <span className="text-gray-400 text-lg animate-pulse">
            Loading popular movies...
          </span>
        </div>
      )}
    </div>
  );
};

export default MovieCarousel;
