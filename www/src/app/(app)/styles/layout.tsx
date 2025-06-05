import { Preview, PreviewProvider } from "./preview";

export default function ThemesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PreviewProvider>
      <div className="relative flex">
        <div className="relative flex-1">
          <div className="">{children}</div>
        </div>
        <div className="sticky top-0 flex h-[100svh] items-start max-xl:hidden">
          <Preview />
        </div>
      </div>
    </PreviewProvider>
  );
}
