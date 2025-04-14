import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Wrench } from 'lucide-react';

// Make sure this component doesn't contain another Router

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll event to change navigation style when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <>
      {/* Make sure there's no additional Router component here */}
      {/* All navigation should use Link components without an additional router */}
      
      {/* Fixed navigation bar with conditional styling based on scroll position */}
      <motion.nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className={`font-bold text-xl transition-colors duration-300 ${
                  scrolled || location.pathname !== '/' ? 'text-blue-600' : 'text-white'
                }`}>
                  NewsVerifier
                </span>
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? (scrolled ? 'bg-blue-100 text-blue-700' : 'bg-white/20 text-white') 
                    : (scrolled || location.pathname !== '/' ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-700' : 'text-white hover:bg-white/20')
                }`}
              >
                Home
              </Link>
              <Link 
                to="/tool" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/tool' 
                    ? 'bg-blue-600 text-white'
                    : (scrolled || location.pathname !== '/' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-white text-blue-700 hover:bg-gray-100')
                }`}
              >
                Open Tool
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md transition-colors ${
                  scrolled || location.pathname !== '/' 
                    ? 'text-gray-700 hover:text-blue-700 hover:bg-blue-50' 
                    : 'text-white hover:text-white hover:bg-white/20'
                }`}
                aria-expanded="false"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu with animation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="md:hidden bg-white"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  <Home size={18} />
                  Home
                </Link>
                <Link
                  to="/tool"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/tool' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  <Wrench size={18} />
                  Open Tool
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      {/* Dynamic spacer based on route */}
      {location.pathname !== '/' && <div className="h-16"></div>}
    </>
  );
}
