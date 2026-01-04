import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import tmdb from './api/tmdbclient'
import axios from 'axios';
import AllDetails from './pages/AllDetails'

const App = () => {
  const location = useLocation();
  
  return (
    <div className="bg-black relative text-white min-h-screen flex flex-col">
      <Navbar />
      
      <main className="grow bg-black pt-16">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="movie/:categorydata?" element={<Movies />} />
          <Route path='/alldetails/:type/:id' element={<AllDetails/>} />
        </Routes>
      </main>
    <Footer/>
   
    </div>
  )
}

export default App