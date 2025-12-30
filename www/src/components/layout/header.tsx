import { Link } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import type * as PageTree from "fumadocs-core/page-tree";

import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { cn } from "@dotui/registry/lib/utils";
import { Button, LinkButton } from "@dotui/registry/ui/button";
import { Kbd } from "@dotui/registry/ui/kbd";

import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchCommand } from "@/components/search-command";
import { navItems, siteConfig } from "@/config/site";
import { ThemeToggle } from "@/modules/theme/toggle";

interface HeaderProps {
	className?: string;
	items?: PageTree.Node[];
}

export function Header({ className, items = [] }: HeaderProps) {
	return (
		<header className={cn("sticky top-0 z-30 h-(--header-height) w-full border-b bg-bg", className)}>
			<div className="container relative flex h-full items-center justify-between">
				<div className="flex items-center gap-3 md:gap-6">
					<MobileNav items={items} />
					<Logo className="max-md:hidden" />
					<nav className="flex items-center gap-3 text-sm max-md:hidden">
						{navItems.map((item) => (
							<Link key={item.name} {...item.href} className="px-0.5 text-fg-muted transition-colors hover:text-fg">
								{item.name}
							</Link>
						))}
					</nav>
				</div>
				<div className="flex items-center gap-2">
					<SearchCommand keyboardShortcut items={items}>
						<Button
							variant="default"
							size="sm"
							className="gap-2 pr-1 pl-3 max-md:size-8 max-md:px-0 md:text-fg-muted"
						>
							<SearchIcon className="md:hidden" />
							<span className="mr-6 flex-1 max-md:hidden">Search docs...</span>
							<Kbd className="max-md:hidden">⌘ K</Kbd>
						</Button>
					</SearchCommand>
					<LinkButton aria-label="GitHub" href={siteConfig.links.github} target="_blank" size="sm">
						<GitHubIcon />
					</LinkButton>
					<ThemeToggle size="sm" />
				</div>
			</div>
		</header>
	);
}
