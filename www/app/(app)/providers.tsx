"use client";

import React from "react";

import { SidebarProvider } from "@/components/sidebar";
import { CurrentStylePortalProvider } from "@/modules/styles/components/active-style-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <CurrentStylePortalProvider>{children}</CurrentStylePortalProvider>
    </SidebarProvider>
  );
}
