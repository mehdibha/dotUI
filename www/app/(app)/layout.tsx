import { SidebarProvider } from "@dotui/registry/ui/sidebar";

import { DocsSidebar } from "@/components/layout/docs-sidebar";
import { docsSource } from "@/modules/docs/lib/source";
import { ActiveStylePortalProvider } from "@/modules/styles/components/active-style-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ActiveStylePortalProvider>
      <SidebarProvider>
        <DocsSidebar items={docsSource.pageTree.children} />
        <div className="size-full">{children}</div>
      </SidebarProvider>
    </ActiveStylePortalProvider>
  );
}
