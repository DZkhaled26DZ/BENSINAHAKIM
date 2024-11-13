import React, { useState, useEffect } from 'react';
import { Moon, Sun, Search } from 'lucide-react';
import Header from './components/Header';
import CryptoList from './components/CryptoList';
import Predictions from './components/Predictions';
import TimeframeSelector from './components/TimeframeSelector';
import Footer from './components/Footer';
import { useTranslation } from './hooks/useTranslation';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isArabic, setIsArabic] = useState(true);
  const { t } = useTranslation(isArabic);

  useEffect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }, [isArabic]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <Header 
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          isArabic={isArabic}
          setIsArabic={setIsArabic}
        />
        <main className="mt-8">
          <TimeframeSelector />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <CryptoList />
            <Predictions />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;