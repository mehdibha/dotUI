import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import browserCollections from "@/.source/browser";

import { docsSource } from "@/lib/source";

export const Route = createFileRoute("/docs/$")({
	component: DocsPage,
	loader: async ({ params }) => {
		const slugs = params._splat?.split("/") ?? [];
		const data = await serverLoader({ data: slugs });
		await clientLoader.preload(data.path);
		return data;
	},
});

const serverLoader = createServerFn({ method: "GET" })
	.inputValidator((slugs: string[]) => slugs)
	.handler(async ({ data: slugs }) => {
		const page = docsSource.getPage(slugs);
		if (!page) throw notFound();

		return {
			path: page.path,
			title: page.data.title,
			description: page.data.description,
			pageTree: await docsSource.serializePageTree(docsSource.getPageTree()),
		};
	});

const clientLoader = browserCollections.docs.createClientLoader({
	component({ toc, frontmatter, default: MDX }) {
		return (
			<article className="prose dark:prose-invert max-w-none">
				<h1>{frontmatter.title}</h1>
				{frontmatter.description && <p className="lead">{frontmatter.description}</p>}
				<MDX />
			</article>
		);
	},
});

function DocsPage() {
	const data = Route.useLoaderData();
	const Content = clientLoader.getComponent(data.path);

	return (
		<div className="container py-10">
			<Content />
		</div>
	);
}
