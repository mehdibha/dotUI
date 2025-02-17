import { Preview, PreviewProvider } from "./preview";
import { ThemeTableOfContents } from "./toc";

export default function ThemesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PreviewProvider>
      <div className="relative flex">
        <div className="relative flex-1">
          <div className="lg:container lg:max-w-4xl pt-10">{children}</div>
        </div>
        <div className="flex items-start h-[100svh] sticky top-0 max-xl:hidden">
          <ThemeTableOfContents />
          <Preview />
        </div>
      </div>
    </PreviewProvider>
  );
}
