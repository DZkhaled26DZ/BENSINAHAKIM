import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useCryptoData } from '../hooks/useCryptoData';

function Predictions() {
  const { t } = useTranslation(true);
  const { predictions } = useCryptoData();

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">{t('predictions')}</h2>
      <div className="space-y-4">
        {predictions.map((prediction) => (
          <div key={prediction.symbol} className="crypto-card">
            <h3 className="text-xl font-bold text-emerald-600 mb-4">
              {prediction.symbol}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t('confidence')}</span>
                <span className="font-semibold">{prediction.confidence}%</span>
              </div>
              <div className="flex justify-between">
                <span>{t('timeLeft')}</span>
                <span>{prediction.timeLeft}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Predictions;