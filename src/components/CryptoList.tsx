import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import CryptoCard from './CryptoCard';
import { useCryptoData } from '../hooks/useCryptoData';

function CryptoList() {
  const { t } = useTranslation(true);
  const { recommendedCoins } = useCryptoData();

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">{t('recommendedCoins')}</h2>
      <div className="space-y-4">
        {recommendedCoins.map((coin) => (
          <CryptoCard key={coin.symbol} coin={coin} />
        ))}
      </div>
    </section>
  );
}

export default CryptoList;