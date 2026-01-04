import { createFileRoute, notFound } from "@tanstack/react-router";

import { Index } from "@dotui/registry/blocks";

import { BlockViewer } from "@/modules/blocks/block-viewer";

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
