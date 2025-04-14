import { useState, useEffect } from 'react';
import { NewspaperIcon } from 'lucide-react';
import NewsForm from './components/NewsForm';
import Results from './components/Results';
import { verifyNews } from './lib/gemini';
import Navigation from './components/Navigation';
import { motion } from 'framer-motion';

interface NewsVerifierToolProps {
  newsDataCache: React.MutableRefObject<{ [key: string]: any }>;
}

export default function NewsVerifierTool({ newsDataCache }: NewsVerifierToolProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    trustScore: number;
    analysis: string;
    sourceandrelated: string;
    potentialBiases: string[];
    recommendation: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clear UI state when component mounts
  useEffect(() => {
    setResults(null);
    setError(null);
    // Don't clear newsDataCache - we want to keep that between sessions
  }, []);

  interface SubmitParams {
    source: string;
    category: string;
    type: 'text' | 'link';
  }

  const handleSubmit = async ({ source, category, type }: SubmitParams) => {
    setError(null);
    
    // Create a stable cache key based on input parameters
    const cacheKey = `${type}-${category}-${encodeURIComponent(source.trim())}`;
    
    // Only use cache for actual news data, not UI state
    if (newsDataCache.current && newsDataCache.current[cacheKey]) {
      console.log("Using cached news verification data");
      setResults(newsDataCache.current[cacheKey]);
      return; // No need to set loading if we're using cached data
    }
    
    try {
      setLoading(true);
      const verificationResults = await verifyNews(source, category);
      
      // Only cache the actual news data, not UI state
      if (newsDataCache.current) { // Make sure the ref is valid
        newsDataCache.current[cacheKey] = verificationResults;
        console.log("Saved results to cache with key:", cacheKey);
      }
      
      // Set results in UI state
      setResults(verificationResults);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCachedResult = (cachedResult: any) => {
    // Separate UI state from cache
    setResults(cachedResult);
    setLoading(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50">
      <Navigation />
      <motion.div 
        className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <header className="text-center mb-8 sm:mb-10">
          <div className="flex justify-center mb-4">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <NewspaperIcon className="w-12 h-12 sm:w-14 sm:h-14 text-blue-600" />
            </motion.div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Fake News Detector
          </h1>
          <p className="text-base sm:text-lg text-gray-700">
            Use AI to verify the authenticity of news articles instantly.
          </p>
        </header>

        {/* News Form Section */}
        <section className="bg-white rounded-xl shadow-lg p-5 sm:p-8 mb-8 hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Submit a News Article</h2>
          <NewsForm onSubmit={handleSubmit} onCachedResult={handleCachedResult} />
        </section>

        {/* Error Message */}
        {error && (
          <motion.div 
            className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </motion.div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="inline-block">
              <div className="relative w-20 h-20">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-ping opacity-75"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            </div>
            <p className="mt-4 text-gray-700 font-semibold">Analyzing news...</p>
          </motion.div>
        )}

        {/* Results Section */}
        {results && !loading && (
          <motion.section 
            className="bg-white rounded-xl shadow-lg p-5 sm:p-8 hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Results</h2>
            <Results results={results} />
          </motion.section>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>
            Made with ❤️ · {' '}
            <a
              href="https://github.com/0xarchit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              View Source
            </a>
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
