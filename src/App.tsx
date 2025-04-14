import { useRef, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import NewsVerifierTool from './NewsVerifierTool';
import AddToHomeScreen from './AddToHomeScreen';

// Create a persistent cache object outside the component to ensure it's preserved
// between route changes and component renders
const globalNewsDataCache: { [key: string]: any } = {};

function App() {
  // Use the global cache object rather than creating a new one on each render
  const newsDataCacheRef = useRef<{ [key: string]: any }>(globalNewsDataCache);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // This ensures routes are properly initialized before rendering
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null; // Return a loading state or null to prevent premature rendering
  }

  return (
    // Using BrowserRouter for cleaner, hash-free URLs.
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tool" element={<NewsVerifierTool newsDataCache={newsDataCacheRef} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <AddToHomeScreen variant="modal" />
    </BrowserRouter>
  );
}

export default App;