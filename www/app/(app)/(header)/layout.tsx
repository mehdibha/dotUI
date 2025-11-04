import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { docsSource } from "@/modules/docs/lib/source";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header
        items={docsSource.pageTree.children}
        visibleItems={[
          "menu",
          "search",
          "github",
        ]}
        className="max-lg:hidden h-13"
      />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
