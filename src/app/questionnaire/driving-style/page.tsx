'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const STYLE_OPTIONS = [
  {
    value: 'Cautious',
    label: 'Cautious',
    emoji: '🛑',
    description: 'Safe, smooth, careful — extends vehicle life!',
  },
  {
    value: 'Normal',
    label: 'Normal',
    emoji: '🚗',
    description: 'Everyday balanced driving: city & highway.',
  },
  {
    value: 'Aggressive',
    label: 'Aggressive',
    emoji: '🏁',
    description: 'Fast starts, hard brakes, love for speed.',
  },
];

export default function DrivingStyleQuestion() {
  const [style, setStyle] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Load saved style on mount, if any
  useEffect(() => {
    const savedStyle = localStorage.getItem('drivingStyle');
    if (savedStyle) {
      setStyle(savedStyle);
    }
  }, []);

  const handleSubmit = async () => {
    if (!style) {
      setError('Please select a driving style');
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
      body: JSON.stringify({ drivingStyle: style }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Unknown error');
      return;
    }

    // Save selection locally for final submit
    localStorage.setItem('drivingStyle', style);

    router.push('/questionnaire/environment'); // Next question
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-cyan-100 to-blue-200 p-4 relative">
      {/* Top left logo & app name */}
      <div className="absolute top-8 left-10 flex items-center space-x-3">
        <img src="/logo.png" alt="AutoCare Logo" className="w-10 h-10" />
        <span className="text-2xl font-extrabold text-gray-700 tracking-tight">
          AutoCare
        </span>
      </div>

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl mt-20">
        <h1 className="text-3xl font-bold mb-5 text-center">Pick Your Driving Style</h1>
        <p className="mb-7 text-base italic text-center text-cyan-700">
          Friendly Tip: The way you drive changes how often your car needs service!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {STYLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`flex flex-col items-center justify-center border-2 rounded-xl px-4 py-6 cursor-pointer transition
                ${
                  style === opt.value
                    ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 bg-gray-50 hover:border-cyan-400'
                }`}
              onClick={() => setStyle(opt.value)}
              aria-pressed={style === opt.value}
            >
              <span className="text-4xl mb-3">{opt.emoji}</span>
              <span className="font-bold text-lg mb-2">{opt.label}</span>
              <span className="text-sm text-gray-600">{opt.description}</span>
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={!style}
        >
          Next
        </button>
      </div>
    </div>
  );
}


