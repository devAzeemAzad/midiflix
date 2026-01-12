import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { getTMDBData } from '../../api/tmdbclient';

const IMG_BASE_URL = "https://image.tmdb.org/t/p/w92";

const SearchList = ({ textvalue, onItemClick }) => {
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!textvalue) {
        setSearchData([]);
        return;
      }
      setLoading(true);
      try {
        const results = await getTMDBData(`/search/multi`, {
          language: "en-US",
          page: 1,
          query: textvalue,
          include_adult: false
        });
        
        // Filter to keep only movies and tv shows
        const filtered = (results || []).filter(item => 
          item.media_type === 'movie' || item.media_type === 'tv'
        );
        setSearchData(filtered);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(debounce);
  }, [textvalue]);

  return (
    <div className="bg-black border border-white/10 rounded-xl max-h-[80vh] md:max-h-[60vh] overflow-y-auto shadow-2xl custom-scrollbar">
      {loading ? (
        <div className="p-4 text-center text-gray-400 text-sm">Loading...</div>
      ) : searchData.length > 0 ? (
        <div className="flex flex-col">
          {searchData.map((item) => {
            const imagePath = item.poster_path || item.backdrop_path;
            const imageUrl = imagePath ? `${IMG_BASE_URL}${imagePath}` : null;
            const title = item.title || item.name;
            const year = (item.release_date || item.first_air_date || "").split("-")[0];
            const rating = item.vote_average ? item.vote_average.toFixed(1) : null;

            return (
              <Link
                to={`/alldetails/${item.media_type}/${item.id}`}
                key={item.id}
                onClick={onItemClick}
                
                className="flex items-center gap-3 p-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-none group"
              >
                <div className="w-10 h-14 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
                  {imageUrl ? (
                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700 text-[10px] text-gray-400">No IMG</div>
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-gray-200 group-hover:text-white font-medium text-sm line-clamp-1 transition-colors">
                    {title}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase border border-gray-600 px-1 rounded">
                      {item.media_type}
                    </span>
                    {year && <span className="text-[10px] text-gray-500">{year}</span>}
                    {rating && (
                      <div className="flex items-center gap-1">
                        <Star size={10} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] text-gray-300">{rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-400 text-sm">
          No results for "{textvalue}"
        </div>
      )}
    </div>
  );
};

export default SearchList;
