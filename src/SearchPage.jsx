import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchPage() {
  const [ticker, setTicker] = useState('');
  const [sentimentPulse, setSentimentPulse] = useState(false);
  const [featuredStocks, setFeaturedStocks] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticker.trim()) {
      navigate(`/stock/${ticker.toUpperCase()}`);
    }
  };

  const marketSentiment = 0.67;
  const sentimentColor = marketSentiment >= 0 ? 'bg-green-500' : 'bg-red-500';
  const sentimentWidth = `${Math.abs(marketSentiment * 100)}%`;

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('https:////veritas-backend-production.up.railway.app/api/featured-stocks');
        const data = await res.json();
        setFeaturedStocks(data);
      } catch (err) {
        console.error('Failed to fetch featured stocks:', err);
      }
    };

    fetchFeatured();
    const interval = setInterval(fetchFeatured, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setSentimentPulse(true);
    const timeout = setTimeout(() => setSentimentPulse(false), 600);
    return () => clearTimeout(timeout);
  }, [marketSentiment]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1a2b] to-black text-white px-4 py-12 font-semi-bold flex flex-col items-center ">
      <div className="max-w-2xl w-full border-2 border-gold-gradient p-8 text-center shadow-lg ">
        <h1 className="text-5xl font-bold mb-6 text-gold-gradient leading-tight">Stock Lookup</h1>
        <p className="text-lg text-gray-300 mb-8 leading-relaxed font-serif">
          Enter a stock ticker symbol below to receive an AI-powered Buy, Sell, or Hold recommendation.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter stock ticker (e.g. AAPL)"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="px-4 py-3 w-full sm:w-auto rounded-none border-2 border-gold-gradient text-black focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold uppercase tracking-wide hover:opacity-90 transition"
          >
            Search
          </button>
        </form>

        <p className="mt-4 text-xs text-yellow-400">
          ⚠️ This is an educational tool. Predictions are AI-generated and not financial advice.
        </p>
      </div>

      {/* Market Sentiment */}
      <div className="max-w-xl w-full mt-12 mb-10 text-center">
        <div className="flex justify-between items-center mb-2 px-2 text-sm text-gray-400 uppercase tracking-widest">
          <span>← Sell</span>
          <span className="text-yellow-400">Market Sentiment</span>
          <span>Buy →</span>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded overflow-hidden">
          <div
            className={`${sentimentColor} h-3 transition-all duration-700 ease-in-out ${sentimentPulse ? 'animate-pulse' : ''}`}
            style={{ width: sentimentWidth }}
          />
        </div>
      </div>

      {/* Featured Stocks */}
      <div className="w-full max-w-6xl text-center">
        <h2 className="text-lg text-gold-gradient mb-4">Featured Stocks</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {featuredStocks.map(stock => (
            <div
              key={stock.symbol}
              className="border border-gold-gradient py-3 px-5 text-center min-w-[110px]"
            >
              <p className="text-gold-gradient font-semibold">{stock.symbol}</p>
              <p>${stock.price.toFixed(2)}</p>
              <p className={stock.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                {stock.change >= 0 ? '+' : ''}
                {stock.change.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
