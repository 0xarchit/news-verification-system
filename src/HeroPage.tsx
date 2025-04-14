import { motion } from 'framer-motion';

interface HeroPageProps {
  onGetStarted: () => void;
}

export default function HeroPage({ onGetStarted }: HeroPageProps) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Title */}
      <motion.h1 
        className="text-5xl md:text-7xl font-extrabold mb-4"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
      >
        Fake News Detector
      </motion.h1>

      {/* Subtitle */}
      <motion.p 
        className="text-xl md:text-2xl mb-8 text-center max-w-2xl"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Verify the authenticity of news with AI-powered insights.
      </motion.p>

      {/* Get Started Button */}
      <motion.button 
        onClick={onGetStarted}
        className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold shadow-lg hover:bg-gray-200 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Get Started
      </motion.button>
    </motion.div>
  );
}
