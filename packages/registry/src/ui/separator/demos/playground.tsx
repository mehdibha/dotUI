"use client";

import { Separator } from "@dotui/registry/ui/separator";

interface SeparatorPlaygroundProps {
	orientation?: "horizontal" | "vertical";
}

export function SeparatorPlayground({ orientation = "horizontal" }: SeparatorPlaygroundProps) {
	return (
		<div className={orientation === "vertical" ? "flex h-20 items-center" : "w-full"}>
			<Separator orientation={orientation} />
		</div>
	);
}
