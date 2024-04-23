"use client";

import { ThemeProvider } from "next-themes";
import { ThemeOverride } from "@/components/theme-override";
import { TooltipProvider } from "@/lib/components/core/default/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider skipDelayDuration={0}>
        <ThemeOverride>{children}</ThemeOverride>
      </TooltipProvider>
    </ThemeProvider>
  );
}
