type HeroSectionProps = { name: string };

export default function HeroSection({ name }: HeroSectionProps) {
  return (
    <section
      className="animated-gradient-hero w-full max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-16 py-14 rounded-2xl shadow-xl mb-14 transition-colors duration-1000"
      style={{
        // Smoothed corners for large screens, but mostly straight for that open look
        borderRadius: "1.25rem",
        minHeight: "45vh"
      }}
    >
      <div className="flex-1 md:mr-12">
        <h1 className="text-5xl font-black text-cyan-800 mb-4 drop-shadow-sm">
          Welcome to AutoCare{name ? `, ${name}` : ""}!
        </h1>
        <p className="text-xl text-cyan-900 mb-6 max-w-xl">
          Drive smarter with a dashboard that anticipates your needs, keeps you safe, and puts total control at your fingertips.
        </p>
      </div>
      <div className="flex-1 flex justify-center mb-8 md:mb-0">
        <img
          src="/car-illustration.png"
          alt="Car"
          className="w-[320px] md:w-[420px] drop-shadow-2xl"
          draggable={false}
        />
      </div>
    </section>
  );
}
