import Link from "next/link";
const features = [
  {
    name: "Vehicle Health",
    icon: "🛠️",
    desc: "Automatic 24/7 monitoring for all engine, brake, tire, and exhaust parameters.",
    href: "/vehicle-health"
  },
  {
    name: "Reminders",
    icon: "⏰",
    desc: "Get timely alerts for servicing, appointments, and routine checks.",
    href: "/reminders"
  },
  {
    name: "Scheduling",
    icon: "📅",
    desc: "Book smart workshop slots that work with your schedule.",
    href: "/scheduling"
  },
  {
    name: "Agent AI",
    icon: "🤖",
    desc: "Multi-agent system finds, predicts, and plans service automatically.",
    href: "/agent-ai"
  },
];

export default function FeaturesSection() {
  return (
    <section className="mb-14">
      <h2 className="text-3xl font-black text-cyan-800 mb-8 text-center tracking-tight">Platform Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9">
        {features.map((f, idx) => (
          <Link
            key={f.name}
            href={f.href}
            className="bg-white hover:bg-cyan-50 group border border-cyan-100 rounded-lg p-7 shadow-lg flex flex-col items-center text-center scale-100 hover:scale-105 transition transform"
          >
            <div className="text-5xl mb-3 group-hover:animate-bounce">{f.icon}</div>
            <h3 className="text-lg font-bold text-cyan-800 mb-1">{f.name}</h3>
            <div className="text-gray-700 mb-1">{f.desc}</div>
            <span className="mt-2 text-cyan-600 font-semibold underline opacity-80 group-hover:opacity-100 transition text-base">Explore</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
