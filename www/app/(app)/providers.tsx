"use client";

import React from "react";

import { SidebarProvider } from "@/components/layout/sidebar";
import { ActiveStylePortalProvider } from "@/modules/styles/components/active-style-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ActiveStylePortalProvider>{children}</ActiveStylePortalProvider>
    </SidebarProvider>
  );
}
