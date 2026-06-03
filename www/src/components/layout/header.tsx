import { useEffect, useState } from "react";

import { Link as RouterLink } from "@tanstack/react-router";

import { SearchIcon } from "lucide-react";

import type * as PageTree from "fumadocs-core/page-tree";

import { GitHubIcon } from "@/components/icons/github";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchCommand } from "@/components/search-command";
import { ThemeToggle } from "@/components/theme-toggle";
import { navItems, siteConfig } from "@/config/site";
import { cn } from "@/registry/lib/utils";
import { Button, buttonStyles } from "@/registry/ui/button";
import { Kbd } from "@/registry/ui/kbd";

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

interface HeaderProps {
	className?: string;
	items?: PageTree.Node[];
}

export function Header({ className, items = [] }: HeaderProps) {
	const scrolled = useScrolled(8);

	return (
		<header
			data-scrolled={scrolled || undefined}
			className={cn(
				"group/header sticky top-0 z-30 flex h-(--header-height) w-full items-center justify-between px-6",
				className,
			)}
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
			<div className="flex items-center gap-3 md:gap-6">
				<MobileNav items={items} />
				<Logo className="max-md:hidden" />
				<nav className="flex items-center gap-3 text-sm max-md:hidden">
					{navItems.map((item) => (
						<RouterLink key={item.name} {...item.href} className="px-0.5 text-fg-muted transition-colors hover:text-fg">
							{item.name}
						</RouterLink>
					))}
				</nav>
			</div>
			<div className="flex items-center gap-2">
				<SearchCommand keyboardShortcut items={items}>
					<Button variant="default" className="max-md:size-8 max-md:px-0 md:text-fg-muted">
						<SearchIcon data-icon-start="" className="md:hidden" />
						<span className="mr-6 flex-1 max-md:hidden">Search docs...</span>
						<Kbd className="max-md:hidden">⌘ K</Kbd>
					</Button>
				</SearchCommand>
				<a
					aria-label="GitHub"
					href={siteConfig.links.github}
					target="_blank"
					rel="noopener noreferrer"
					data-icon-only=""
					className={buttonStyles({ variant: "default" })}
				>
					<GitHubIcon />
				</a>
				<ThemeToggle isIconOnly />
			</div>
		</header>
	);
}
