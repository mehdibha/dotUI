"use client";

import React from "react";
import { UNSAFE_PortalProvider } from "@react-aria/overlays";
import { SidebarProvider } from "@/components/sidebar";
import { ThemeProvider } from "@/modules/styles/components/style-provider";
import { useCurrentTheme } from "@/modules/styles/atoms/styles-atom";

export function Providers({ children }: { children: React.ReactNode }) {
  let container = React.useRef(null);
  const { currentTheme } = useCurrentTheme();

  return (
    <SidebarProvider>
      <ThemeProvider ref={container} theme={currentTheme}  />
      <UNSAFE_PortalProvider getContainer={() => container.current}>
        {children}
      </UNSAFE_PortalProvider>
    </SidebarProvider>
  );
}
