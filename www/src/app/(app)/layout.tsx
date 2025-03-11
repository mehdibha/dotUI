import { Footer } from "@/components/footer";
import { MobileNav } from "@/components/mobile-nav";
import { Sidebar, SidebarProvider } from "@/components/sidebar";
import { source } from "@/app/source";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
        <MobileNav items={source.pageTree.children} className="lg:hidden" />
        <Sidebar items={source.pageTree.children} className="hidden lg:flex" />
        <main className="flex-1">
          <div className="sm:grid sm:grid-cols-[20px_1fr_20px] md:grid-cols-[30px_1fr_30px]">
            <div className="diagonal-pattern hidden sm:block" />
            <div>
              <div className="min-h-screen">{children}</div>
              <Footer />
            </div>
            <div className="diagonal-pattern hidden sm:block" />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
