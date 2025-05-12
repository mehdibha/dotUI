"use client";

import React from "react";
import { UNSAFE_PortalProvider } from "@react-aria/overlays";
import { useMounted } from "@/hooks/use-mounted";
import { SidebarProvider } from "@/components/sidebar";
import { useStyles } from "@/modules/styles/atoms/styles-atom";
import { CurrentStyleProvider } from "@/modules/styles/components/current-syle-provider";
import { StyleProvider } from "@/modules/styles/components/style-provider";

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
