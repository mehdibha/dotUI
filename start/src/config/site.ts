import type { ToOptions } from "@tanstack/react-router";

export const siteConfig = {
	url: "https://dotui.org",
	name: "dotUI",
	title: "dotUI",
	description: "Build your design system in seconds, so your app look like your brand, not a preset.",
	keywords: ["dotUI", "React", "Tailwind CSS", "React components", "React Aria", "Accessible components"],
	authors: [
		{
			name: "mehdibha",
			url: "https://www.mehdibha.com",
		},
	],
	creator: "mehdibha",
	thumbnail: "/images/thumbnail.png",
	twitter: {
		creator: "@mehdibha",
	},
	og: {
		title: "Ship unique.",
		description: "Build your design system in seconds, so your app look like your brand, not a preset.",
	},
	links: {
		github: "https://github.com/mehdibha/dotUI",
		twitter: "https://x.com/mehdibha",
		discord: "https://discord.gg/DXpj5V2fU8",
		creatorGithub: "https://github.com/mehdibha",
	},
} as const;

export const navItems: { name: string; href: ToOptions }[] = [
	{ name: "Docs", href: { to: "/docs/$", params: { _splat: "" } } },
	// { name: "Components", url: "/docs/components" },
	// { name: "Blocks", url: "/blocks" },
	// { name: "Styles", url: "/styles" },
] as const;
