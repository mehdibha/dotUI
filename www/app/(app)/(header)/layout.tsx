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
      <div className="has-[.full-page-sticky]:contents">
        <Header
          items={docsSource.pageTree.children}
          visibleItems={["menu", "search", "github"]}
          className="h-12 max-md:hidden"
        />
        {pageHeader}
      </div>
      <main>{children}</main>
    </PageLayout>
  );
}
