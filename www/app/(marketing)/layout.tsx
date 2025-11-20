import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { docsSource } from "@/modules/docs/source";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="[--header-height:calc(var(--spacing)*14)]">
      <Header items={docsSource.pageTree.children} searchKeyboardShortcut />
      <div className="min-h-[calc(100vh-var(--header-height))]">{children}</div>
      <Footer />
    </div>
  );
}
