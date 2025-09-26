import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { docsSource } from "@/modules/docs/lib/source";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header items={docsSource.pageTree.children} />
      <div className="mx-auto min-h-screen sm:grid sm:grid-cols-[20px_1fr_20px] md:grid-cols-[30px_1fr_30px]">
        <div className="diagonal-pattern hidden sm:block" />
        <div>
          <div className="min-h-[70vh]">{children}</div>
          <Footer />
        </div>
        <div className="diagonal-pattern hidden sm:block" />
      </div>
    </div>
  );
}
