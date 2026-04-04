import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/config/site";

const links = [
	{
		label: "Product",
		links: [
			{ label: "Docs", href: "/docs/installation" },
			{ label: "Components", href: "/docs/components" },
			{ label: "Styles", href: "/styles" },
		],
	},
	{
		label: "Community",
		links: [
			{ label: "GitHub", href: siteConfig.links.github },
			{ label: "Discord", href: siteConfig.links.discord },
		],
	},
	{
		label: "Support",
		links: [
			{ label: "Open an issue", href: `${siteConfig.links.github}/issues/new` },
			{ label: "Request a feature", href: `${siteConfig.links.github}/discussions/new?category=ideas` },
			{ label: "Request an element", href: `${siteConfig.links.github}/discussions/new?category=requests` },
		],
	},
	{
		label: "Legal",
		links: [
			{ label: "Privacy Policy", href: "/privacy-policy" },
			{ label: "Terms of Service", href: "/terms-of-service" },
		],
	},
] as const;

export function Footer() {
	return (
		<div className="container flex items-center justify-center py-10">
			<p className="text-fg-muted text-sm">
				Built with passion by{" "}
				<a
					href="https://x.com/mehdibha"
					target="_blank"
					rel="noopener noreferrer"
					className="underline underline-offset-4"
				>
					@mehdibha
				</a>
				.
			</p>
		</div>
	);
}
