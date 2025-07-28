import React from "react";

import { Footer } from "@/components/footer";
import { Sidebar, SidebarProvider } from "@/components/sidebar";
import { source } from "@/modules/docs/lib/source";
import { Providers } from "./providers";
import { Header } from "@/components/header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
        <Header
          items={source.pageTree.children}
          className="lg:hidden"
          containerClassName="max-w-3xl"
        />
        <Sidebar items={source.pageTree.children} className="hidden lg:flex" />
        <main className="flex-1">
          <div className="sm:grid">
            {/* <div className="hidden diagonal-pattern sm:block" /> */}
            <div>
              <div className="min-h-screen">
                <Providers>{children}</Providers>
              </div>
              <Footer />
            </div>
            {/* <div className="hidden diagonal-pattern sm:block" /> */}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
