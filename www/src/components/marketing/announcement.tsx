import { Link as RouterLink } from "@tanstack/react-router";

import { ArrowRightIcon } from "lucide-react";

import { buttonStyles } from "@/registry/ui/button";

export function Announcement() {
	return (
		<RouterLink
			to="/create"
			className={buttonStyles({
				size: "xs",
				className: "group gap-1.5 rounded-full text-xs text-fg-muted hover:text-fg",
			})}
		>
			<span className="size-1.5 rounded-full bg-accent" />
			<span>
				Open in v0, bolt.new <span className="text-fg-muted/70">&</span> Lovable
			</span>
			<ArrowRightIcon />
		</RouterLink>
	);
}
