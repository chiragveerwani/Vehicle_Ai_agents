'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubmitPreferencesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [preferences, setPreferences] = useState<{
    drivingStyle: string;
    environment: string;
    preferredTimeSlots: string[];
  } | null>(null);

  useEffect(() => {
    const drivingStyle = localStorage.getItem('drivingStyle');
    const environment = localStorage.getItem('environment');
    const slots = localStorage.getItem('preferredTimeSlots');

    if (!drivingStyle || !environment || !slots) {
      setError('Missing answers. Please complete all steps.');
      return;
    }

    setPreferences({
      drivingStyle,
      environment,
      preferredTimeSlots: JSON.parse(slots),
    });
  }, []);

  const handleSubmit = async () => {
    if (!preferences) return;

    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      setError('Not authenticated. Please login again.');
      return;
    }

    try {
      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // <-- Add token here!
        },
        body: JSON.stringify({
          driving_style: preferences.drivingStyle,
          environment: preferences.environment,
          preferred_time_slots: preferences.preferredTimeSlots,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        // Clear localStorage after success
        localStorage.removeItem('drivingStyle');
        localStorage.removeItem('environment');
        localStorage.removeItem('preferredTimeSlots');
        // Navigate after short delay to show success
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else if (res.status === 401) {
        setError('Unauthorized. Please login again.');
      } else {
        const data = await res.json();
        setError(data.error || 'Server error');
      }
    } catch (err) {
      setError('Failed to submit preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-lg mx-auto mt-20 p-6 border rounded shadow text-red-600">
        <h2 className="text-xl font-bold mb-2">🚫 Error</h2>
        <p>{error}</p>
        <button
          onClick={() => router.push('/questionnaire')}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!preferences) {
    return <p className="text-center mt-20 text-gray-600">Loading your answers...</p>;
  }

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-cyan-100 to-blue-200 flex items-center justify-center relative">
      {/* Top-left logo & App Name */}
      <div className="absolute top-8 left-10 flex items-center space-x-3 z-10">
        <img src="/logo.png" alt="AutoCare Logo" className="w-10 h-10" />
        <span className="text-2xl font-extrabold text-gray-700 tracking-tight">AutoCare</span>
      </div>

      <div className="max-w-lg w-full bg-white bg-opacity-90 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">✅ Review & Submit</h1>

        <div className="mb-6 space-y-3 text-gray-800">
          <p>
            <strong>Driving Style:</strong> {preferences.drivingStyle}
          </p>
          <p>
            <strong>Environment:</strong> {preferences.environment}
          </p>
          <div>
            <strong>Preferred Time Slots:</strong>
            <ul className="list-disc list-inside text-gray-700 max-h-40 overflow-y-auto mt-2">
              {preferences.preferredTimeSlots.map((slot, i) => (
                <li key={i}>{slot}</li>
              ))}
            </ul>
          </div>
        </div>

        {submitted && (
          <p className="mb-4 text-green-600 font-semibold text-center">
            Preferences submitted successfully! Redirecting...
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || submitted}
          className={`w-full p-3 rounded-lg font-semibold text-white transition ${
            loading || submitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Preferences'}
        </button>
      </div>
    </main>
  );
}

