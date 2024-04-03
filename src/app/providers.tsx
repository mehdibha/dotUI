"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/lib/components/core/default/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider delayDuration={0} skipDelayDuration={0}>
        {children}
      </TooltipProvider>
    </ThemeProvider>
  );
}
