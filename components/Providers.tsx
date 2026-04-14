"use client";

import { SessionProvider } from "next-auth/react";

import { GamificationProvider } from "./GamificationProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GamificationProvider>
        {children}
      </GamificationProvider>
    </SessionProvider>
  );
}
