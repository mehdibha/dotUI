import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { findNeighbour } from "fumadocs-core/page-tree";

import { AdobeIcon } from "@dotui/registry/components/icons/adobe";
import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { ShadcnIcon } from "@dotui/registry/components/icons/shadcn";
import { ExternalLinkIcon } from "@dotui/registry/icons";
import { cn } from "@dotui/registry/lib/utils";
import { LinkButton } from "@dotui/registry/ui/button";

import browserCollections from "@/.source/browser";
import { siteConfig } from "@/config/site";
import { docsSource } from "@/lib/source";
import { truncateOnWord } from "@/lib/text";
// import { DocsCopyPage } from "@/modules/docs/docs-copy-page"; // Disabled: getText("raw") doesn't work in production build
import { DocsPager } from "@/modules/docs/docs-pager";
import { PageLastUpdate } from "@/modules/docs/last-update";
import { PageHeaderDescription, PageHeaderHeading, PageLayout } from "@/modules/docs/page-layout";
import { mdxComponents } from "@/modules/docs/mdx-components";
import { TOC, TOCProvider } from "@/modules/docs/toc";

export const Route = createFileRoute("/_app/docs/$")({
	component: DocsPage,
	loader: async ({ params }) => {
		const slugs = params._splat?.split("/") ?? [];
		const data = await serverLoader({ data: slugs });
		await clientLoader.preload(data.path);
		return data;
	},
	head: ({ loaderData }) => {
		const title = loaderData?.title ?? "Docs";
		const description = loaderData?.description;
		const truncatedDescription = description ? truncateOnWord(description, 148, true) : undefined;
		const url = loaderData?.url ?? "/docs";
		const ogImageUrl = `${siteConfig.url}/og?title=${encodeURIComponent(title)}${truncatedDescription ? `&description=${encodeURIComponent(truncatedDescription)}` : ""}`;

		return {
			meta: [
				{ title: `${title} - ${siteConfig.name}` },
				...(description ? [{ name: "description", content: description }] : []),
				{ property: "og:title", content: title },
				...(truncatedDescription ? [{ property: "og:description", content: truncatedDescription }] : []),
				{ property: "og:type", content: "article" },
				{ property: "og:url", content: `${siteConfig.url}${url}` },
				{ property: "og:image", content: ogImageUrl },
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: title },
				...(truncatedDescription ? [{ name: "twitter:description", content: truncatedDescription }] : []),
				{ name: "twitter:image", content: ogImageUrl },
				{ name: "twitter:creator", content: siteConfig.twitter.creator },
			],
		}
	},
});

const serverLoader = createServerFn({ method: "GET" })
	.inputValidator((slugs: string[]) => slugs)
	.handler(async ({ data: slugs }) => {
		// Try to get the page, fallback to index for empty slugs
		let page = docsSource.getPage(slugs);
		if (!page && slugs.length === 0) {
			page = docsSource.getPage(["index"]);
		}
		if (!page) throw notFound();

		const pageTree = docsSource.getPageTree();
		const { previous, next } = findNeighbour(pageTree, page.url);

		return {
			path: page.path,
			url: page.url,
			title: page.data.title,
			description: page.data.description,
			pageTree: await docsSource.serializePageTree(pageTree),
			neighbours: {
				previous: previous ? { name: String(previous.name), path: previous.url.replace(/^\/docs\/?/, "") } : undefined,
				next: next ? { name: String(next.name), path: next.url.replace(/^\/docs\/?/, "") } : undefined,
			},
		};
	})

type SerializedNeighbours = {
	previous?: { name: string; path: string };
	next?: { name: string; path: string };
};

const clientLoader = browserCollections.docs.createClientLoader({
	component(
		{ toc, frontmatter, lastModified, default: MDX },
		{ url, neighbours }: { url: string; neighbours: SerializedNeighbours },
	) {
		const hasToc = toc?.length;

		return (
			<TOCProvider toc={toc}>
				<PageLayout className="container max-w-3xl pt-6 has-data-page-tabs:*:data-page-header:border-b-0 md:pt-10 lg:pt-20 xl:max-w-5xl">
					<div data-page-header="" className="space-y-3 border-b pb-8">
						<div className="flex items-center justify-between">
							<PageHeaderHeading className="xl:leading-none">{frontmatter.title}</PageHeaderHeading>
							<div className="flex items-center gap-2">
								<DocsPager neighbours={neighbours} />
							</div>
						</div>
						<PageHeaderDescription className="text-wrap">{frontmatter.description}</PageHeaderDescription>
						{frontmatter.links?.length && (
							<div className="mt-2 flex items-center gap-2">
								{frontmatter.links.map((link) => {
									const icon = getIcon(link.href);
									return (
										<LinkButton
											key={link.href}
											href={link.href}
											target="_blank"
											size="sm"
											className="h-6 font-semibold text-fg-muted text-xs hover:text-fg [&_svg]:size-3"
										>
											{icon}
											{link.label}
											<ExternalLinkIcon />
										</LinkButton>
									)
								})}
							</div>
						)}
					</div>
					<div
						className={cn(
							"not-has-data-page-tabs:mt-12 has-data-page-tabs:**:data-outer-toc:hidden",
							hasToc &&
								"not-has-data-page-tabs:xl:grid not-has-data-page-tabs:xl:grid-cols-[1fr_180px] not-has-data-page-tabs:xl:gap-10",
						)}
					>
						<div className="min-w-0">
							<MDX components={mdxComponents} />
							{lastModified && <PageLastUpdate date={lastModified} className="mt-12" />}
						</div>
						{hasToc && <TOC data-outer-toc="" />}
					</div>
				</PageLayout>
			</TOCProvider>
		)
	},
});

function DocsPage() {
	const data = Route.useLoaderData();
	const Content = clientLoader.getComponent(data.path);

	return <Content url={data.url} neighbours={data.neighbours} />;
}

const getIcon = (url: string) => {
	if (url.includes("adobe")) return <AdobeIcon />;
	if (url.includes("github")) return <GitHubIcon />;
	if (url.includes("shadcn")) return <ShadcnIcon />;
	return null;
};
