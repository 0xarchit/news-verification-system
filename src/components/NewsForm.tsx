import { useState } from 'react';
import { FileText, Link as LinkIcon, AlertCircle, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  'education',
  'finance',
  'politics',
  'world',
  'india',
  'tech',
  'entertainment',
  'sports',
  'science',
];

interface NewsFormProps {
  onSubmit: (data: { source: string; category: string; type: 'text' | 'link' }) => Promise<any>;
  onCachedResult: (cachedResult: any) => void; 
}

export default function NewsForm({ onSubmit, onCachedResult }: NewsFormProps) {
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'text' | 'link'>('text');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !category) return;
    
    setIsSubmitting(true);
    try {
      const res = await onSubmit({
        source,
        category,
        type,
      });
      
      if (res) {
        onCachedResult(res);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Type selector with animation */}
      <div className="flex flex-wrap sm:flex-nowrap gap-3 bg-gray-50 p-1.5 rounded-xl">
        <motion.button
          type="button"
          onClick={() => setType('text')}
          className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            type === 'text' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-transparent text-gray-700 hover:bg-gray-100'
          }`}
          whileHover={type !== 'text' ? { scale: 1.02 } : {}}
          whileTap={{ scale: 0.98 }}
        >
          <FileText size={18} />
          <span>Text</span>
        </motion.button>
        
        <motion.button
          type="button"
          onClick={() => setType('link')}
          className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            type === 'link' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-transparent text-gray-700 hover:bg-gray-100'
          }`}
          whileHover={type !== 'link' ? { scale: 1.02 } : {}}
          whileTap={{ scale: 0.98 }}
        >
          <LinkIcon size={18} />
          <span>URL</span>
        </motion.button>
      </div>

      {/* Input section with animations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-50 p-5 rounded-xl"
      >
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {type === 'text' ? '📝 Enter news text' : '🔗 Enter news URL'}
        </label>
        
        {type === 'text' ? (
          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="Paste your news text here..."
            required
          />
        ) : (
          <input
            type="url"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="https://example.com/news-article"
            required
          />
        )}
      </motion.div>

      {/* Category dropdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-gray-50 p-5 rounded-xl relative"
      >
        <label className="block text-sm font-medium text-gray-700 mb-3">
          📊 Select a category
        </label>
        
        <div className="relative">
          <select
            title='Select a category'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 bg-white rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-gray-700"
            required
          >
            <option value="">Choose the news category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="py-1">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
            <ChevronDown size={16} />
          </div>
        </div>
      </motion.div>

      {/* Submit button */}
      <motion.button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Verify News'
        )}
      </motion.button>

      {/* Info text */}
      <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-4 rounded-xl">
        <AlertCircle size={16} className="text-blue-500 flex-shrink-0" />
        <p>We'll analyze your news using trusted sources and AI verification to determine its credibility.</p>
      </div>
    </motion.form>
  );
}