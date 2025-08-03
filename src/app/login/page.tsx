'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError('Invalid credentials');
      return;
    }

    const data = await res.json();
    const token = data.token;

    if (!token) {
      setError('No token received');
      return;
    }

    localStorage.setItem('token', token);

    const prefRes = await fetch('/api/hasPreferences', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!prefRes.ok) {
      setError('Error checking preferences');
      return;
    }

    const prefData = await prefRes.json();

    if (prefData.hasPreferences) {
      router.push('/dashboard');
    } else {
      router.push('/questionnaire');
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background:
          'linear-gradient(120deg, #a1e3ff 0%, #d2f3fc 50%, #b5d0ff 100%)',
      }}
    >
      {/* Top left logo & App Name */}
      <div className="absolute top-8 left-10 flex items-center space-x-3">
        <img src="/logo.png" alt="AutoCare Logo" className="w-10 h-10" />
        <span className="text-2xl font-extrabold text-gray-700 tracking-tight">AutoCare</span>
      </div>

      <form
        onSubmit={handleLogin}
        className="bg-white bg-opacity-90 rounded-xl shadow-lg p-10 w-full max-w-md"
      >
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
          AutoCare Login
        </h1>

        {error && (
          <p className="mb-4 text-red-600 font-semibold text-center">{error}</p>
        )}

        <label className="block mb-2 font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 mb-6 rounded border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="your.email@example.com"
        />

        <label className="block mb-2 font-medium text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 mb-8 rounded border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="********"
        />

        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition"
        >
          Log In
        </button>

        <p className="mt-6 text-center text-gray-700">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}
