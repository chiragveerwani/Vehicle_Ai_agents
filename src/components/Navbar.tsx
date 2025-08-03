import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [name, setName] = useState("");

  useEffect(() => {
    // Load user name from localStorage (replace with auth context/backend as needed)
    const storedName = localStorage.getItem("name");
    if (storedName) setName(storedName);
  }, []);

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Vehicle Health", href: "/vehicle-health" },
    { label: "Reminders", href: "/reminders" },
    { label: "Scheduling", href: "/scheduling" },
    { label: "Profile", href: "/profile" },
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur shadow-md sticky top-0 z-50">

      {/* Logo and App Name */}
      <div className="flex items-center space-x-2 h-12">
        <Link href="/dashboard" className="flex items-center">
          <img src="/logo.png" alt="AutoCare Logo" className="w-9 h-9" />
          <span className="ml-2 text-2xl font-bold text-cyan-700 tracking-tight">
            AutoCare
          </span>
        </Link>
      </div>

      {/* Navigation Links with animated underline on hover and focus */}
      <ul className="flex items-center h-12 space-x-6">
        {navItems.map(({ label, href }) => (
          <li key={href} className="relative group">
            <Link
              href={href}
              className="
                text-cyan-700 font-semibold px-1.5 py-1 h-12 inline-flex items-center relative
                after:absolute after:-bottom-[2px] after:left-0 after:w-full after:h-[2px]
                after:bg-cyan-500 after:origin-left after:scale-x-0 after:transition-transform after:duration-300
                group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100
                leading-none
              "
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* User Greeting */}
      <div className="font-semibold text-cyan-800 text-lg h-12 flex items-center">
        {name ? `Hello, ${name}` : "Hello!"}
      </div>
    </nav>
  );
}
