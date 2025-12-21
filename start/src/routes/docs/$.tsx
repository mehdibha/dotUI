import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { AdobeIcon } from "@dotui/registry/components/icons/adobe";
import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { ShadcnIcon } from "@dotui/registry/components/icons/shadcn";
import { ExternalLinkIcon } from "@dotui/registry/icons";
import { cn } from "@dotui/registry/lib/utils";
import { LinkButton } from "@dotui/registry/ui/button";

import browserCollections from "@/.source/browser";
import { docsSource } from "@/lib/source";
import { DocsCopyPage } from "@/modules/docs/docs-copy-page";
import { PageHeaderDescription, PageHeaderHeading, PageLayout } from "@/modules/docs/layout";
import { mdxComponents } from "@/modules/docs/mdx-components";
import { TOC, TOCProvider } from "@/modules/docs/toc";

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

		const rawContent = await page.data.getText("raw");

		return {
			path: page.path,
			url: page.url,
			title: page.data.title,
			description: page.data.description,
			pageTree: await docsSource.serializePageTree(docsSource.getPageTree()),
			rawContent,
		};
	});

const clientLoader = browserCollections.docs.createClientLoader({
	component({ toc, frontmatter, default: MDX }, { url, rawContent }: { url: string; rawContent: string }) {
		const hasToc = toc?.length;

		return (
			<TOCProvider toc={toc}>
				<PageLayout className="container max-w-3xl pt-6 has-data-page-tabs:*:data-page-header:border-b-0 md:pt-10 lg:pt-20 xl:max-w-5xl">
					<div data-page-header="" className="space-y-3 border-b pb-8">
						<div className="flex items-center justify-between">
							<PageHeaderHeading className="xl:leading-none">{frontmatter.title}</PageHeaderHeading>
							<div className="flex items-center gap-2">
								<DocsCopyPage content={rawContent} url={url} />
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
									);
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
						<div>
							<MDX components={mdxComponents} />
						</div>
						{hasToc && <TOC data-outer-toc="" />}
					</div>
				</PageLayout>
			</TOCProvider>
		);
	},
});

function DocsPage() {
	const data = Route.useLoaderData();
	const Content = clientLoader.getComponent(data.path);

	return <Content url={data.url} rawContent={data.rawContent} />;
}

const getIcon = (url: string) => {
	if (url.includes("adobe")) return <AdobeIcon />;
	if (url.includes("github")) return <GitHubIcon />;
	if (url.includes("shadcn")) return <ShadcnIcon />;
	return null;
};
