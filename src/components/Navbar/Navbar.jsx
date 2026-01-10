import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => setIsMenuOpen(false);

  const LinkClass =
    "text-gray-300 hover:text-white transition-colors duration-200 [&.active]:text-red-500 [&.active]:font-semibold";

  return (
    <nav className="fixed top-0 left-0 w-full z-500 bg-linear-to-b from-black/80 to-black/40 backdrop-blur-xl border-b border-red-500/20 transition-all duration-300">
      <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" onClick={handleLinkClick} className="flex items-center gap-3 group">
            <span className="hidden sm:inline bg-linear-to-r from-red-500 to-orange-500 bg-clip-text uppercase  text-transparent font-bold text-[38px] tracking-wide">MidiFlix</span>
          </Link>
          <div className="hidden md:flex text-l items-center gap-8">
            <Link to="/" className={LinkClass}>Home</Link>
            <Link to="/movie/now_playing" className={LinkClass}>Movies</Link>
            <Link to="/series" className={LinkClass}>Series</Link>
            <Link to="/anime" className={LinkClass}>Anime</Link>
          </div>    
          
          <div className="flex items-center gap-3">
            <form className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search movies, series..."
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:bg-white/20 transition-all duration-300 w-72"
              />
              <button
                type="submit"
                className="absolute right-2 text-gray-300 hover:text-red-500 transition-colors duration-200 p-2 rounded-full"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </form>
            <div className="md:hidden flex items-center">
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
                <hr className="border-white/10 my-2" />
                <Link to="/new-releases" className={`${LinkClass} px-4 py-2 rounded-lg hover:bg-white/5`} onClick={handleLinkClick}>New Releases</Link>
                <Link to="/popular" className={`${LinkClass} px-4 py-2 rounded-lg hover:bg-white/5`} onClick={handleLinkClick}>Popular</Link>
                <Link to="/genres" className={`${LinkClass} px-4 py-2 rounded-lg hover:bg-white/5`} onClick={handleLinkClick}>Genres</Link>
                <Link to="/favorites" className={`${LinkClass} px-4 py-2 rounded-lg hover:bg-white/5`} onClick={handleLinkClick}>Favorites</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
