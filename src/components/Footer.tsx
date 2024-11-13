import React from 'react';
import { Mail } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

function Footer() {
  const { t } = useTranslation(true);

  return (
    <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('copyright')} © 2024 {t('developerName')}
        </p>
        <a
          href="mailto:gsmkhaledtiaret@gmail.com"
          className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 mt-4 md:mt-0"
        >
          <Mail className="w-4 h-4" />
          gsmkhaledtiaret@gmail.com
        </a>
      </div>
    </footer>
  );
}

export default Footer;