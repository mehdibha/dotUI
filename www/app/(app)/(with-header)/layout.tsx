import type { ReactNode } from "react";

import { Header } from "@/components/layout/header";
import { PageLayout } from "@/components/layout/page-layout";
import { docsSource } from "@/modules/docs/lib/source";

export default function WithHeaderLayout({
  children,
  pageHeader,
}: {
  children: ReactNode;
  pageHeader: ReactNode;
}) {
  return (
    <PageLayout>
      <div className="relative">
        <Header
          items={docsSource.pageTree.children}
          visibleItems={["menu", "search", "github"]}
          className="max-md:hidden h-12"
        />
        {pageHeader}
      </div>
      <main className="pb-12">{children}</main>
    </PageLayout>
  );
}
