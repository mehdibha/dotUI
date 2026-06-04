"use client";

import { Badge } from "@/registry/ui/badge";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	return (
		<AnimatedPreview
			script={async (s) => {
				await s.moveOff();
				await s.wait(2400);
			}}
		>
			{() => (
				<div className="flex flex-wrap items-center justify-center gap-2">
					<Badge variant="success">Active</Badge>
					<Badge variant="warning">Pending</Badge>
					<Badge variant="danger">Failed</Badge>
				</div>
			)}
		</AnimatedPreview>
	);
}
