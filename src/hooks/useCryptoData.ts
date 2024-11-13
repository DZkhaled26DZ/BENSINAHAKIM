import { useState, useEffect } from 'react';
import { fetchTickers, fetchKlines } from '../services/binanceApi';
import { calculateStochRSI } from '../utils/indicators';

export const useCryptoData = () => {
  const [recommendedCoins, setRecommendedCoins] = useState([]);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tickers = await fetchTickers();
        const sortedTickers = tickers
          .sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent))
          .slice(0, 10);

        setRecommendedCoins(sortedTickers);

        // Calculate predictions based on StochRSI
        const predictionsData = await Promise.all(
          sortedTickers.map(async (ticker) => {
            const klines = await fetchKlines(ticker.symbol, '1h', 100);
            const prices = klines.map(k => parseFloat(k[4]));
            const stochRsi = calculateStochRSI(prices);
            const lastStochRsi = stochRsi[stochRsi.length - 1];

            return {
              symbol: ticker.symbol.replace('USDT', ''),
              confidence: Math.round(lastStochRsi * 100),
              timeLeft: '2h',
            };
          })
        );

        setPredictions(predictionsData);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  return { recommendedCoins, predictions };
};