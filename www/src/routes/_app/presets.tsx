import { createFileRoute } from "@tanstack/react-router";

import { siteConfig } from "@/config/site";
import { PageHeader, PageHeaderDescription, PageHeaderHeading, PageLayout } from "@/modules/docs/page-layout";
import { PresetsGallery } from "@/modules/presets/presets-gallery";

const title = "Presets";
const description = "Explore curated design system presets. Pick one to open it in the customizer and make it yours.";

export const Route = createFileRoute("/_app/presets")({
	component: PresetsPage,
	head: () => {
		const ogImageUrl = `${siteConfig.url}/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`;

		return {
			meta: [
				{ title: `${title} - ${siteConfig.name}` },
				{ name: "description", content: description },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:type", content: "article" },
				{ property: "og:url", content: `${siteConfig.url}/presets` },
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

function PresetsPage() {
	return (
		<PageLayout>
			<PageHeader>
				<PageHeaderHeading>{title}</PageHeaderHeading>
				<PageHeaderDescription>{description}</PageHeaderDescription>
			</PageHeader>
			<div className="container pb-16">
				<PresetsGallery />
			</div>
		</PageLayout>
	);
}
