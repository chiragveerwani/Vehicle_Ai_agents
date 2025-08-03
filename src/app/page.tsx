import Link from 'next/link';

export default function Home() {
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(120deg, #a1e3ff 0%, #d2f3fc 50%, #b5d0ff 100%)",
      }}
    >
      <div className="bg-white bg-opacity-90 rounded-xl shadow-xl flex w-full max-w-3xl overflow-hidden">
        {/* Left side */}
        <div className="flex flex-col items-center justify-center p-10 w-1/2 relative">
          {/* Logo (replace src with your logo path) */}
          <img src="/logo.png" alt="AutoCare Logo" className="mb-6 w-20 h-20" />
          <h1 className="text-4xl font-extrabold mb-2 text-gray-800">Welcome to</h1>
          <span className="text-3xl font-bold text-blue-500 mb-2">AutoCare</span>
          {/* Vertical separator (on medium+ screens) */}
          <div className="absolute right-0 top-8 bottom-8 w-px bg-gray-200 hidden md:block" />
        </div>

        {/* Right side */}
        <div className="flex flex-col items-center justify-center p-10 w-1/2 space-y-6">
          <Link
            href="/login"
            className="w-full bg-blue-500 text-white text-lg py-3 rounded-lg text-center font-semibold hover:bg-blue-600 transition"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="w-full bg-cyan-500 text-white text-lg py-3 rounded-lg text-center font-semibold hover:bg-cyan-600 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
