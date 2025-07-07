import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

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
      <div className="relative grid grid-cols-[1fr_auto] max-xl:grid-cols-1">
        <div className="container max-w-5xl py-10">
          <Link
            href="/styles"
            className="text-sm text-fg-muted hover:text-fg flex items-center gap-1"
          >
            <ArrowLeftIcon className="size-4" /> styles
          </Link>
          <h1 className="mt-1 text-2xl font-bold">{style.name}</h1>
          {/* <p className="text-sm text-gray-500">{style.description}</p> */}
          <StyleNav className="mt-6">{children}</StyleNav>
        </div>
        <div className="sticky top-0 flex h-[100svh] items-start max-xl:hidden">
          <Preview />
        </div>
      </div>
    </PreviewProvider>
  );
}
