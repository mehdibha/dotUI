import { SidebarProvider } from "@dotui/registry/ui/sidebar";

import { DocsSidebar } from "@/components/layout/docs-sidebar";
import { Header } from "@/components/layout/header";
import { docsSource } from "@/modules/docs/lib/source";
import { ActiveStylePortalProvider } from "@/modules/styles/components/active-style-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ActiveStylePortalProvider>
      <SidebarProvider defaultOpen>
        <DocsSidebar items={docsSource.pageTree.children} />
        <div className="size-full">
          <Header items={docsSource.pageTree.children} className="md:hidden" />
          {children}
        </div>
      </SidebarProvider>
    </ActiveStylePortalProvider>
  );
}
