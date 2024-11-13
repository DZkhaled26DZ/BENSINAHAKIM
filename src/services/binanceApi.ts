const API_KEY = 'nc3cvP0d3LZzL9AIIgQQsjU6MKN8g5oanFkiAo4BdykbaOlce3HsTbWB3mPCoL8z';
const BASE_URL = 'https://api.binance.com/api/v3';

export const fetchTickers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/ticker/24hr`);
    const data = await response.json();
    return data.filter((ticker: any) => ticker.symbol.endsWith('USDT'));
  } catch (error) {
    console.error('Error fetching tickers:', error);
    return [];
  }
};

export const fetchKlines = async (symbol: string, interval: string, limit: number) => {
  try {
    const response = await fetch(
      `${BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching klines:', error);
    return [];
  }
};