import logo from './assets/veritas-logo.svg'; // Keep this as is
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="w-full flex justify-between items-center px-6 py-3 border-b border-gold-gradient bg-[#0c1a2b] font-semibold">
      <div className="flex items-center space-x-6 text-sm uppercase tracking-wide ">
        <Link to="/" className="text-gold-gradient hover:opacity-80 transition">About Us</Link>
        <Link to="/search" className="text-gold-gradient hover:opacity-80 transition">Stock Search</Link>
        <Link to="/signup" className="text-gold-gradient hover:opacity-80 transition">Sign Up</Link>
        <Link to="/login" className="text-gold-gradient hover:opacity-80 transition">Login</Link>

      </div>
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Veritas Logo" className="h-6 w-6" />
        <span className="text-gold-gradient font-bold text-lg">Veritas Stock Analysis</span>
      </div>
    </div>
  );
}

export default Header;