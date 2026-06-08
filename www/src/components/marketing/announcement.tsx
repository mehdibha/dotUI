import { Link as RouterLink } from "@tanstack/react-router";

import { ArrowRightIcon } from "lucide-react";

import { buttonStyles } from "@/registry/ui/button";

export function Announcement() {
	return (
		<RouterLink
			to="/create"
			className={buttonStyles({
				size: "sm",
				className: "group h-7 gap-1.5 rounded-full bg-neutral/50 py-0 pr-2.5 pl-1 text-xs text-fg-muted hover:text-fg",
			})}
		>
			<span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] leading-none font-medium text-fg-on-accent">
				New
			</span>
			<span>
				Open in v0, bolt.new <span className="text-fg-muted/70">&</span> Lovable
			</span>
			<ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
		</RouterLink>
	);
}
