import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { source } from "@/app/source";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // return children
  return (
    <div>
      <Header className="hidden md:block" />
      <MobileNav items={source.pageTree.children} className="md:hidden" />
      <div className="mx-auto min-h-screen max-w-screen-2xl sm:grid sm:grid-cols-[20px_1fr_20px] md:grid-cols-[30px_1fr_30px] lg:grid-cols-[50px_1fr_50px]">
        <div className="diagonal-pattern hidden sm:block" />
        <div className="">
          <div className="min-h-[70vh]">{children}</div>
          <Footer />
        </div>
        <div className="diagonal-pattern hidden sm:block" />
      </div>
    </div>
  );
}
