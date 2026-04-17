import { createFileRoute } from "@tanstack/react-router";

import { TextArea } from "@/registry/ui/input";

export const Route = createFileRoute("/playground")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<TextArea className="w-40" />
		</div>
	);
}
