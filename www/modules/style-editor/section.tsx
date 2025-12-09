"use client";

import { cn } from "@dotui/registry/lib/utils";

interface StyleEditorSectionProps extends React.ComponentProps<"div"> {
	title: string;
	rootClassName?: string;
}

export function StyleEditorSection({ title, children, rootClassName, className, ...props }: StyleEditorSectionProps) {
	return (
		<div className={cn("space-y-4", rootClassName)} {...props}>
			<h2 className="font-semibold text-base">{title}</h2>
			<div className={cn("space-y-4", className)}>{children}</div>
		</div>
	);
}
