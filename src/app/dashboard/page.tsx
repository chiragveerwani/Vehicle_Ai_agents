'use client';
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/dashboard/HeroSection";
import FeaturesSection from "@/components/dashboard/FeaturesSection";
import CustomersSection from "@/components/dashboard/CustomersSection";

export default function DashboardPage() {
  // Optionally lift state up for user or use context/auth provider
  const name = typeof window !== 'undefined' ? localStorage.getItem('name') || "" : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-white font-sans">
      <Navbar />
      <main className="pt-24 px-4 sm:px-8 md:px-16 max-w-7xl mx-auto w-full">
        <HeroSection name={name} />
        <FeaturesSection />
        <CustomersSection />
      </main>
    </div>
  );
}
