import { Preview } from "@/components/preview";
import {
  buildTimeCaller,
  HydrateClient,
  prefetch,
  trpc,
} from "@/lib/trpc/server";
import { StylePageHeader } from "@/modules/styles/components/style-page-header";
import { StylePageNav } from "@/modules/styles/components/style-page-nav";
import StylePageForm from "@/modules/styles/providers/style-pages-provider";
import { Providers } from "./providers";

export const generateStaticParams = async () => {
  const styles = await buildTimeCaller.style.getFeatured({});
  return styles.map((style) => ({
    username: style.user.username,
    styleName: style.name,
  }));
};

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ username: string; styleName: string }>;
  children: React.ReactNode;
}) {
  const { username, styleName } = await params;

  prefetch(
    trpc.style.getByNameAndUsername.queryOptions({
      name: styleName,
      username,
    }),
  );

  return (
    <HydrateClient>
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
    </HydrateClient>
  );
}
