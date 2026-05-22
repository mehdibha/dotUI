import { Link as RouterLink } from "@tanstack/react-router";

import { buttonStyles } from "@/registry/ui/button";

export function Announcement() {
	return (
		<RouterLink
			to="/create"
			className={buttonStyles({ size: "sm", className: "h-7 rounded-full bg-neutral/50 text-fg-muted text-xs" })}
		>
			<span className="size-1.5 rounded-full bg-accent" />
			Introducing dotUI/create
		</RouterLink>
	);
}
