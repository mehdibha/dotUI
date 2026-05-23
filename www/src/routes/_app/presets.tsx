import { createFileRoute } from "@tanstack/react-router";

import { siteConfig } from "@/config/site";
import { PageHeader, PageHeaderDescription, PageHeaderHeading, PageLayout } from "@/modules/docs/page-layout";

const title = "Design System Presets";
const description = "Explore curated visual foundations and choose a starting point for your brand.";

const presets = [
	{
		name: "Minimal Editorial",
		description: "High contrast typography, generous spacing, and understated surfaces.",
		chips: ["Type-forward", "Neutral palette", "Content-heavy"],
		swatches: ["#111827", "#6B7280", "#F9FAFB", "#E5E7EB"],
	},
	{
		name: "Vibrant SaaS",
		description: "Confident accent colors, sharp UI states, and dashboard-ready density.",
		chips: ["Product-led", "Bold accents", "Data-dense"],
		swatches: ["#4338CA", "#0EA5E9", "#10B981", "#F8FAFC"],
	},
	{
		name: "Warm Commerce",
		description: "Soft tones and rounded UI primitives optimized for conversion flows.",
		chips: ["Friendly", "Rounded", "Conversion-first"],
		swatches: ["#7C2D12", "#EA580C", "#FDBA74", "#FFF7ED"],
	},
];

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
			<div className="container grid gap-4 pb-12 md:grid-cols-2 xl:grid-cols-3">
				{presets.map((preset) => (
					<section key={preset.name} className="rounded-xl border border-border/70 bg-bg-elevated p-5">
						<div className="space-y-3">
							<div>
								<h2 className="font-medium text-lg">{preset.name}</h2>
								<p className="mt-1 text-fg-muted text-sm">{preset.description}</p>
							</div>
							<div className="flex gap-2">
								{preset.swatches.map((swatch) => (
									<span
										key={swatch}
										className="size-8 rounded-md border border-black/10"
										style={{ backgroundColor: swatch }}
									/>
								))}
							</div>
							<ul className="flex flex-wrap gap-2">
								{preset.chips.map((chip) => (
									<li key={chip} className="rounded-full border border-border px-2.5 py-1 text-xs text-fg-muted">
										{chip}
									</li>
								))}
							</ul>
						</div>
					</section>
				))}
			</div>
		</PageLayout>
	);
}
