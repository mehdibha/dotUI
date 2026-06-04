"use client";

import { SquarePenIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { Kbd } from "@/registry/ui/kbd";
import { useStyles as useTooltipStyles } from "@/registry/ui/tooltip/styles";

import { InertPreview } from "./inert-preview";

/** Static "open" Tooltip preview — bubble + arrow above a trigger. */
export function TooltipPreview() {
	const { content, arrow } = useTooltipStyles()();
	return (
		<InertPreview className="flex flex-col items-center justify-center gap-3">
			<div data-slot="tooltip" data-placement="top" className={content({ className: "relative" })}>
				Create new issue <Kbd>C</Kbd>
				{/* Arrow markup mirrors tooltip/base.tsx TooltipArrow, hand-placed (no Floating UI). */}
				<span className={arrow({ className: "absolute -bottom-2 left-1/2 -translate-x-1/2" })}>
					<svg aria-hidden="true" data-slot="tooltip-arrow" width={8} height={8} viewBox="0 0 8 8">
						<path d="M0 0 L4 4 L8 0" />
					</svg>
				</span>
			</div>
			<Button aria-label="Edit" isIconOnly>
				<SquarePenIcon />
			</Button>
		</InertPreview>
	);
}
