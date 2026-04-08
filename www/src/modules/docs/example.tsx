import type React from "react";

import { cn } from "@/registry/lib/utils";
import { Button } from "@/registry/ui/button";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogHeading } from "@/registry/ui/dialog";
import { Overlay } from "@/registry/ui/overlay";

import { CodeBlock, Pre } from "./code-block";
import { DemoCode, DemoCodePreview, getSlotContent } from "./demo";

export interface ExampleProps extends React.ComponentProps<"div"> {
	component: React.ComponentType;
	description?: string;
	children: React.ReactNode;
}

export function Example({ component: Component, description, children, className, ...props }: ExampleProps) {
	const codeContent = getSlotContent(children, DemoCode);
	const previewContent = getSlotContent(children, DemoCodePreview);

	return (
		<div className={cn("flex flex-1 items-center justify-center rounded-t-md border bg-bg p-10", className)} {...props}>
			<Component />
		</div>
	);
}
