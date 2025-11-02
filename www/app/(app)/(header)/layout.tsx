import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { docsSource } from "@/modules/docs/lib/source";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header
        items={docsSource.pageTree.children}
        hideLogo
        className="max-lg:hidden"
        containerClassName="h-13"
      />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
