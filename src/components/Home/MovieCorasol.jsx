import React, { useEffect, useRef, useState } from "react";
import MovieHoverdDetails from "./MovieHoverdDetails";
import MovieCard from "./MovieCard";
import { getAllGenres } from "../../api/tmdbclient";


const MovieCarousel = ({moviesData}) => {
    // ============ STATE ============

    const [hoveredMovie, setHoveredMovie] = useState(null);
    const [allGenres, setAllGenres] = useState([]);
    const [hoverCardPosition, setHoverCardPosition] = useState(null);

    // ============ REFS ============

    const carouselScrollRef = useRef()
    const carouselContainerRef = useRef()
    const hideCardTimeoutRef = useRef(null);

    // ============ INITIALIZATION ============

    useEffect(() => {
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

    // ============ MOUSE WHEEL SCROLL ============
    useEffect(() => {
        const carousel = carouselScrollRef.current;
        
        if (!carousel) return;

        const handleWheelScroll = (event) => {
          event.preventDefault();
          carousel.scrollLeft += event.deltaY;
        };

        carousel.addEventListener("wheel", handleWheelScroll, { passive: false });
        
        return () => {
          carousel.removeEventListener("wheel", handleWheelScroll);
        };
      }, [moviesData]);
    
      // ============ HOVER CARD HANDLERS ============
      const handleMovieCardHover = (e, item) => {
        // Clear any pending hide
        if (hideCardTimeoutRef.current) {
          clearTimeout(hideCardTimeoutRef.current);
          hideCardTimeoutRef.current = null;
        }

        setHoveredMovie(item);
        const cardRect = e.currentTarget.getBoundingClientRect();
        const containerRect = carouselContainerRef.current.getBoundingClientRect();
        
        let xPosition = cardRect.left - containerRect.left;
        let yPosition = cardRect.bottom - containerRect.top + 10;
        
        // Prevent card from going off-screen to the right (relative to container)
        const CARD_WIDTH = 288;
        const containerWidth = containerRect.width;
        
        if (xPosition + CARD_WIDTH > containerWidth) {
          xPosition = Math.max(0, containerWidth - CARD_WIDTH - 10);
        }
        // Prevent card from going off-screen to the left
        if (xPosition < 0) {
          xPosition = 10;
        }
        
        setHoverCardPosition({ x: xPosition, y: yPosition });
      };

      const handleMovieCardLeave = () => {
        // Delay hiding by 300ms to allow moving to hover card
        hideCardTimeoutRef.current = setTimeout(() => {
          setHoveredMovie(null);
          setHoverCardPosition(null);
        }, 300);
      };

      const handleHoverDetailsEnter = () => {
        // Clear any pending hide when entering hover card
        if (hideCardTimeoutRef.current) {
          clearTimeout(hideCardTimeoutRef.current);
          hideCardTimeoutRef.current = null;
        }
      };

      const handleHoverDetailsLeave = () => {
        setHoveredMovie(null);
        setHoverCardPosition(null);
      };

  return (
    <div>{moviesData.length > 0 ? (
          <div className="relative" ref={carouselContainerRef}>
            <div
              ref={carouselScrollRef}
              className="flex scroll-smooth overflow-x-auto gap-3 px-2 py-4 hide-scrollbar"
              style={{ scrollBehavior: "smooth", minWidth: "100%" }}
            >
          {moviesData.map((item,index) => (
            <MovieCard key={index} item={item} onMouseEnter={(e) => handleMovieCardHover(e, item)} onMouseLeave={handleMovieCardLeave}/>
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
  )
}

export default MovieCarousel