import { Preview } from "@/components/preview";
import { buildTimeCaller } from "@/lib/trpc/server";
import StylePageForm from "@/modules/styles/components/style-page-form";
import { StylePageHeader } from "@/modules/styles/components/style-page-header";
import { StylePageNav } from "@/modules/styles/components/style-page-nav";
import { Providers } from "./providers";

export const generateStaticParams = async () => {
  const styles = await buildTimeCaller.style.all({
    isFeatured: true,
  });
  return styles.map((style) => ({
    style: style.slug,
  }));
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="relative grid grid-cols-[1fr_auto] max-xl:grid-cols-1 [&_[data-slot='label']]:text-sm [&_[data-slot='label']]:font-medium [&_[data-slot='label']]:text-fg-muted">
        <div className="container max-w-5xl py-10">
          <StylePageForm>
            <StylePageHeader />
            <StylePageNav className="mt-2">{children}</StylePageNav>
          </StylePageForm>
        </div>
        <div className="sticky top-0 flex h-[100svh] items-start max-xl:hidden">
          <Preview />
        </div>
      </div>
    </Providers>
  );
}
