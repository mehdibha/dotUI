import { Header } from "@/components/layout/header";
import { docsSource } from "@/modules/docs/lib/source";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header
        items={docsSource.pageTree.children}
        visibleItems={["menu", "search", "github"]}
        className="max-md:hidden h-12"
      />
      <main>{children}</main>
    </div>
  );
}
