import { SidebarProvider } from "@dotui/registry/ui/sidebar";

import { DocsSidebar } from "@/components/layout/docs-sidebar";
import { ActiveStylePortalProvider } from "@/modules/styles/components/active-style-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ActiveStylePortalProvider>
        <SidebarProvider>
          <DocsSidebar />
          <div className="size-full">{children}</div>
        </SidebarProvider>
      </ActiveStylePortalProvider>
    </div>
  );
}
