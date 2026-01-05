import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import browserCollections from "@/.source/browser";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { siteConfig } from "@/config/site";
import { legalSource } from "@/lib/source";
import { mdxComponents } from "@/modules/docs/mdx-components";
import { PageHeaderDescription, PageHeaderHeading, PageLayout } from "@/modules/docs/page-layout";

export const Route = createFileRoute("/(legal)/$")({
	component: LegalPage,
	headers: () => ({
		"Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
	}),
	loader: async ({ params }) => {
		const slugs = params._splat?.split("/") ?? [];
		const data = await serverLoader({ data: slugs });
		await clientLoader.preload(data.path);
		return data;
	},
	head: ({ loaderData }) => {
		const title = loaderData?.title ?? "Legal";
		const description = loaderData?.description;
		const url = loaderData?.url ?? "/";

		return {
			meta: [
				{ title: `${title} - ${siteConfig.name}` },
				...(description ? [{ name: "description", content: description }] : []),
				{ property: "og:title", content: title },
				...(description ? [{ property: "og:description", content: description }] : []),
				{ property: "og:type", content: "article" },
				{ property: "og:url", content: `${siteConfig.url}${url}` },
			],
		};
	},
});

const serverLoader = createServerFn({ method: "GET" })
	.inputValidator((slugs: string[]) => slugs)
	.handler(async ({ data: slugs }) => {
		const page = legalSource.getPage(slugs);
		if (!page) throw notFound();

		return {
			path: page.path,
			url: page.url,
			title: page.data.title,
			description: page.data.description,
		};
	});

const clientLoader = browserCollections.legal.createClientLoader({
	component({ frontmatter, default: MDX }) {
		return (
			<div className="[--header-height:calc(var(--spacing)*12)]">
				<Header />
				<PageLayout className="container max-w-3xl py-10 md:py-16 lg:py-20">
					<div className="space-y-3 border-b pb-8">
						<PageHeaderHeading>{frontmatter.title}</PageHeaderHeading>
						{frontmatter.description && <PageHeaderDescription>{frontmatter.description}</PageHeaderDescription>}
					</div>
					<div className="mt-8">
						<MDX components={mdxComponents} />
					</div>
				</PageLayout>
				<Footer />
			</div>
		);
	},
});

function LegalPage() {
	const data = Route.useLoaderData();
	const Content = clientLoader.getComponent(data.path);

	return <Content />;
}
