import type React from "react";

import { cn } from "@/registry/lib/utils";

export function Example({
	title,
	children,
	className,
}: React.ComponentProps<"div"> & {
	title: string;
}) {
	return (
		<div className={cn("mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none", className)}>
			<h3 className="px-1.5 py-2 text-xs font-medium text-fg-muted">{title}</h3>
			<div
				data-example-preview=""
				className="flex min-w-0 flex-1 flex-col items-start gap-6 rounded-xl border p-12 text-fg"
			>
				{children}
			</div>
		</div>
	);
}
