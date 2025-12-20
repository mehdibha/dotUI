"use client";

import { ChevronsUpDownIcon, CodeIcon, EyeIcon, RocketIcon, RotateCcwIcon, XIcon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { Avatar } from "@dotui/registry/ui/avatar";
import { Button } from "@dotui/registry/ui/button";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Drawer } from "@dotui/registry/ui/drawer";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

import { PreviewFrame } from "@/modules/style-editor/preview";
import { useResolvedModeState } from "@/modules/style-editor/use-resolved-mode";

export function StyleEditorHeader() {
	return (
		<div className="container flex max-w-4xl justify-between">
			<StyleSelector />
			<StyleEditorHeaderActions />
		</div>
	);
}

function StyleSelector() {
	return (
		<div className="flex items-center gap-2">
			<span className="flex items-center gap-2 text-fg-muted text-sm">
				<Avatar fallback="US" className="size-5" />
			</span>
			<span className="text-fg-disabled">/</span>
			<Button variant="default" className="border-0" size="sm">
				My Style
				<ChevronsUpDownIcon />
			</Button>
		</div>
	);
}

function StyleEditorHeaderActions() {
	const { resolvedMode } = useResolvedModeState();

	return (
		<div className="flex items-center gap-1">
			<Button size="sm" className="@max-md:size-8 @max-md:w-8 @max-md:px-0">
				<CodeIcon />
				<span className="@max-md:hidden">Code</span>
			</Button>
			<Dialog>
				<Button size="sm" aria-label="Preview" className="xl:hidden">
					<EyeIcon />
				</Button>
				<Drawer>
					<DialogContent className="overflow-hidden p-0!">
						<div className="h-[80vh]">
							<PreviewFrame block="login" className="h-full" />
						</div>
						<div className={cn("absolute top-1 right-1 size-7 rounded-lg", resolvedMode === "dark" ? "dark" : "light")}>
							<Button slot="close" variant="quiet" size="sm">
								<XIcon />
							</Button>
						</div>
					</DialogContent>
				</Drawer>
			</Dialog>
			<Tooltip>
				<Button aria-label="Reset form" size="sm">
					<RotateCcwIcon />
				</Button>
				<TooltipContent>Reset</TooltipContent>
			</Tooltip>
			<Button size="sm" variant="primary" className="border border-primary hover:border-primary-hover">
				<RocketIcon />
				Publish
			</Button>
		</div>
	);
}
