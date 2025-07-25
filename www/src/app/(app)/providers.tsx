"use client";

import React from "react";
import { SidebarProvider } from "@/components/sidebar";
import { useMounted } from "@/hooks/use-mounted";
// import { useStyles } from "@/modules/styles/atoms/styles-atom";
import { CurrentStyleProvider } from "@/modules/styles/components/current-style-provider";
import { UNSAFE_PortalProvider } from "@react-aria/overlays";

// import { StyleProvider } from "@/modules/styles/components/style-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const container = React.useRef(null);
  const isMounted = useMounted();

  return (
    <SidebarProvider>
      {isMounted && <CurrentStyleProvider ref={container} />}
      <UNSAFE_PortalProvider getContainer={() => container.current}>
        {children}
      </UNSAFE_PortalProvider>
    </SidebarProvider>
  );
}
