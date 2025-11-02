import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { docsSource } from "@/modules/docs/lib/source";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header items={docsSource.pageTree.children} />
      <div className="mx-auto min-h-screen lg:grid lg:grid-cols-[30px_1fr_30px]">
        <div className="z-20 hidden diagonal-pattern lg:block" />
        <div>
          <div className="min-h-[70vh]">{children}</div>
          <Footer />
        </div>
        <div className="bg-bg">
          <div className="z-20 hidden diagonal-pattern lg:block" />
        </div>
      </div>
    </div>
  );
}
