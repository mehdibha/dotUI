import { LinkButton } from "@dotui/registry/ui/button";

export function Announcement() {
	return (
		<LinkButton
			href={{ to: "/docs/$", params: { _splat: "" } }}
			size="sm"
			className="h-7 rounded-full bg-neutral/50 text-fg-muted text-xs"
		>
			<span className="size-1.5 rounded-full bg-accent" />
			Introducing dotUI v1.0.0
		</LinkButton>
	);
}
