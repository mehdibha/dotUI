import type React from "react";

import { cn } from "@/registry/lib/utils";

export interface ExamplesProps extends React.ComponentProps<"div"> {
	children: React.ReactNode;
}

export function Examples({ className, children, ...props }: ExamplesProps) {
	return (
		<div className={cn("grid grid-cols-3 gap-4", className)} {...props}>
			{children}
		</div>
	);
}
