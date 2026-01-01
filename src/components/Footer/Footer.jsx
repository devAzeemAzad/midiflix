import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-red-500/20 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🎬</span>
              <h2 className="text-2xl font-bold text-white">MidiFlix</h2>
            </div>
            <p className="text-sm text-gray-400">
              Your ultimate destination for discovering and exploring movies, series, and anime.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link to="/movies" className="text-sm hover:text-red-500 transition-colors">Movies</Link></li>
              <li><Link to="/series" className="text-sm hover:text-red-500 transition-colors">Series</Link></li>
              <li><Link to="/anime" className="text-sm hover:text-red-500 transition-colors">Anime</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-sm hover:text-red-500 transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="text-sm hover:text-red-500 transition-colors">FAQ</Link></li>
              <li><Link to="/help" className="text-sm hover:text-red-500 transition-colors">Help Center</Link></li>
              <li><Link to="/feedback" className="text-sm hover:text-red-500 transition-colors">Feedback</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm hover:text-red-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm hover:text-red-500 transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-sm hover:text-red-500 transition-colors">Cookie Policy</Link></li>
              <li><Link to="/disclaimer" className="text-sm hover:text-red-500 transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} <span className="text-white font-semibold">MidiFlix</span>. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Made with <span className="text-red-500">❤️</span> for movie lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer