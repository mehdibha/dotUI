import { notFound } from "next/navigation";

import { registryBlocks } from "@dotui/registry-definition/registry-blocks";
import { BlockViewer } from "@dotui/ui/block-viewer";

import { buildTimeCaller, getQueryClient, trpc } from "@/trpc/server";
import { StyleProvider } from "./style-provider";

export const generateStaticParams = async () => {
  const styles = await buildTimeCaller.style.all({
    isFeatured: true,
  });
  return styles.flatMap((style) =>
    registryBlocks.map((block) => ({
      style: style.slug,
      name: block.name,
    })),
  );
};

export default async function BlockViewPage({
  params,
}: {
  params: Promise<{ style: string; name: string }>;
}) {
  const { style: styleSlug, name } = await params;

  const queryClient = getQueryClient();
  const style = await queryClient.fetchQuery(
    trpc.style.bySlug.queryOptions({ slug: styleSlug }),
  );

  if (!style) {
    notFound();
  }

  return (
    <StyleProvider style={style}>
      <BlockViewer name={name} />
    </StyleProvider>
  );
}
