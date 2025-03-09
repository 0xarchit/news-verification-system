import React, { useState } from 'react';
import { NewspaperIcon } from 'lucide-react';
import NewsForm from './components/NewsForm';
import Results from './components/Results';
import { verifyNews } from './lib/gemini';
import AddToHomeScreen from './AddToHomeScreen';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async ({ source, category, type }) => {
    setError(null);
    try {
      setLoading(true);
      const verificationResults = await verifyNews(source, category);
      setResults(verificationResults);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header Section */}
        <header className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <NewspaperIcon className="w-14 h-14 text-purple-600 hover:scale-110 transform transition-transform" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Fake News Detector
          </h1>
          <p className="text-gray-700 text-lg">
            Use AI to verify the authenticity of news articles instantly.
          </p>
        </header>

        {/* News Form Section */}
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8 hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Submit a News Article</h2>
          <NewsForm onSubmit={handleSubmit} />
        </section>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-8 animate-pulse">
            {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-700 font-semibold">Analyzing news...</p>
          </div>
        )}

        {/* Results Section */}
        {results && !loading && (
          <section className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Results</h2>
            <Results results={results} />
          </section>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>
            Made with ❤️ By BitBots ·{' '}
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
      </div>
      <AddToHomeScreen />
    </div>
  );
}

export default App;
