import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";
import { source } from "@/app/source";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col md:flex-row">
      <MobileNav items={source.pageTree.children} className="md:hidden" />
      <Sidebar items={source.pageTree.children} className="hidden md:flex" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
