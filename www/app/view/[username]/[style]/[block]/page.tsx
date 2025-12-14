import { notFound } from "next/navigation";

import { registryBlocks } from "@dotui/registry/blocks/registry";

import { buildTimeCaller, getQueryClient, trpc } from "@/lib/trpc/server";
import { BlockViewer } from "@/modules/blocks/block-viewer";

import { BlockViewLayout } from "./_layout";

export const generateStaticParams = async () => {
	const styles = await buildTimeCaller.style.getPublicStyles({
		featured: true,
	});

	return styles.flatMap((style) =>
		registryBlocks.map((block) => ({
			username: style.user.username,
			style: style.name,
			block: block.name,
		})),
	);
};

export default async function BlockViewPage({ params }: PageProps<"/view/[username]/[style]/[block]">) {
	const { username, style: styleName, block: blockName } = await params;

	const queryClient = getQueryClient();
	const style = await queryClient.fetchQuery(
		trpc.style.getBySlug.queryOptions({
			slug: `${username}/${styleName}`,
		}),
	);

	if (!style) {
		notFound();
	}

	return (
		<BlockViewLayout style={style} styleSlug={`${username}/${styleName}`}>
			<BlockViewer name={blockName} />
		</BlockViewLayout>
	);
}
