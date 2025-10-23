import type React from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { docsSource } from "@/modules/docs/lib/source";
import { Providers } from "./providers";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
        <Header items={docsSource.pageTree.children} className="lg:hidden" />
        <Sidebar
          items={docsSource.pageTree.children}
          className="hidden lg:flex"
        />
        <div className="min-w-0 flex-1">
          {/* <div className="min-h-screen sm:grid sm:grid-cols-[20px_1fr_20px] md:grid-cols-[30px_1fr_30px]"> */}
          <div className="min-h-screen">
            {/* <div className="diagonal-pattern hidden sm:block" /> */}
            <div>
              <main>{children}</main>
              <Footer />
            </div>
            {/* <div className="diagonal-pattern hidden sm:block" /> */}
          </div>
        </div>
      </div>
    </Providers>
  );
}
