import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { getAllGenres, getMovieDetails, getTMDBData } from '../api/tmdbclient';

const AllDetails = () => {
  const { type, id , season ,episode } = useParams();
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [allGenres, setAllGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  
  useEffect(() => {
    window.scrollTo({ top: 0, });
  }, [id]);
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setActiveTab('details');

      try {
        if (!id || !type) {
          setDetails(null);
          setCredits(null);
          return;
        }

        const detailsResponse = await getMovieDetails(type, id);
        setDetails(detailsResponse);

        const creditsResponse = await getTMDBData(`${type}/${id}/credits`, { language: 'en-US' });
        // getTMDBData returns [] on errors; credits should be an object
        setCredits(Array.isArray(creditsResponse) ? null : creditsResponse);
      } catch (error) {
        setDetails(null);
        setCredits(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, type]);

  useEffect(() => {
    const fetchAllGenres = async () => {
      let movieGenres = [];
      let tvGenres = [];
      try {
        movieGenres = await getAllGenres('movie');
      } catch (error) {
        movieGenres = [];
      }
      try {
        tvGenres = await getAllGenres('tv');
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

  if (loading) {
    return (
      <div className='bg-black min-h-screen w-full text-white flex items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='animate-spin rounded-full h-14 w-14 border-4 border-orange-500 border-t-transparent'></div>
          <p className='text-gray-300 font-semibold tracking-wide'>Loading details...</p>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className='bg-black min-h-screen w-full text-white flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-2xl font-bold text-white mb-2'>Not found</p>
          <p className='text-gray-400'>This title is unavailable right now.</p>
        </div>
      </div>
    );
  }

  // Helper: Get genre names
  const getGenreNames = (genreIds) => {
    if (!genreIds || !allGenres.length) return [];
    return genreIds.map(id => allGenres.find(g => g.id === id)?.name).filter(Boolean);
  };

  // Helper: Get production companies
  const getProductionCompanies = (companies) => {
    if (!companies || !companies.length) return null;
    return (
      <div className='flex flex-wrap gap-2 mt-2'>
        {companies.map((company) => (
          <span key={company.id} className='bg-white/10 px-3 py-1 rounded-full text-xs text-gray-200 font-semibold border border-white/10'>
            {company.name}
          </span>
        ))}
      </div>
    );
  };


  
  
  const watchUrl =
    type === 'tv' && season
      ? `https://www.vidking.net/embed/${type}/${id}/5/1?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`
      : `https://www.vidking.net/embed/${type}/${id}?color=9146ff&autoPlay=true`;

  return (
    <div className='relative min-h-screen w-full text-white'>
      {/* BG IMAGE as fixed background */}
      {details.backdrop_path && (
        <div
          className='fixed inset-0 -z-10 w-full h-full'
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className='absolute inset-0 bg-black/70'></div>
          <div className='absolute inset-0 bg-linear-to-br from-orange-900/30 via-black/40 to-yellow-900/20'></div>
          <div className='absolute inset-0 backdrop-blur-[2px]'></div>
        </div>
      )}
      {!details.backdrop_path && (
        <div className='fixed inset-0 -z-10 w-full h-full bg-black'>
          <div className='absolute inset-0 bg-linear-to-br from-orange-900/20 via-black to-yellow-900/20'></div>
        </div>
      )}
      <div className='min-h-screen w-full px-4 md:px-8 lg:px-12 py-10'>
        <div className='w-full flex flex-col lg:flex-row gap-8 md:gap-10 items-start'>
          {/* Poster */}
          <div className='shrink-0 w-full lg:w-1/3 flex flex-col items-center'>
            <img
              src={details.poster_path
                ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Poster'}
              alt={details.title || details.name}
              className='w-full rounded-2xl shadow-xl mb-6 border border-white/20 bg-black/30'
              style={{ maxWidth: '320px' }}
            />
            {/* Rating, Watch, My List */}
            <div className='flex flex-col gap-4 w-full items-center'>
              <span className='w-full max-w-[320px] bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl font-extrabold text-xl text-center shadow-lg border border-white/15'>
                <span className='bg-linear-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent'>
                  ⭐ {details.vote_average?.toFixed(1)}/10
                </span>
              </span>

              <a
                href={type === 'tv'
      ? `https://www.vidking.net/embed/${type}/${id}/1/1?color=e50914&autoPlay=true&nextEpisode=true&episodeSelector=true`
      : `https://www.vidking.net/embed/${type}/${id}?color=9146ff&autoPlay=true`}
                target='_blank'
                rel='noreferrer'
                className='bg-linear-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-400 hover:via-orange-500 hover:to-red-500 text-black px-8 py-3 rounded-xl font-extrabold text-lg transition-all shadow-xl flex items-center justify-center gap-2 w-full max-w-[320px]'
              >
                ▶ Watch Now
              </a>

              <Link
                to='/my-list'
                className='bg-white/10 hover:bg-white/15 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 border border-white/20 w-full max-w-[320px]'
              >
                + My List
              </Link>
            </div>
          </div>
          {/* Details and Tabs */}
          <div className='flex-1'>
            <h1 className='text-4xl md:text-5xl font-black mb-3 drop-shadow-lg tracking-tight'>
              {details.title || details.name}
            </h1>
            {details.tagline && (
              <p className='text-base md:text-lg text-gray-200/90 mb-6 italic'>
                {details.tagline}
              </p>
            )}
            <div className='flex gap-3 mb-6 flex-wrap'>
              <span className='bg-black/50 px-4 py-2 rounded-full font-semibold shadow border border-white/10'>
                📅 {(details.release_date || details.first_air_date)?.split('-')[0] || 'N/A'}
              </span>
              {details.runtime && (
                <span className='bg-black/50 px-4 py-2 rounded-full font-semibold shadow border border-white/10'>
                  ⏱️ {details.runtime} min
                </span>
              )}
              {details.episode_run_time && details.episode_run_time.length > 0 && (
                <span className='bg-black/50 px-4 py-2 rounded-full font-semibold shadow border border-white/10'>
                  ⏱️ Avg Episode: {Math.round(details.episode_run_time.reduce((a, b) => a + b, 0) / details.episode_run_time.length)} min
                </span>
              )}
              {details.number_of_seasons && (
                <span className='bg-black/50 px-4 py-2 rounded-full font-semibold shadow border border-white/10'>
                  Seasons: {details.number_of_seasons}
                </span>
              )}
              {details.number_of_episodes && (
                <span className='bg-black/50 px-4 py-2 rounded-full font-semibold shadow border border-white/10'>
                  Episodes: {details.number_of_episodes}
                </span>
              )}
            </div>
            {/* Genres */}
            {details.genres && details.genres.length > 0 && (
              <div className='flex flex-wrap gap-2 mb-6'>
                {getGenreNames(details.genres.map(g => g.id)).map((genre, idx) => (
                  <span key={idx} className='bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow border border-white/10 hover:bg-white/15 transition'>
                    {genre}
                  </span>
                ))}
              </div>
            )}
            <p className='text-gray-100/90 text-base md:text-lg leading-relaxed mb-8'>
              {details.overview}
            </p>
            {/* Tabs */}
            <div className='border-b border-white/15 mb-6'>
              <nav className='flex gap-6'>
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-3 px-1 text-base md:text-lg font-extrabold tracking-wide transition ${activeTab === 'details' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-300 hover:text-white'}`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('cast')}
                  className={`py-3 px-1 text-base md:text-lg font-extrabold tracking-wide transition ${activeTab === 'cast' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-300 hover:text-white'}`}
                >
                  Cast
                </button>
                <button
                  onClick={() => setActiveTab('crew')}
                  className={`py-3 px-1 text-base md:text-lg font-extrabold tracking-wide transition ${activeTab === 'crew' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-300 hover:text-white'}`}
                >
                  Crew
                </button>
              </nav>
            </div>
            {/* Tab Content */}
          <div>
            {activeTab === 'details' && (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {details.status && (
                  <div className='bg-white/10 p-6 rounded-2xl shadow-lg border border-white/10'>
                    <p className='text-gray-300 text-sm'>Status</p>
                    <p className='text-white text-2xl font-bold'>{details.status}</p>
                  </div>
                )}
                {details.genres && details.genres.length > 0 && (
                  <div className='bg-white/10 p-6 rounded-2xl shadow-lg border border-white/10'>
                    <p className='text-gray-300 text-sm mb-2'>Genres</p>
                    <div className='flex flex-wrap gap-2'>
                      {getGenreNames(details.genres.map(g => g.id)).map((genre, idx) => (
                        <span key={idx} className='bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow border border-white/10'>
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {details.budget > 0 && (
                  <div className='bg-white/10 p-6 rounded-2xl shadow-lg border border-white/10'>
                    <p className='text-gray-300 text-sm'>Budget</p>
                    <p className='text-white text-2xl font-bold'>${(details.budget / 1000000).toFixed(0)}M</p>
                  </div>
                )}
                {details.revenue > 0 && (
                  <div className='bg-white/10 p-6 rounded-2xl shadow-lg border border-white/10'>
                    <p className='text-gray-300 text-sm'>Revenue</p>
                    <p className='text-white text-2xl font-bold'>${(details.revenue / 1000000).toFixed(0)}M</p>
                  </div>
                )}
                {type === 'tv' && details.number_of_episodes && (
                  <div className='bg-white/10 p-6 rounded-2xl shadow-lg border border-white/10'>
                    <p className='text-gray-300 text-sm'>Episodes</p>
                    <p className='text-white text-2xl font-bold'>{details.number_of_episodes}</p>
                  </div>
                )}
                {details.production_companies && details.production_companies.length > 0 && (
                  <div className='bg-white/10 p-6 rounded-2xl shadow-lg border border-white/10'>
                    <p className='text-gray-300 text-sm mb-2'>Production Companies</p>
                    {getProductionCompanies(details.production_companies)}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'cast' && credits && credits.cast && (
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
                {credits.cast.slice(0, 12).map((actor) => (
                  <div key={actor.id} className='bg-white/10 rounded-2xl p-4 shadow-lg text-center flex flex-col items-center border border-white/10 hover:bg-white/15 transition'>
                    <img
                      src={actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : 'https://via.placeholder.com/185x278?text=No+Image'}
                      alt={actor.name}
                      className='w-24 h-32 object-cover rounded-xl mb-2 border-2 border-white/20'
                    />
                    <p className='text-white font-bold'>{actor.name}</p>
                    <p className='text-orange-300 text-sm'>{actor.character}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'crew' && credits && credits.crew && (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                {credits.crew
                  .filter(person => ['Director', 'Producer', 'Screenplay', 'Writer', 'Executive Producer'].includes(person.job))
                  .map((person, index) => (
                    <div key={`${person.id}-${index}`} className='bg-white/10 p-4 rounded-2xl shadow-lg flex items-center gap-4 border border-white/10 hover:bg-white/15 transition'>
                      {person.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${person.profile_path}`}
                          alt={person.name}
                          className='w-16 h-24 object-cover rounded-xl border-2 border-white/20'
                        />
                      ) : (
                        <div className='w-16 h-24 bg-gray-800 rounded-xl flex items-center justify-center'>
                          <span className='text-gray-400 text-xs'>No Image</span>
                        </div>
                      )}
                      <div>
                        <p className='text-white font-bold'>{person.name}</p>
                        <p className='text-orange-400 font-semibold'>{person.job}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default AllDetails;