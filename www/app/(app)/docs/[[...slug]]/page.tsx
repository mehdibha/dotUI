import { notFound } from "next/navigation";
import { findNeighbour } from "fumadocs-core/page-tree";
import { AlignLeftIcon, ExternalLinkIcon } from "lucide-react";
import type { Metadata, Route } from "next";

import { AdobeIcon } from "@dotui/registry/components/icons/adobe";
import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { ShadcnIcon } from "@dotui/registry/components/icons/shadcn";
import { cn } from "@dotui/registry/lib/utils";
import { LinkButton } from "@dotui/registry/ui/button";

import { PageHeaderDescription, PageHeaderHeading, PageLayout } from "@/components/layout/page-layout";
import { siteConfig } from "@/config/site";
import { truncateOnWord } from "@/lib/text";
import { DocsCopyPage } from "@/modules/docs/docs-copy-page";
import { DocsPager } from "@/modules/docs/docs-pager";
import { PageLastUpdate } from "@/modules/docs/last-update";
import { mdxComponents } from "@/modules/docs/mdx-components";
import { PageTabsProvider } from "@/modules/docs/page-tabs";
import { docsSource } from "@/modules/docs/source";
import { TOCItems, TOCProvider, TOCScrollArea } from "@/modules/docs/toc";

export const revalidate = false;
export const dynamic = "force-static";
export const dynamicParams = false;

export default async function Page({ params }: PageProps<"/docs/[[...slug]]">) {
	const slugArray = (await params).slug ?? [];

	// Check if last segment is "examples"
	const isExamplesRoute = slugArray[slugArray.length - 1] === "examples";
	const actualSlug = isExamplesRoute ? slugArray.slice(0, -1) : slugArray;

	const page = docsSource.getPage(actualSlug);
	if (!page) notFound();

	const { body: MDXContent, toc, lastModified } = await page.data.load();

	const rawContent = await page.data.getText("raw");

	// Check if page has examples (has PageTabs with examples panel)
	const hasExamples = rawContent.includes('<PageTabPanel id="examples">');

	// If trying to access /examples on a page without examples, 404
	if (isExamplesRoute && !hasExamples) notFound();

	const neighbours = findNeighbour(docsSource.pageTree, page.url);

	const hasToc = toc && toc.length > 0;
	const defaultTab = isExamplesRoute ? "examples" : "overview";

	return (
		<TOCProvider toc={toc}>
			<PageTabsProvider defaultTab={defaultTab}>
				<PageLayout className="container max-w-3xl pt-6 has-data-page-tabs:*:data-page-header:border-b-0 md:pt-10 lg:pt-20 xl:max-w-5xl">
					<div data-page-header="" className="space-y-3 border-b pb-8">
						<div className="flex items-center justify-between">
							<PageHeaderHeading className="xl:leading-none">{page.data.title}</PageHeaderHeading>
							<div className="flex items-center gap-2">
								<DocsCopyPage page={rawContent} url={page.url} />
								<DocsPager neighbours={neighbours} />
							</div>
						</div>
						<PageHeaderDescription className="text-wrap">{page.data.description}</PageHeaderDescription>
						{page.data.links && page.data.links.length > 0 && (
							<div className="mt-2 flex items-center gap-2">
								{page.data.links.map((link, index) => {
									const icon = getIcon(link.href);
									return (
										<LinkButton
											key={index}
											href={link.href as Route}
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
							<MDXContent components={mdxComponents} />
						</div>
						{hasToc && (
							<div
								data-outer-toc=""
								className="sticky top-10 flex h-[calc(100svh-var(--header-height))] flex-col max-xl:hidden"
							>
								<h3 className="inline-flex items-center gap-1.5 text-fg-muted text-sm">
									<AlignLeftIcon className="size-4 text-fg-muted" />
									On this page
								</h3>
								<TOCScrollArea>
									<TOCItems />
								</TOCScrollArea>
							</div>
						)}
					</div>
					{lastModified && <PageLastUpdate date={lastModified} className="mt-12" />}
				</PageLayout>
			</PageTabsProvider>
		</TOCProvider>
	);
}

const getIcon = (url: string) => {
	if (url.includes("adobe")) return <AdobeIcon />;
	if (url.includes("github")) return <GitHubIcon />;
	if (url.includes("shadcn")) return <ShadcnIcon />;
	return null;
};

export async function generateMetadata({ params }: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
	const slugArray = (await params).slug ?? [];

	// Check if last segment is "examples"
	const isExamplesRoute = slugArray[slugArray.length - 1] === "examples";
	const actualSlug = isExamplesRoute ? slugArray.slice(0, -1) : slugArray;

	const page = docsSource.getPage(actualSlug);
	if (!page) notFound();

	const title = isExamplesRoute ? `${page.data.title} Examples` : page.data.title;
	const description = isExamplesRoute ? `Examples and code snippets for ${page.data.title}` : page.data.description;

	return {
		title,
		description,
		openGraph: {
			title,
			description: description ? truncateOnWord(description, 148, true) : undefined,
			type: "article",
			url: isExamplesRoute ? `${page.url}/examples` : page.url,
			images: [
				{
					url: `/og?title=${encodeURIComponent(
						title,
					)}${description ? `&description=${encodeURIComponent(description)}` : ""}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: description ? truncateOnWord(description, 148, true) : undefined,
			images: [
				{
					url: `/og?title=${encodeURIComponent(
						title,
					)}${description ? `&description=${encodeURIComponent(description)}` : ""}`,
				},
			],
			creator: siteConfig.twitter.creator,
		},
	};
}

export async function generateStaticParams() {
	const params = docsSource.generateParams();
	const result: { slug: string[] }[] = [];

	for (const param of params) {
		const slug = Array.isArray(param.slug) ? param.slug : [param.slug];
		result.push({ slug });

		// For component pages, check if they have examples and generate /examples route
		if (slug[0] === "components") {
			const page = docsSource.getPage(slug);
			if (page) {
				const rawContent = await page.data.getText("raw");
				const hasExamples = rawContent.includes('<PageTabPanel id="examples">');
				if (hasExamples) {
					result.push({ slug: [...slug, "examples"] });
				}
			}
		}
	}

	return result;
}
