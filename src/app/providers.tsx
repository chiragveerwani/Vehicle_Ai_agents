"use client";

import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>; // Or just return children directly inside a fragment
}
