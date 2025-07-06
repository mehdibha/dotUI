import { notFound } from "next/navigation";

import { Preview, PreviewProvider } from "@/components/preview";
import { StyleNav } from "@/modules/styles/components/style-nav";
import { getQueryClient, trpc } from "@/trpc/server";

export default async function StylePage({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ style: string }>;
}) {
  const { style: styleSlug } = await params;

  const queryClient = getQueryClient();
  const style = await queryClient.fetchQuery(
    trpc.style.bySlug.queryOptions({ slug: styleSlug }),
  );

  if (!style) {
    notFound();
  }

  return (
    <PreviewProvider>
      <div className="relative flex">
        <div className="relative flex-1 min-w-0">
          <div className="pt-10">
            <div className="px-14">
              <h1 className="text-2xl font-bold">{style.name}</h1>
              <p className="text-sm text-gray-500">{style.description}</p>
            </div>
            <StyleNav className="mt-6">{children}</StyleNav>
          </div>
        </div>
        <div className="sticky top-0 flex h-[100svh] items-start max-xl:hidden">
          <Preview />
        </div>
      </div>
    </PreviewProvider>
  );
}
