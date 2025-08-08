import React from "react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Sidebar, SidebarProvider } from "@/components/sidebar";
import { source } from "@/modules/docs/lib/source";
import { Providers } from "./providers";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
        <Header items={source.pageTree.children} className="lg:hidden" />
        <Sidebar items={source.pageTree.children} className="hidden lg:flex" />
        <main className="flex-1">
          <div className="min-h-screen">
            <Providers>{children}</Providers>
          </div>
          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
}
