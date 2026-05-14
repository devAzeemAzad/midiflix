import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
<<<<<<< HEAD
=======
import { SpeedInsights } from '@vercel/speed-insights/react';
>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530
import Home from './pages/Home'
import Movies from './pages/Movies'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import tmdb from './api/tmdbclient'
import axios from 'axios';
import AllDetails from './pages/AllDetails'
<<<<<<< HEAD
=======
import Series from './pages/Series'
>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530

const App = () => {
  const location = useLocation();
  
  return (
    <div className="bg-black relative text-white min-h-screen flex flex-col">
      <Navbar />
      
      <main className="grow bg-black pt-16">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
<<<<<<< HEAD
          <Route path="/movies/" element={<Movies />} />
=======
          <Route path="movie/:categorydata?" element={<Movies />} />
          <Route path="series/:categorydata?" element={<Series />} />
>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530
          <Route path='/alldetails/:type/:id' element={<AllDetails/>} />
        </Routes>
      </main>
    <Footer/>
<<<<<<< HEAD
   
=======
   <SpeedInsights />
>>>>>>> 12c460f3e5cd1fea2bde5ff97aa27609aae68530
    </div>
  )
}

export default App