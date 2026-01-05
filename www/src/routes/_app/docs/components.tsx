import { createFileRoute } from "@tanstack/react-router";

import { siteConfig } from "@/config/site";
import { componentsData, tocData } from "@/modules/docs/components-list/components-data";
import { ComponentsList } from "@/modules/docs/components-list/components-list";
import { PageHeader, PageHeaderDescription, PageHeaderHeading, PageLayout } from "@/modules/docs/page-layout";
import { TOC, TOCProvider } from "@/modules/docs/toc";

const title = "Components";
const description = "Browse all available components in the library.";

export const Route = createFileRoute("/_app/docs/components")({
	component: ComponentsPage,
	headers: () => ({
		"Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
	}),
	head: () => {
		const ogImageUrl = `${siteConfig.url}/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

		return {
			meta: [
				{ title: `${title} - ${siteConfig.name}` },
				{ name: "description", content: description },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:type", content: "article" },
				{ property: "og:url", content: `${siteConfig.url}/docs/components` },
				{ property: "og:image", content: ogImageUrl },
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: description },
				{ name: "twitter:image", content: ogImageUrl },
				{ name: "twitter:creator", content: siteConfig.twitter.creator },
			],
		};
	},
});

function ComponentsPage() {
	return (
		<TOCProvider toc={tocData}>
			<PageLayout>
				<PageHeader>
					<PageHeaderHeading>{title}</PageHeaderHeading>
					<PageHeaderDescription>{description}</PageHeaderDescription>
				</PageHeader>
				<div className="container relative xl:grid xl:grid-cols-[1fr_150px] xl:gap-12">
					<ComponentsList data={componentsData} />
					<TOC />
				</div>
			</PageLayout>
		</TOCProvider>
	);
}
