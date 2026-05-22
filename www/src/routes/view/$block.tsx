import { createFileRoute, notFound } from "@tanstack/react-router";

import { BlockViewer } from "@/modules/blocks/block-viewer";
import { Index } from "@/registry/blocks";

export const Route = createFileRoute("/view/$block")({
	component: BlockViewPage,
	loader: ({ params }) => {
		if (!Index[params.block]) {
			throw notFound();
		}
		return { block: params.block };
	},
});

function BlockViewPage() {
	const { block } = Route.useLoaderData();

	return <BlockViewer name={block} />;
}
