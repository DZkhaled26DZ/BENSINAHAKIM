import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface CryptoCardProps {
  coin: {
    symbol: string;
    lastPrice: string;
    priceChangePercent: string;
  };
}

function CryptoCard({ coin }: CryptoCardProps) {
  const { t } = useTranslation(true);
  const currentPrice = parseFloat(coin.lastPrice);
  const stopLoss = currentPrice * 0.98;
  const targets = [
    currentPrice * 1.02,
    currentPrice * 1.05,
    currentPrice * 1.08
  ];

  return (
    <div className="crypto-card">
      <h3 className="text-xl font-bold text-emerald-600 mb-4">
        {coin.symbol.replace('USDT', '')}
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">{t('currentPrice')}</span>
          <span className="stat-value">{currentPrice.toFixed(8)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">{t('stopLoss')}</span>
          <span className="stat-value">{stopLoss.toFixed(8)}</span>
        </div>
        {targets.map((target, i) => (
          <div key={i} className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t(`target${i + 1}`)}</span>
            <span className="stat-value">{target.toFixed(8)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CryptoCard;