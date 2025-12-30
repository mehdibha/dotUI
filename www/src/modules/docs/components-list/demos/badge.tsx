import { Badge } from "@dotui/registry/ui/badge";

export function BadgeDemo() {
	return (
		<div className="flex flex-col items-center gap-2 *:flex *:items-center *:gap-2">
			<div>
				<Badge>Default</Badge>
				<Badge className="rounded-full px-2">99+</Badge>
			</div>
			<div>
				<Badge variant="success">Success</Badge>
				<Badge variant="danger">Error</Badge>
				<Badge variant="warning">Warning</Badge>
			</div>
		</div>
	);
}
