import { createFileRoute } from "@tanstack/react-router";
import { Checkbox } from "react-aria-components/Checkbox";

import { Label } from "@/registry/ui/field";

export const Route = createFileRoute("/playground")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex h-svh items-center justify-center gap-2">
			<Checkbox className="size-10 border">
				<span></span>
				{/* <Label>Accept terms and conditions</Label> */}
			</Checkbox>
		</div>
	);
}
