import { createFileRoute, notFound } from "@tanstack/react-router";

import { blocksCategories, registryBlocks } from "@dotui/registry/blocks/registry";
import { TabPanel } from "@dotui/registry/ui/tabs";

import { BlockCard } from "@/modules/blocks/block-card";

export const Route = createFileRoute("/_app/blocks/{-$category}")({
	component: BlocksPage,
	headers: () => ({
		"Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
	}),
	loader: ({ params }) => {
		const { category: categoryPath } = params;

		const category = blocksCategories.find((category) => category.path === categoryPath);
		if (!category) throw notFound();

		const blocks = registryBlocks.filter((block) => block.categories?.includes(category.slug));
		return { blocks, category };
	},
});

function BlocksPage() {
	const { blocks, category } = Route.useLoaderData();

	return (
		<TabPanel id={category.slug} className="container mt-6 space-y-6">
			{blocks.map((block) => (
				<BlockCard key={block.name} block={block} />
			))}
		</TabPanel>
	);
}
