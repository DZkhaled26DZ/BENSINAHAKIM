import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

function TimeframeSelector() {
  const { t } = useTranslation(true);

  return (
    <div className="mb-8">
      <select 
        className="w-full md:w-64 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        defaultValue="1h"
      >
        <option value="5m">5 {t('minutes')}</option>
        <option value="15m">15 {t('minutes')}</option>
        <option value="30m">30 {t('minutes')}</option>
        <option value="1h">1 {t('hours')}</option>
        <option value="4h">4 {t('hours')}</option>
        <option value="1d">1 {t('days')}</option>
      </select>
    </div>
  );
}

export default TimeframeSelector;