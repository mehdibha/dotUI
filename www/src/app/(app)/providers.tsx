"use client";

import React from "react";
import { UNSAFE_PortalProvider } from "@react-aria/overlays";
import { useMounted } from "@/hooks/use-mounted";
import { SidebarProvider } from "@/components/sidebar";
import { useCurrentTheme } from "@/modules/styles/atoms/styles-atom";
import { ThemeProvider } from "@/modules/styles/components/style-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const container = React.useRef(null);
  const { currentTheme } = useCurrentTheme();
  const isMounted = useMounted();

  return (
    <SidebarProvider>
      {isMounted && <ThemeProvider ref={container} theme={currentTheme} />}
      <UNSAFE_PortalProvider getContainer={() => container.current}>
        {children}
      </UNSAFE_PortalProvider>
    </SidebarProvider>
  );
}
