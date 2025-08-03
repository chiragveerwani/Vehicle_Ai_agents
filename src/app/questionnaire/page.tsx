'use client';

import { useRouter } from 'next/navigation';

export default function QuestionnaireIntro() {
  const router = useRouter();

  const start = () => {
    router.push('/questionnaire/driving-style');
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-200 p-6 relative"
    >
      {/* Top-left logo & App Name */}
      <div className="absolute top-8 left-10 flex items-center space-x-3">
        <img src="/logo.png" alt="AutoCare Logo" className="w-10 h-10" />
        <span className="text-2xl font-extrabold text-gray-700 tracking-tight">
          AutoCare
        </span>
      </div>

      <section className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative overflow-hidden">
        {/* Emoji without animation */}
        <div
          className="text-6xl mb-6 text-blue-600 select-none"
          aria-hidden="true"
        >
          🔧
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900 text-center">
          Let’s Get to Know Your <span className="text-blue-600">Driving Preferences</span>
        </h1>

        {/* Subtext */}
        <p className="mb-8 text-gray-700 font-medium text-center">
          Help us personalize your vehicle’s health care with a quick, easy questionnaire.
        </p>

        {/* Progress bar (just a visual hint for step 1) */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div className="bg-blue-600 h-2 rounded-full w-1/6 transition-all duration-500" />
        </div>

        {/* Start Button */}
        <button
          onClick={start}
          className="block w-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-white py-3 rounded-xl font-semibold transition"
          aria-label="Start questionnaire"
        >
          Start Questionnaire
        </button>

        {/* Decorative subtle circles */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-blue-200 opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -top-10 w-24 h-24 rounded-full bg-cyan-200 opacity-30 blur-2xl" />
      </section>
    </main>
  );
}

