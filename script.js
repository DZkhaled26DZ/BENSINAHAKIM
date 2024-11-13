// Configuration
const API_KEY = 'nc3cvP0d3LZzL9AIIgQQsjU6MKN8g5oanFkiAo4BdykbaOlce3HsTbWB3mPCoL8z';
const BASE_URL = 'https://api.binance.com/api/v3';

// State
let isArabic = true;
let isDark = false;
let currentTimeframe = '1h';
let websocket = null;
let cryptoData = [];

// Translations
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
        search: 'بحث عن عملة...'
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
        search: 'Search coins...'
    }
};

// Utility Functions
function t(key) {
    return translations[isArabic ? 'ar' : 'en'][key];
}

async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
    }
}

// Technical Analysis Functions
function calculateRSI(prices, period = 14) {
    const changes = prices.slice(1).map((price, i) => price - prices[i]);
    const gains = changes.map(change => change > 0 ? change : 0);
    const losses = changes.map(change => change < 0 ? -change : 0);
    
    let avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
    let avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;
    
    const rsi = [100 - (100 / (1 + avgGain / avgLoss))];
    
    for (let i = period; i < changes.length; i++) {
        avgGain = (avgGain * (period - 1) + gains[i]) / period;
        avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
        rsi.push(100 - (100 / (1 + avgGain / avgLoss)));
    }
    
    return rsi;
}

function calculateStochRSI(prices, period = 14) {
    const rsi = calculateRSI(prices, period);
    const stochRsi = [];
    
    for (let i = period; i < rsi.length; i++) {
        const periodRsi = rsi.slice(i - period, i);
        const minRsi = Math.min(...periodRsi);
        const maxRsi = Math.max(...periodRsi);
        stochRsi.push((rsi[i] - minRsi) / (maxRsi - minRsi) * 100);
    }
    
    return stochRsi;
}

// API Functions
async function fetchTickers() {
    const data = await fetchWithRetry(`${BASE_URL}/ticker/24hr`);
    return data.filter(ticker => ticker.symbol.endsWith('USDT'));
}

async function fetchKlines(symbol, interval, limit) {
    return await fetchWithRetry(
        `${BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
}

// UI Update Functions
function updateUI() {
    // Update all text content based on current language
    document.querySelector('h1').textContent = t('cryptoAnalyzer');
    document.querySelector('#searchInput').placeholder = t('search');
    
    // Update crypto cards
    const recommendedCoins = document.getElementById('recommendedCoins');
    recommendedCoins.innerHTML = '';
    
    cryptoData.forEach(data => {
        recommendedCoins.innerHTML += updateCryptoCard(data.symbol, data);
    });
    
    // Update predictions
    updatePredictions();
}

function updatePrice(symbol, price) {
    const card = document.querySelector(`.crypto-card[data-symbol="${symbol}"]`);
    if (card) {
        const priceElement = card.querySelector('.current-price');
        if (priceElement) {
            priceElement.textContent = parseFloat(price).toFixed(8);
            priceElement.classList.add('price-update');
            setTimeout(() => priceElement.classList.remove('price-update'), 1000);
        }
    }
}

function updateCryptoCard(symbol, data) {
    const currentPrice = parseFloat(data.lastPrice);
    const stopLoss = currentPrice * 0.98;
    const targets = [
        currentPrice * 1.02,
        currentPrice * 1.05,
        currentPrice * 1.08
    ];
    
    return `
        <div class="crypto-card" data-symbol="${symbol}">
            <h3>${symbol.replace('USDT', '')}</h3>
            <div class="stat-row">
                <span class="stat-label">${t('currentPrice')}</span>
                <span class="stat-value current-price">${currentPrice.toFixed(8)}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">${t('stopLoss')}</span>
                <span class="stat-value">${stopLoss.toFixed(8)}</span>
            </div>
            ${targets.map((target, i) => `
                <div class="stat-row">
                    <span class="stat-label">${t('target' + (i + 1))}</span>
                    <span class="stat-value">${target.toFixed(8)}</span>
                </div>
            `).join('')}
        </div>
    `;
}

async function updatePredictions() {
    const predictionsList = document.getElementById('predictionsList');
    predictionsList.innerHTML = '';
    
    for (const coin of cryptoData) {
        try {
            const klines = await fetchKlines(coin.symbol, currentTimeframe, 100);
            const prices = klines.map(k => parseFloat(k[4]));
            const stochRsi = calculateStochRSI(prices);
            const confidence = Math.round(stochRsi[stochRsi.length - 1]);
            
            predictionsList.innerHTML += `
                <div class="crypto-card">
                    <h3>${coin.symbol.replace('USDT', '')}</h3>
                    <div class="stat-row">
                        <span class="stat-label">${t('confidence')}</span>
                        <span class="stat-value ${confidence > 70 ? 'confidence-high' : confidence > 30 ? 'confidence-medium' : 'confidence-low'}">
                            ${confidence}%
                        </span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">${t('timeLeft')}</span>
                        <span class="stat-value">${currentTimeframe}</span>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error(`Error updating predictions for ${coin.symbol}:`, error);
        }
    }
}

// WebSocket Functions
function initWebSocket() {
    if (websocket) websocket.close();
    
    websocket = new WebSocket('wss://stream.binance.com:9443/ws');
    
    websocket.onopen = () => {
        const symbols = cryptoData.map(data => data.symbol.toLowerCase());
        websocket.send(JSON.stringify({
            method: 'SUBSCRIBE',
            params: symbols.map(symbol => `${symbol}@ticker`),
            id: 1
        }));
    };
    
    websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.e === '24hrTicker') {
            updatePrice(data.s, data.c);
        }
    };
    
    websocket.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };
    
    websocket.onclose = () => {
        setTimeout(initWebSocket, 5000);
    };
}

// Event Listeners
document.getElementById('toggleLang').addEventListener('click', () => {
    isArabic = !isArabic;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    document.getElementById('toggleLang').textContent = isArabic ? 'English' : 'عربي';
    updateUI();
});

document.getElementById('toggleTheme').addEventListener('click', () => {
    isDark = !isDark;
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.getElementById('toggleTheme').textContent = isDark ? '☀️' : '🌙';
});

document.getElementById('timeframeSelect').addEventListener('change', (e) => {
    currentTimeframe = e.target.value;
    updateUI();
});

document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.crypto-card');
    cards.forEach(card => {
        const symbol = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = symbol.includes(searchTerm) ? 'block' : 'none';
    });
});

// Initialize the application
async function init() {
    try {
        const tickers = await fetchTickers();
        cryptoData = tickers
            .sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent))
            .slice(0, 10);
        
        updateUI();
        initWebSocket();
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Start the application
init();