'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Signup failed');
      return;
    }

    setSuccess('Account successfully created! Redirecting to login...');
    // Save name locally for dashboard use after login
    localStorage.setItem('name', name);

    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background:
          'linear-gradient(120deg, #a1e3ff 0%, #d2f3fc 50%, #b5d0ff 100%)',
      }}
    >
      {/* Logo + app name */}
      <div className="absolute top-8 left-10 flex items-center space-x-3">
        <img src="/logo.png" alt="AutoCare Logo" className="w-10 h-10" />
        <span className="text-2xl font-extrabold text-gray-700 tracking-tight">
          AutoCare
        </span>
      </div>

      <form
        onSubmit={handleSignup}
        className="bg-white bg-opacity-90 rounded-xl shadow-lg p-10 w-full max-w-md"
      >
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
          Sign Up
        </h1>

        {error && (
          <p className="mb-4 text-red-600 font-semibold text-center">{error}</p>
        )}

        {success && (
          <p className="mb-4 text-green-600 font-semibold text-center">
            {success}
          </p>
        )}

        <label className="block mb-2 font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 mb-6 rounded border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Your full name"
        />

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
          className="w-full px-4 py-3 mb-4 rounded border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="********"
        />

        <label className="block mb-2 font-medium text-gray-700">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-3 mb-8 rounded border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="********"
        />

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
        >
          Sign Up
        </button>

        <p className="mt-6 text-center text-gray-700">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}

