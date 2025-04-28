import React, { useEffect, useState } from 'react';

function StockTicker() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStockPrices = async () => {
      try {
        const res = await fetch('http:////veritas-backend-production.up.railway.app/api/ticker-prices');
        const data = await res.json();
        setStocks(data);
      } catch (err) {
        console.error('Error fetching stock prices:', err);
      }
    };

    fetchStockPrices();
    const interval = setInterval(fetchStockPrices, 60000); // Update every 60s

    return () => clearInterval(interval);
  }, []);

  const renderStocks = () => (
    <div className="flex items-center space-x-12">
      {stocks.map((stock, index) => (
        <div key={index} className="flex items-center space-x-2">
          <img
            src={`https://logo.clearbit.com/${stock.domain || `${stock.symbol.toLowerCase()}.com`}`}
            alt={stock.symbol}
            className="w-5 h-5 rounded-sm bg-black"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="text-white opacity-90">{stock.symbol}</span>
          <span className={stock.change >= 0 ? 'text-green-400' : 'text-red-400'}>
            ${stock.price.toFixed(2)}
            <span className="ml-1 text-xs opacity-70">
              ({stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} / {(stock.percent * 100).toFixed(2)}%)
            </span>
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full overflow-hidden bg-black text-white py-2 border-b border-gray-700">
      <div className="flex animate-marquee whitespace-nowrap space-x-12 px-4 text-sm font-medium">
        {renderStocks()}
        {renderStocks()} {/* duplicate */}
      </div>
    </div>
  );
}

export default StockTicker;
