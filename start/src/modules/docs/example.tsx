import type React from "react";

import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogHeading } from "@dotui/registry/ui/dialog";
import { Overlay } from "@dotui/registry/ui/overlay";

import { CodeBlock, Pre } from "./code-block";
import { DemoCode, DemoCodePreview, getSlotContent } from "./demo";

export interface ExampleProps extends React.ComponentProps<"div"> {
	component: React.ComponentType;
	description?: string;
	children: React.ReactNode;
}

export function Example({ component: Component, description, children, ...props }: ExampleProps) {
	const codeContent = getSlotContent(children, DemoCode);
	const previewContent = getSlotContent(children, DemoCodePreview);

	return (
		<div className="relative flex flex-col" {...props}>
			{/* Preview */}
			<div className="flex flex-1 items-center justify-center rounded-t-md border bg-bg p-10">
				<Component />
			</div>

			{/* Bottom bar */}
			<div className="flex items-center justify-between gap-4 rounded-b-lg border border-t-0 bg-card/50 p-1.5 pl-3">
				{description ? <p className="truncate text-fg-muted text-sm">{description}</p> : <span />}
				<Dialog>
					<Button size="sm" className="h-7">
						View code
					</Button>
					<Overlay isDismissable>
						<DialogContent className="max-w-2xl">
							<DialogHeader>
								<DialogHeading>Code</DialogHeading>
							</DialogHeader>
							<DialogBody className="p-0">
								<CodeBlock className="max-h-96 overflow-auto rounded-none border-0">
									<Pre>{codeContent || previewContent}</Pre>
								</CodeBlock>
							</DialogBody>
						</DialogContent>
					</Overlay>
				</Dialog>
			</div>
		</div>
	);
}
