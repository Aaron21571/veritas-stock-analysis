
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5050/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Signup successful! You may now log in.');
        setEmail('');
        setPassword('');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage(`❌ ${data.error || 'Signup failed.'}`);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setMessage('❌ Network error or server not reachable.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1a2b] to-black text-white flex flex-col items-center justify-center px-4 py-12 font-semibold">
      <div className="w-full max-w-md border-2 border-gold-gradient p-8 shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-6 text-gold-gradient">Create Account</h1>
        <form onSubmit={handleSignup} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 text-black border-2 border-gold-gradient rounded-none focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 text-black border-2 border-gold-gradient rounded-none focus:outline-none"
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold uppercase tracking-wide hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>
        {message && <p className="mt-6 text-sm text-yellow-400">{message}</p>}
      </div>
    </div>
  );
}

export default SignupPage;
