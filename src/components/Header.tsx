import React from 'react';
import { Moon, Sun, Languages } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  isArabic: boolean;
  setIsArabic: (value: boolean) => void;
}

function Header({ isDarkMode, setIsDarkMode, isArabic, setIsArabic }: HeaderProps) {
  const { t } = useTranslation(isArabic);

  return (
    <header className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-emerald-600">
        {t('cryptoAnalyzer')}
      </h1>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsArabic(!isArabic)}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Languages className="w-6 h-6" />
        </button>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;