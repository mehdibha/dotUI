import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { findNeighbour } from "fumadocs-core/page-tree";

import browserCollections from "@/.source/browser";
import { siteConfig } from "@/config/site";
import { docsSource } from "@/lib/source";
import { truncateOnWord } from "@/lib/text";
import { DocsCopyPage } from "@/modules/docs/docs-copy-page";
import { DocsPager } from "@/modules/docs/docs-pager";
import { PageLastUpdate } from "@/modules/docs/last-update";
import { mdxComponents } from "@/modules/docs/mdx-components";
import { PageHeaderDescription, PageHeaderHeading, PageLayout } from "@/modules/docs/page-layout";
import { TOC, TOCProvider } from "@/modules/docs/toc";
import { ExternalLinkIcon } from "@/registry/__generated__/icons";
import { AdobeIcon } from "@/registry/components/icons/adobe";
import { GitHubIcon } from "@/registry/components/icons/github";
import { ShadcnIcon } from "@/registry/components/icons/shadcn";
import { LinkButton } from "@/registry/ui/button";

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
		};
	},
});

const serverLoader = createServerFn({ method: "GET" })
	.middleware([staticFunctionMiddleware])
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
		const rawContent = await page.data.getText("processed");

		return {
			path: page.path,
			url: page.url,
			title: page.data.title,
			description: page.data.description,
			pageTree: await docsSource.serializePageTree(pageTree),
			rawContent,
			neighbours: {
				previous: previous ? { name: String(previous.name), path: previous.url.replace(/^\/docs\/?/, "") } : undefined,
				next: next ? { name: String(next.name), path: next.url.replace(/^\/docs\/?/, "") } : undefined,
			},
		};
	});

type SerializedNeighbours = {
	previous?: { name: string; path: string };
	next?: { name: string; path: string };
};

const clientLoader = browserCollections.docs.createClientLoader({
	component(
		{ toc, frontmatter, lastModified, default: MDX },
		{ url, rawContent, neighbours }: { url: string; rawContent: string; neighbours: SerializedNeighbours },
	) {
		const hasToc = toc?.length;

		return (
			<TOCProvider toc={toc}>
				<PageLayout className="mt-4 flex scroll-mt-24 items-stretch pb-8 text-[1.05rem] sm:text-[15px] xl:w-full">
					<div className="mx-auto flex w-full min-w-0 max-w-3xl flex-1 flex-col gap-6 px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300">
						<div data-page-header="" className="relative space-y-3 pb-4 mb-2">
							<div className="flex items-start justify-between">
								<div className="flex flex-col gap-2">
									<PageHeaderHeading className="xl:leading-none">{frontmatter.title}</PageHeaderHeading>
									<PageHeaderDescription>{frontmatter.description}</PageHeaderDescription>
								</div>
								<div className="flex items-center gap-2">
									<DocsPager neighbours={neighbours} />
									<DocsCopyPage content={rawContent} url={url} />
								</div>
							</div>
							{/* {frontmatter.links?.length && (
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
										);
									})}
								</div>
							)} */}
							<div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-[color-mix(in_oklab,var(--color-border)_50%,transparent)] via-[color-mix(in_oklab,var(--color-border)_80%,transparent)] to-[color-mix(in_oklab,var(--color-border)_50%,transparent)]" />
						</div>
						<div>
							<MDX components={mdxComponents} />
						</div>
						<div className="min-w-0">{lastModified && <PageLastUpdate date={lastModified} className="mt-12" />}</div>
					</div>
					<div className="sticky top-[calc(var(--header-height)+14px)] z-30 hidden h-[90svh] w-(--sidebar-width) flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
						{hasToc && <TOC className="pr-12" />}
					</div>
				</PageLayout>
			</TOCProvider>
		);
	},
});

function DocsPage() {
	const data = Route.useLoaderData();
	const Content = clientLoader.getComponent(data.path);

	return <Content url={data.url} rawContent={data.rawContent} neighbours={data.neighbours} />;
}

const getIcon = (url: string) => {
	if (url.includes("adobe")) return <AdobeIcon />;
	if (url.includes("github")) return <GitHubIcon />;
	if (url.includes("shadcn")) return <ShadcnIcon />;
	return null;
};
