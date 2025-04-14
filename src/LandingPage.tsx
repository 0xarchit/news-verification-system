import { useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, ShieldCheck, SearchCheck, 
  Newspaper, MessageSquareWarning 
} from 'lucide-react';
import AddToHomeScreen from './AddToHomeScreen';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  // References for section animations
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const ctaRef = useRef(null);

  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  useEffect(() => {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
        if (href) {
          document.querySelector(href)?.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  return (
    <div className="bg-gray-50 overflow-x-hidden">
      {/* Hero Section - Full screen with parallax effect */}
      <motion.section
        style={{ scale }}
        className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-indigo-600 to-slate-800 text-white px-4 overflow-hidden"
      >
        {/* Background floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white bg-opacity-10"
              style={{
                width: Math.random() * 100 + 10,
                height: Math.random() * 100 + 10,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <motion.div
          className="container mx-auto text-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 tracking-tight px-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Fake News Detector
            </span>
          </motion.h1>

          <motion.p 
            className="text-lg sm:text-xl md:text-2xl mb-10 text-center max-w-2xl mx-auto font-light px-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Harness the power of AI to verify news authenticity with precision and confidence.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4 px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link to="/tool" className="group">
              <motion.button
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-700 rounded-full font-bold shadow-xl group-hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </Link>
            
            {/* Add the install button component */}
            <AddToHomeScreen variant="button" className="border-white/80" />
            
            <a href="#about" className="group">
              <motion.button
                className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white text-white rounded-full font-bold transition-all duration-300 group-hover:bg-white group-hover:bg-opacity-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </motion.button>
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator - centered for all screens */}
        <motion.div 
          className="absolute bottom-8 left-0 right-0 mx-auto w-max"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { delay: 1.5, duration: 1 },
            y: { delay: 1.5, repeat: Infinity, duration: 1.5 }
          }}
        >
          <a href="#features" className="text-white flex flex-col items-center">
            <span className="mb-2 text-sm">Scroll to explore</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </motion.div>
      </motion.section>

      {/* Features Section with staggered fade-in */}
      <section id="features" ref={featuresRef} className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 text-gray-800">Why Choose Our Tool?</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI with reliable data sources to give you the most accurate news verification available.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="text-blue-600 mb-5 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with parallax background */}
      <section id="about" ref={aboutRef} className="py-16 md:py-24 bg-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 opacity-50"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 text-gray-800">How It Works</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">The Power of AI & Data</h3>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
                Our Fake News Detector uses advanced AI algorithms trained on millions of verified news articles to analyze content for credibility.
              </p>
              <p className="text-base sm:text-lg text-gray-700">
                By cross-referencing with trusted sources and analyzing linguistic patterns, we provide a comprehensive trustworthiness score with detailed analysis.
              </p>
            </motion.div>
            
            <motion.div
              className="rounded-lg shadow-xl overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="bg-white p-5 sm:p-6 rounded-lg shadow-inner">
                <div className="mb-4 p-3 rounded-md bg-blue-50">
                  <div className="flex items-center gap-3">
                    <MessageSquareWarning className="text-blue-600" size={24} />
                    <p className="font-medium text-blue-700">AI-Powered Analysis</p>
                  </div>
                </div>
                <div className="mb-4 p-3 rounded-md bg-green-50">
                  <div className="flex items-center gap-3">
                    <SearchCheck className="text-green-600" size={24} />
                    <p className="font-medium text-green-700">Source Verification</p>
                  </div>
                </div>
                <div className="p-3 rounded-md bg-slate-50">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-slate-600" size={24} />
                    <p className="font-medium text-slate-700">Trust Score Generation</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section with background animation */}
      <section id="cta" ref={ctaRef} className="py-16 md:py-20 bg-gradient-to-br from-blue-700 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Ready to Verify News?
          </motion.h2>
          
          <motion.p
            className="text-lg sm:text-xl mb-8 sm:mb-10 text-blue-100"
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Start using our tool today and never fall for fake news again.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/tool">
              <motion.button
                className="px-8 sm:px-10 py-3 sm:py-4 bg-white text-blue-700 rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started Now
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="mb-4">
            Made with ❤️
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="https://github.com/0xarchit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <span className="text-gray-600">|</span>
            <a 
              href="#" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature data
const features = [
  {
    icon: <CheckCircle size={42} />,
    title: "Accurate Analysis",
    description: "Our AI model is trained on verified news sources to deliver high-precision authenticity assessments."
  },
  {
    icon: <Newspaper size={42} />,
    title: "Trusted Sources",
    description: "We cross-reference news with reliable sources across the web to validate information."
  },
  {
    icon: <ShieldCheck size={42} />,
    title: "Detailed Reporting",
    description: "Get comprehensive analysis with trust scores, source verification, and potential bias detection."
  }
];
