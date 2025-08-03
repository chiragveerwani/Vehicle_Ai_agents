import { useEffect, useRef, useState } from "react";
const testimonials = [
  { name: "Aditi S.", text: "AutoCare saved me from missing a crucial brake service. The AI works!", city: "Bengaluru" },
  { name: "Rahul Verma", text: "The dashboard looks sharp, and reminders mean my car is always ready for trips.", city: "Pune" },
  { name: "Tanvi D.", text: "Booking a workshop slot is SO easy now. Love the dashboard updates.", city: "Delhi" },
];
export default function CustomersSection() {
  const [idx, setIdx] = useState(0);
  const timeout = useRef<NodeJS.Timeout>();
  useEffect(() => {
    timeout.current = setTimeout(() => setIdx(i => (i + 1) % testimonials.length), 5000);
    return () => clearTimeout(timeout.current);
  }, [idx]);
  return (
    <section className="pb-20">
      <h2 className="text-3xl font-black text-cyan-700 mb-8 text-center tracking-tight">What Our Customers Say</h2>
      <div className="max-w-2xl mx-auto flex flex-col items-center relative">
        <div className="w-full bg-white border border-cyan-100 shadow-xl rounded-lg p-10 text-center transition animate-fadeIn">
          <p className="text-xl text-cyan-900 italic mb-5">"{testimonials[idx].text}"</p>
          <div className="text-cyan-700 font-bold">{testimonials[idx].name}</div>
          <div className="text-gray-500">{testimonials[idx].city}</div>
        </div>
        <div className="flex space-x-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              aria-label={`Testimonial ${i + 1}`}
              className={`w-3.5 h-3.5 rounded-full ${i === idx ? 'bg-cyan-700' : 'bg-cyan-200'} transition`}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
