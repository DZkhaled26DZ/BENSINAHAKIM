const translations = {
  ar: {
    cryptoAnalyzer: 'محلل العملات الرقمية',
    timeframe: 'الإطار الزمني',
    predictions: 'التوقعات',
    recommendedCoins: 'العملات الموصى بها',
    currentPrice: 'السعر الحالي',
    stopLoss: 'وقف الخسارة',
    target1: 'الهدف الأول',
    target2: 'الهدف الثاني',
    target3: 'الهدف الثالث',
    confidence: 'نسبة الثقة',
    timeLeft: 'الوقت المتبقي',
    copyright: 'جميع الحقوق محفوظة',
    developerName: 'خالد دراغة',
    search: 'بحث',
    minutes: 'دقائق',
    hours: 'ساعات',
    days: 'أيام',
  },
  en: {
    cryptoAnalyzer: 'Crypto Analyzer',
    timeframe: 'Timeframe',
    predictions: 'Predictions',
    recommendedCoins: 'Recommended Coins',
    currentPrice: 'Current Price',
    stopLoss: 'Stop Loss',
    target1: 'Target 1',
    target2: 'Target 2',
    target3: 'Target 3',
    confidence: 'Confidence',
    timeLeft: 'Time Left',
    copyright: 'All rights reserved',
    developerName: 'Khaled Dragha',
    search: 'Search',
    minutes: 'minutes',
    hours: 'hours',
    days: 'days',
  },
};

export const useTranslation = (isArabic: boolean) => {
  const t = (key: keyof typeof translations.en) => {
    return isArabic ? translations.ar[key] : translations.en[key];
  };

  return { t };
};