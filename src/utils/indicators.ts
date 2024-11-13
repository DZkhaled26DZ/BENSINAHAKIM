export const calculateStochRSI = (prices: number[], period: number = 14) => {
  // Implementation of StochRSI calculation
  // This is a simplified version - in production you'd want to use a proper technical analysis library
  const rsi = calculateRSI(prices, period);
  const stochRsi = [];
  
  for (let i = period; i < rsi.length; i++) {
    const periodRsi = rsi.slice(i - period, i);
    const minRsi = Math.min(...periodRsi);
    const maxRsi = Math.max(...periodRsi);
    const currentStochRsi = (rsi[i] - minRsi) / (maxRsi - minRsi);
    stochRsi.push(currentStochRsi);
  }
  
  return stochRsi;
};

const calculateRSI = (prices: number[], period: number = 14) => {
  const changes = prices.slice(1).map((price, i) => price - prices[i]);
  const gains = changes.map(change => change > 0 ? change : 0);
  const losses = changes.map(change => change < 0 ? -change : 0);
  
  const avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
  const avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;
  
  const rsi = [100 - (100 / (1 + avgGain / avgLoss))];
  
  for (let i = period; i < prices.length - 1; i++) {
    const currentGain = gains[i];
    const currentLoss = losses[i];
    
    const newAvgGain = (avgGain * (period - 1) + currentGain) / period;
    const newAvgLoss = (avgLoss * (period - 1) + currentLoss) / period;
    
    rsi.push(100 - (100 / (1 + newAvgGain / newAvgLoss)));
  }
  
  return rsi;
};