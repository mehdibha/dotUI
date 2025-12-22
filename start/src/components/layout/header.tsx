import { GitHubIcon } from "@dotui/registry/components/icons/github";
import { cn } from "@dotui/registry/lib/utils";
import { LinkButton } from "@dotui/registry/ui/button";
import { Link } from "@tanstack/react-router";

import { Logo } from "@/components/layout/logo";
import { navItems, siteConfig } from "@/config/site";
import { ThemeToggle } from "@/modules/theme/toggle";

export function Header({ className }: { className?: string }) {
	return (
		<header className={cn("sticky top-0 z-30 h-(--header-height) w-full border-b bg-bg", className)}>
			<div className="container relative flex h-full items-center justify-between">
				<div className="flex items-center gap-6">
					<Logo />
					<nav className="flex items-center gap-3 text-sm max-md:hidden">
						{navItems.map((item) => (
							<Link key={item.url} to={item.url} className="px-0.5 text-fg-muted transition-colors hover:text-fg">
								{item.name}
							</Link>
						))}
					</nav>
				</div>
				<div className="flex items-center gap-2">
					<LinkButton aria-label="GitHub" href={siteConfig.links.github} target="_blank" size="sm">
						<GitHubIcon />
					</LinkButton>
					<ThemeToggle size="sm" />
				</div>
			</div>
		</header>
	);
}
