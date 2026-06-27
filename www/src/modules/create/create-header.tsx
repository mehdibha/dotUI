/**
 * The builder's own top bar, shown on /create in place of the site nav.
 *
 * It stays visually continuous with the site Header — same height
 * (--header-height), sticky positioning, blur-on-scroll, the Logo (linking home
 * so users can exit the builder), GitHub, and the ThemeToggle — but trades the
 * marketing nav and "Search docs" for the builder's genuinely-primary controls:
 * randomize / reset the whole design system on the left, and the export actions
 * (copy install command, Open in v0) on the right. Secondary, per-section
 * controls stay in the customizer panel.
 */

import { useEffect, useMemo, useState } from "react";

import { getRouteApi } from "@tanstack/react-router";

import { CheckIcon, CopyIcon, RotateCcwIcon, ShuffleIcon } from "lucide-react";

import { GitHubIcon } from "@/components/icons/github";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/config/site";
import { cn } from "@/registry/lib/utils";
import { Button, buttonStyles } from "@/registry/ui/button";
import { Separator } from "@/registry/ui/separator";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

import { useDesignSystem } from "./preset";
import { encodePreset } from "./preset/codec";
import { randomizeColors } from "./randomize";

const routeApi = getRouteApi("/_app/create");

const DEFAULT_REGISTRY_HOST = "https://dotui.com";

function getRegistryHost(): string {
	if (typeof window === "undefined") return DEFAULT_REGISTRY_HOST;
	// Honour the deployed origin so local dev shows the command pointing back at
	// itself; localhost / file origins can't be fetched by the CLI or v0.
	const { origin } = window.location;
	if (origin === "null" || origin === "http://localhost" || origin.startsWith("file:")) {
		return DEFAULT_REGISTRY_HOST;
	}
	return origin;
}

function useScrolled(threshold = 8) {
	const [scrolled, setScrolled] = useState(false);
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > threshold);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [threshold]);
	return scrolled;
}

function V0Logo() {
	return (
		<svg viewBox="0 0 40 20" fill="currentColor" aria-hidden className="h-3.5 w-auto">
			<path d="M23.94 9.06v6.51c0 .47.38.85.85.85h.94v3.08h-1.27a3.46 3.46 0 0 1-3.46-3.46c-1.05 1.2-2.6 1.96-4.32 1.96a5.74 5.74 0 1 1 5.74-5.74l-.01.05h.01v-3.2h1.57zm-7.26 9.07a2.66 2.66 0 1 0 0-5.32 2.66 2.66 0 0 0 0 5.32z" />
			<path
				d="M8.06 5.73 3.3 14.4h9.52L8.06 5.73zm0-4.6 8.06 14.7H0L8.06 1.13z"
				transform="translate(0 1.5) scale(.78)"
			/>
		</svg>
	);
}

export function CreateHeader() {
	const scrolled = useScrolled(8);
	const navigate = routeApi.useNavigate();
	const { designSystem, setDesignSystem } = useDesignSystem();

	const [host, setHost] = useState(DEFAULT_REGISTRY_HOST);
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		setHost(getRegistryHost());
	}, []);

	const encoded = useMemo(() => encodePreset(designSystem), [designSystem]);

	const installCommand = useMemo(() => {
		const url = encoded ? `${host}/r/init?preset=${encoded}` : `${host}/r/init`;
		return `npx shadcn init ${url}`;
	}, [encoded, host]);

	const v0Href = useMemo(() => {
		const itemUrl = encoded ? `${host}/r/showcase-bundle?preset=${encoded}` : `${host}/r/showcase-bundle`;
		return `https://v0.dev/chat/api/open?url=${encodeURIComponent(itemUrl)}`;
	}, [encoded, host]);

	function randomize() {
		setDesignSystem((prev) => ({ ...prev, color: randomizeColors(prev.color) }));
	}

	// Clear the preset, the nav stack, and the previewed component — otherwise a
	// previously selected component stays pointed at, desyncing the toolbar.
	function reset() {
		navigate({ search: (prev) => ({ ...prev, preset: undefined, panel: undefined, preview: undefined }) });
	}

	async function copyInstall() {
		try {
			await navigator.clipboard.writeText(installCommand);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		} catch {
			/* no-op on clipboard failure */
		}
	}

	return (
		<header
			data-scrolled={scrolled || undefined}
			className="group/header sticky top-0 z-30 flex h-(--header-height) w-full items-center justify-between gap-2 px-6"
		>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[180%] opacity-0 transition-opacity duration-300 ease-out group-data-scrolled/header:opacity-100"
				style={{
					backdropFilter: "blur(12px)",
					WebkitBackdropFilter: "blur(12px)",
					backgroundColor: "color-mix(in oklab, var(--color-bg) 60%, transparent)",
					maskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
					WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
				}}
			/>

			{/* Left — exit back to the site, builder identity, global system actions */}
			<div className="flex items-center gap-3">
				<Logo />
				<Separator orientation="vertical" className="h-5 max-sm:hidden" />
				<span className="text-sm font-medium text-fg-muted max-sm:hidden">Builder</span>
				<div className="ml-1 flex items-center gap-0.5">
					<Tooltip>
						<Button size="sm" isIconOnly variant="quiet" onPress={randomize} aria-label="Randomize colors">
							<ShuffleIcon />
						</Button>
						<TooltipContent>Randomize colors</TooltipContent>
					</Tooltip>
					<Tooltip>
						<Button size="sm" isIconOnly variant="quiet" onPress={reset} aria-label="Reset to defaults">
							<RotateCcwIcon />
						</Button>
						<TooltipContent>Reset to defaults</TooltipContent>
					</Tooltip>
				</div>
			</div>

			{/* Right — export actions + site continuity */}
			<div className="flex items-center gap-2">
				<Tooltip>
					<Button size="sm" variant="default" onPress={copyInstall} className="max-sm:size-8 max-sm:px-0">
						{copied ? <CheckIcon data-icon-start="" /> : <CopyIcon data-icon-start="" />}
						<span className="max-sm:hidden">{copied ? "Copied" : "Install"}</span>
					</Button>
					<TooltipContent>Copy the shadcn install command</TooltipContent>
				</Tooltip>
				<a
					href={v0Href}
					target="_blank"
					rel="noopener noreferrer"
					className={buttonStyles({ variant: "primary", size: "sm" })}
				>
					<span className="max-sm:hidden">Open in</span>
					<V0Logo />
				</a>
				<Separator orientation="vertical" className="h-5 max-sm:hidden" />
				<a
					aria-label="GitHub"
					href={siteConfig.links.github}
					target="_blank"
					rel="noopener noreferrer"
					data-icon-only=""
					className={cn(buttonStyles({ variant: "quiet", size: "sm" }), "max-sm:hidden")}
				>
					<GitHubIcon />
				</a>
				<ThemeToggle isIconOnly size="sm" variant="quiet" />
			</div>
		</header>
	);
}
