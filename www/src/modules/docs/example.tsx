import type React from "react";

import { cn } from "@/registry/lib/utils";
import { Button } from "@/registry/ui/button";
import { Dialog, DialogBody, DialogContent } from "@/registry/ui/dialog";
import { Modal } from "@/registry/ui/modal";

// import { DemoCode, DemoCodePreview, getSlotContent } from "./demo";

export interface ExampleProps extends React.ComponentProps<"div"> {
	component: React.ComponentType;
	title?: string;
	children: React.ReactNode;
}

export function Example({ component: Component, title, children, className, ...props }: ExampleProps) {
	// const codeContent = getSlotContent(children, DemoCode);
	// const previewContent = getSlotContent(children, DemoCodePreview);

	return (
		<div className={cn("flex flex-col gap-1", className)} {...props}>
			<h3 className="px-1.5 py-2 font-normal text-fg-muted text-sm">{title}</h3>
			<div className="relative flex flex-1 flex-col">
				<div
					tabIndex={-1}
					className="pointer-events-none flex min-h-32 flex-1 flex-col items-center justify-center gap-6 p-6"
				>
					<Component />
				</div>
				<Dialog>
					<Button variant="quiet" className="absolute inset-0 z-2 size-auto border hover:border-border-hover" />
					<Modal>
						<DialogContent>
							{/* <DialogHeader>
								<DialogHeading>{title}</DialogHeading>
							</DialogHeader> */}
							<DialogBody>
								<Component />
							</DialogBody>
						</DialogContent>
					</Modal>
				</Dialog>
			</div>
		</div>
	);
}
