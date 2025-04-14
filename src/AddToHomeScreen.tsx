import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

// Extend the WindowEventMap interface to include beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

interface AddToHomeScreenProps {
  className?: string;
  variant?: 'modal' | 'button';
  onInstall?: () => void;
}

const AddToHomeScreen: React.FC<AddToHomeScreenProps> = ({ 
  className = '', 
  variant = 'modal',
  onInstall
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  useEffect(() => {
    // Check if the app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setIsAppInstalled(true);
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
      
      // Only show the popup if we're using modal variant
      if (variant === 'modal') {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [variant]);

  const handleAddToHomeScreen = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setIsAppInstalled(true);
          if (onInstall) onInstall();
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setShowPrompt(false);
      });
    }
  };

  const handleNextTime = () => {
    setShowPrompt(false);
  };

  // If app is installed or no prompt is available for button variant, return null
  if (isAppInstalled || (variant === 'button' && !deferredPrompt)) {
    return null;
  }

  // If button variant is requested and prompt is available
  if (variant === 'button') {
    return (
      <motion.button
        onClick={handleAddToHomeScreen}
        className={`flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 border-2 border-white rounded-full font-bold shadow-lg hover:bg-blue-50 transition-all ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Download size={18} />
        <span>Install App</span>
      </motion.button>
    );
  }

  // If modal variant is requested, but no prompt to show
  if (variant === 'modal' && !showPrompt) {
    return null;
  }

  // Default: modal variant with prompt
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-2xl text-center max-w-sm mx-4 w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <Download size={48} className="mx-auto mb-4 text-blue-600" />
        <h3 className="text-2xl font-bold mb-2 text-gray-800">Install App</h3>
        <p className="text-gray-600 mb-6">Add this app to your home screen for quicker access and a better experience.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            onClick={handleAddToHomeScreen}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Install Now
          </motion.button>
          <motion.button
            onClick={handleNextTime}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Later
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddToHomeScreen;