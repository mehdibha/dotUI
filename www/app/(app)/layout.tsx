import { SidebarProvider } from "@dotui/registry/ui/sidebar";

import { DocsSidebar } from "@/components/layout/docs-sidebar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { docsSource } from "@/modules/docs/source";
import { ActiveStylePortalProvider } from "@/modules/styles/components/active-style-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="[--header-height:calc(var(--spacing)*12)]">
      <ActiveStylePortalProvider>
        <SidebarProvider defaultOpen={false}>
          <DocsSidebar items={docsSource.pageTree.children} />
          <div className="size-full">
            <Header
              items={docsSource.pageTree.children}
              className="md:hidden"
            />
            <div>{children}</div>
            <Footer />
          </div>
        </SidebarProvider>
      </ActiveStylePortalProvider>
    </div>
  );
}
