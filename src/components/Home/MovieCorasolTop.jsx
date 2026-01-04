import { MoveRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const MovieCorasolTop = ({ displayName, categoryType, categorydata }) => {
  // Route param values can't include '/', so convert "movie/popular" -> "popular"
  const categoryParam =
    typeof categorydata === "string" && categorydata.startsWith("movie/")
      ? categorydata.split("/")[1]
      : "";


  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
        <span className="text-yellow-400">{displayName}</span> {categoryType}
      </h1>
      <Link
        to={categoryParam ? `/movie/${categoryParam}` : "/movie"}
        className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200 group font-medium text-sm md:text-base"
      >
        View all 
        
        <MoveRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
      </Link>
    </div>
  )
}

export default MovieCorasolTop