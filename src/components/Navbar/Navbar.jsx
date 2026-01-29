import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu,Search, X } from 'lucide-react';
import SearchList from './SearchList';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => setIsMenuOpen(false);

  const [searchValue, setSearchValue] = useState("")
  const [showSearchList, setShowSearchList] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchList(false);
        // Optional: Close mobile search if clicking outside (might need logic to distinguish header clicks)
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlesearch =(e)=>{
    setSearchValue(e.target.value)
    if(e.target.value) setShowSearchList(true);
  }
  const LinkClass =
    "text-gray-300 hover:text-white transition-colors duration-200 [&.active]:text-red-500 [&.active]:font-semibold";

  return (
    <nav className="fixed top-0 left-0 w-full z-500 bg-linear-to-b from-black/80 to-black/40 backdrop-blur-xl border-b border-red-500/20 transition-all duration-300">
      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" onClick={handleLinkClick} className={`flex items-center gap-3 group ${showMobileSearch ? 'hidden md:flex' : ''}`}>
            <span className=" sm:inline bg-linear-to-r from-red-500 to-orange-500 bg-clip-text uppercase  text-transparent font-bold text-[38px] tracking-wide">MidiFlix</span>
          </Link>
          <div className="hidden md:flex text-l items-center gap-8">
            <Link to="/" className={LinkClass}>Home</Link>
            <Link to="/movie/now_playing" className={LinkClass}>Movies</Link>
            <Link to="/series" className={LinkClass}>Series</Link>
            <Link to="/anime" className={LinkClass}>Anime</Link>
          </div>    
          
          <div className="flex items-center gap-3" ref={searchRef}>
            {!showMobileSearch && (
              <button 
                className="md:hidden text-gray-300 hover:text-white p-2"
                onClick={() => setShowMobileSearch(true)}
              >
                <Search size={22} />
              </button>
            )}

            <div className={`${showMobileSearch ? 'fixed top-0 left-0 w-full h-16 z-60 flex items-center px-4 bg-black/95' : 'hidden md:block relative'}`}>
              <form className="flex items-center relative w-full" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  onChange={handlesearch}
                  onFocus={() => searchValue && setShowSearchList(true)}
                  value={searchValue}
                  placeholder="Search movies, series..."
                  autoFocus={showMobileSearch}
                  className={`px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:bg-white/20 transition-all duration-300 ${showMobileSearch ? 'w-full' : 'w-full md:w-64 lg:w-96'} pr-12`}
                />
                {(searchValue || showMobileSearch) && (
                  <button
                    type="button"
                    onClick={() => { 
                      setSearchValue(''); 
                      setShowSearchList(false);
                      if (showMobileSearch) setShowMobileSearch(false);
                    }}
                    className="absolute right-10 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 text-gray-300 hover:text-red-500 transition-colors duration-200 p-2 rounded-full"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              </form>
              {showSearchList && searchValue && (
                <div className="absolute top-full left-0 w-full mt-2 z-50 px-4 md:px-0">
                   <SearchList textvalue={searchValue} onItemClick={() => { setShowSearchList(false); setSearchValue(""); setShowMobileSearch(false); }} />
                </div>
              )}
            </div>
            <div className={`md:hidden flex items-center ${showMobileSearch ? 'hidden' : ''}`}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 w-full bg-linear-to-b from-black/90 to-black/70 backdrop-blur-xl border-b border-red-500/20 shadow-2xl p-4">
              <div className="flex flex-col gap-3">
                <Link to="/" className={`${LinkClass} px-4 py-2 rounded-lg hover:bg-white/5`} onClick={handleLinkClick}>Home</Link>
                <Link to="/movies" className={`${LinkClass} px-4 py-2 rounded-lg hover:bg-white/5`} onClick={handleLinkClick}>Movies</Link>
                <Link to="/series" className={`${LinkClass} px-4 py-2 rounded-lg hover:bg-white/5`} onClick={handleLinkClick}>Series</Link>
                <Link to="/anime" className={`${LinkClass} px-4 py-2 rounded-lg hover:bg-white/5`} onClick={handleLinkClick}>Anime</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
