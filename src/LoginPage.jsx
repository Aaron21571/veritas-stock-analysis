import React, { useState } from 'react';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5050/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0c1a2b] to-black px-6 py-12">
      <div className="max-w-md w-full border-2 border-gold-gradient p-10 text-center shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gold-gradient">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block mb-1 text-yellow-300">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gold-gradient bg-black text-white rounded-none focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-yellow-300">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gold-gradient bg-black text-white rounded-none focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold uppercase tracking-wide hover:opacity-90 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
