// components/ui/card.tsx
import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl shadow-md border p-4 bg-white">
      {children}
    </div>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="mt-2 text-sm text-gray-700">{children}</div>;
}
