import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { SearchDocs } from "@/components/docs/search-docs";
import { docsConfig } from "@/config/docs-config";
import { ScrollArea } from "@/registry/ui/default/core/scroll-area";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return <div className="p-10">{children}</div>
  return (
    <div className="min-h-[90vh] border-b">
      <div className="container items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6">
        {/* <aside className="z-30 hidden space-y-2 pt-6 md:sticky md:top-0 md:block">
          <SearchDocs />
          <ScrollArea className="h-screen pb-8">
            <DocsSidebar items={docsConfig.nav} />
          </ScrollArea> 
        </aside>*/}
        {children}
      </div>
    </div>
  );
}
