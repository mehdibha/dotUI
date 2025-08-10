import { notFound } from "next/navigation";

import { registryBlocks } from "@dotui/registry-definition/registry-blocks";
import { BlockViewer } from "@dotui/ui/block-viewer";

import { buildTimeCaller, getQueryClient, trpc } from "@/lib/trpc/server";
import { BlockProviders } from "./providers";

// export const generateStaticParams = async () => {
// const styles = await buildTimeCaller.style.featured({});
// return styles.flatMap((style) =>
//   registryBlocks.map((block) => ({
//     styleId: style.id,
//     name: block.name,
//   })),
// );
// };

export default async function BlockViewPage({
  params,
}: {
  params: Promise<{ username: string; styleName: string; blockName: string }>;
}) {
  const { username, styleName, blockName } = await params;

  const queryClient = getQueryClient();
  const style = await queryClient.fetchQuery(
    trpc.style.getByNameAndUsername.queryOptions({
      username,
      name: styleName,
    }),
  );

  if (!style) {
    notFound();
  }

  return (
    <BlockProviders style={style}>
      <BlockViewer name={blockName} />
    </BlockProviders>
  );
}
