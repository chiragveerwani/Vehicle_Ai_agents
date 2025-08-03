'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ENV_OPTIONS = [
  {
    value: 'Urban',
    label: 'Urban',
    emoji: '🏙️',
    description: 'Busy streets, traffic jams, and frequent stops.',
  },
  {
    value: 'Suburban',
    label: 'Suburban',
    emoji: '🏡',
    description: 'Mixed environment: residential and light traffic.',
  },
  {
    value: 'Rural',
    label: 'Rural',
    emoji: '🌳',
    description: 'Open roads, less traffic, longer drives.',
  },
];

export default function EnvironmentQuestion() {
  const [environment, setEnvironment] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Load saved environment if any
  useEffect(() => {
    const savedEnv = localStorage.getItem('environment');
    if (savedEnv) {
      setEnvironment(savedEnv);
    }
  }, []);

  const handleSubmit = async () => {
    if (!environment) {
      setError('Please select an environment');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      return;
    }

    setError('');

    const res = await fetch('/api/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ environment }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Unknown error');
      return;
    }

    // Save locally for final submit
    localStorage.setItem('environment', environment);

    router.push('/questionnaire/time'); // Next question
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-cyan-100 to-blue-200 p-6 relative">
      {/* Top-left logo and app name */}
      <div className="absolute top-8 left-10 flex items-center space-x-3">
        <img src="/logo.png" alt="AutoCare Logo" className="w-10 h-10" />
        <span className="text-2xl font-extrabold text-gray-700 tracking-tight">
          AutoCare
        </span>
      </div>

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl mt-20">
        <h1 className="text-3xl font-bold mb-4 text-center">Your Driving Environment</h1>

        {/* Friendly Tip */}
        <p className="mb-7 text-base italic text-center text-cyan-700">
          Knowing your environment helps optimize your car’s maintenance schedule.
        </p>

        {/* Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {ENV_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setEnvironment(opt.value)}
              className={`flex flex-col items-center justify-center border-2 rounded-xl px-5 py-6 cursor-pointer transition
                ${
                  environment === opt.value
                    ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 bg-gray-50 hover:border-cyan-400'
                }`}
              aria-pressed={environment === opt.value}
            >
              <span className="text-5xl mb-3">{opt.emoji}</span>
              <span className="font-bold text-lg mb-1">{opt.label}</span>
              <span className="text-sm text-gray-600 text-center">{opt.description}</span>
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <div className="flex justify-between">
          <button
            onClick={() => router.push('/questionnaire/driving-style')}
            className="px-5 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
            type="button"
          >
            ← Back
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!environment}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
