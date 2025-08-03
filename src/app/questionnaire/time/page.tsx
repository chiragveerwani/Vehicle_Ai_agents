'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeBlocks = ['Morning', 'Afternoon', 'Evening'];

export default function TimePreferencePage() {
  const router = useRouter();
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) router.push('/login');
    setToken(t);
  }, [router]);

  const toggleSlot = (day: string, time: string) => {
    const key = `${day}-${time}`;
    setSelectedSlots(prev =>
      prev.includes(key)
        ? prev.filter(slot => slot !== key)
        : [...prev, key]
    );
  };

  const handleSubmit = () => {
    if (selectedSlots.length === 0) {
      setError('Please select at least one time slot');
      return;
    }
    setError(null);

    // Save preferred time slots in localStorage for final submit page
    localStorage.setItem('preferredTimeSlots', JSON.stringify(selectedSlots));

    // Navigate to submit review page instead of dashboard
    router.push('/questionnaire/submit');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-cyan-100 to-blue-200 p-6 relative">
      {/* Top-left logo & App Name */}
      <div className="absolute top-8 left-10 flex items-center space-x-3 z-10">
        <img src="/logo.png" alt="AutoCare Logo" className="w-10 h-10" />
        <span className="text-2xl font-extrabold text-gray-700 tracking-tight">AutoCare</span>
      </div>

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 mt-20">
        <h1 className="text-3xl font-bold mb-3 text-center text-gray-800">🕐 Preferred Service Times</h1>
        <p className="mb-6 text-center text-cyan-700 italic font-medium">
          Choose time slots that best fit your schedule to help us plan your vehicle servicing efficiently.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {days.map(day => (
            <div key={day}>
              <h3 className="font-semibold text-gray-700 mb-3">{day}</h3>
              <div className="flex gap-3 flex-wrap">
                {timeBlocks.map(time => {
                  const key = `${day}-${time}`;
                  const selected = selectedSlots.includes(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggleSlot(day, time)}
                      className={`px-4 py-2 rounded-full border transition
                        focus:outline-none focus:ring-2 focus:ring-blue-400
                        ${selected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}
                      `}
                      aria-pressed={selected}
                      aria-label={`${day} ${time}`}
                      type="button"
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        <div className="flex justify-between">
          <button
            onClick={() => router.push('/questionnaire/environment')}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
            type="button"
          >
            ← Back
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={selectedSlots.length === 0}
            type="button"
          >
            Save & Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
