import React, { useState, useEffect } from 'react';
import { FileText, Link, AlertCircle } from 'lucide-react';

const categories = [
  'education',
  'finance',
  'politics',
  'international',
  'india',
  'tech',
  'entertainment',
  'sports',
  'science',
];

interface NewsFormProps {
  onSubmit: (data: { source: string; category: string; type: 'text' | 'link' }) => void;
  onCachedResult: (cachedResult: any) => void; // Callback for cached results
}

export default function NewsForm({ onSubmit, onCachedResult }: NewsFormProps) {
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'text' | 'link'>('text');

  // Generate a unique key for sessionStorage based on input
  const getCacheKey = () => {
    return `${type}-${category}-${source}`;
  };

  // Check sessionStorage for cached result on mount or input change
  useEffect(() => {
    const cacheKey = getCacheKey();
    const cachedResult = sessionStorage.getItem(cacheKey);
    if (cachedResult) {
      onCachedResult(JSON.parse(cachedResult));
    }
  }, [source, category, type, onCachedResult]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cacheKey = getCacheKey();
    const cachedResult = sessionStorage.getItem(cacheKey);

    if (cachedResult) {
      // If result is cached, use it instead of submitting
      onCachedResult(JSON.parse(cachedResult));
    } else {
      // Submit the form and cache the result
      onSubmit({
        source,
        category,
        type,
      });
      // Assuming onSubmit eventually returns a result that you can cache
      // You might need to adjust this based on how your parent component handles the result
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setType('text')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            type === 'text' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <FileText size={20} />
          Text
        </button>
        <button
          type="button"
          onClick={() => setType('link')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            type === 'link' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          <Link size={20} />
          URL
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter {type === 'text' ? 'news text' : 'news URL'}
        </label>
        {type === 'text' ? (
          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Paste your news text here..."
            required
          />
        ) : (
          <input
            type="url"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/news-article"
            required
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Verify News
      </button>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <AlertCircle size={16} />
        <p>We'll analyze your news using trusted sources and AI verification.</p>
      </div>
    </form>
  );
}