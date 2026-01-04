import React, { useEffect, useRef, useState } from "react";
import { getTMDBData } from "../../api/tmdbclient";
import { MoveRight } from "lucide-react";
import MovieCarousel from "./MovieCorasol";
import MovieCarouselHeader from "./MovieCorasolTop";

const MovieCategoriesSection = () => {
  // ============ STATE ============
  const [allCategoryMovies, setAllCategoryMovies] = useState({});

  // ============ CONSTANTS ===========
  const movieCategories = [
    // MOVIES
    { categoryEndpoint: "movie/now_playing", displayName: "Now", categoryType: "Playing" },
    { categoryEndpoint: "movie/popular", displayName: "Popular", categoryType: "Movies" },
    { categoryEndpoint: "movie/top_rated", displayName: "Top", categoryType: "Rated" },
    { categoryEndpoint: "movie/upcoming", displayName: "Upcoming", categoryType: "Movies" },
    
    // TV SHOWS
    { categoryEndpoint: "tv/on_the_air", displayName: "On Air", categoryType: "Series" },
    { categoryEndpoint: "tv/popular", displayName: "Popular", categoryType: "Series" },
    { categoryEndpoint: "tv/top_rated", displayName: "Top", categoryType: "Series" },
    { categoryEndpoint: "tv/airing_today", displayName: "Airing", categoryType: "Today" }
  ]


  useEffect(() => {
    // Loop through each category
    movieCategories.forEach(async (category) => {
      const moviesData = await getTMDBData(category.categoryEndpoint, {
        language: "en-us",
        page: 1,
      });
      console.log(moviesData)
      setAllCategoryMovies(previousState => {
        const updatedState = { ...previousState }; // Copy old state (keep previous categories)
        updatedState[category.categoryEndpoint] = moviesData; // Add new category data
        return updatedState; // Return updated state
      });
    });
  }, []);

  return (
    <>
      <div>
        {/* LOOP THROUGH EACH CATEGORY AND CREATE A SECTION */}
        {movieCategories.map((category, categoryIndex) => (
          <section key={categoryIndex} className="h-full py-8 relative">
            <div className="px-4 md:px-8 lg:px-10 mx-auto">
              {/* CATEGORY HEADER */}
              <MovieCarouselHeader 
                categoryType={category.categoryType} 
                displayName={category.displayName}
                categorydata={category.categoryEndpoint}
              />
              
              {/* CAROUSEL WITH MOVIES */}
              <MovieCarousel 
                moviesData={allCategoryMovies[category.categoryEndpoint] || []} 
              />

              {/* HIDE SCROLLBAR STYLES */}
              <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
              `}</style>
            </div>
          </section>
        ))}
      </div>
    </>
  );
};

export default MovieCategoriesSection;