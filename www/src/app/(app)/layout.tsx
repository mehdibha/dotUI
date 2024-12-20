import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";
import { source } from "@/app/source";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col sm:flex-row">
      <MobileNav items={source.pageTree.children} />
      <Sidebar items={source.pageTree.children} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
