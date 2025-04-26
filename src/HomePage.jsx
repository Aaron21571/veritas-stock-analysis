import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="mid-h-screen bg-gradient-to-b from-[#0c1a2b] to-black text-white flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full border-2 border-gold-gradient p-8 text-center shadow-lg font-semi-bold">
        <h1 className="text-5xl font-bold mb-4 text-gold-gradient leading-tight">
          Welcome to Veritas Stock Analysis
        </h1>
        <p className="text-lg text-gray-300 mb-1 leading-relaxed font-serif">
          Empower your financial future with one of the only free AI-driven stock recommendation websites on the internet.
          Our models use real technical indicators like RSI, MACD, and Bollinger Bands to
          guide Buy, Sell, or Hold decisions.
        </p>
        <p className="text-md text-gray-400 mb-6 font-serif">
        Our mission is to help students, young adults, and anyone seeking to make smarter investments, especially those who lack the time to thoroughly research and learn the intricacies of investing. 
        Our advanced AI model, trained on over 30 years of historical stock data, provides clear and actionable investment guidance, simplifying your journey to financial success, 
        all while furthing your knowledge in the stock market.
        </p>

        <div className="bg-gray-800 border-2 border-gold-gradient p-6 text-left">
          <h2 className="text-2xl font-semibold mb-4 text-gold-gradient">
            How And Why It Works
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300 font-serif">
            <li>Real historical stock data is pulled from Yahoo Finance every 60 seconds.</li>
            <li>Technical indicators are calculated directly on the data instantly by the LSTM.</li>
            <li>A trained LSTM neural network generates a Buy, Sell, or Hold prediction for any searched stock.</li>
            <li>The model is trained with over 30 years and counting of daily historical stock data to increase precision.</li>
          </ul>
        </div>

        <button
          onClick={() => navigate('/search')}
          className="mt-8 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold uppercase tracking-wide border-none hover:opacity-90 transition"
        >
          Search for Stocks
        </button>

        <p className="mt-4 text-xs text-yellow-400">
          ⚠️ This is an educational tool. Predictions are AI-generated and not financial advice.
        </p>
      </div>
      
    </div>
  );
}

export default HomePage;

