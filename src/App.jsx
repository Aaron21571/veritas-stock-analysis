
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import StockDetail from './StockDetail';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import Header from './Header';
import StockTicker from './StockTicker';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-[#0c1a2b] to-black text-white">
        <StockTicker />
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/stock/:ticker" element={<StockDetail />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
