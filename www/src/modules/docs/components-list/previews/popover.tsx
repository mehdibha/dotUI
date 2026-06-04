"use client";

import { InfoIcon } from "lucide-react";

import { Button } from "@/registry/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/registry/ui/dialog";
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles";

import { InertPreview } from "./inert-preview";

/** Static "open" Popover preview — bubble + arrow anchored above a trigger. */
export function PopoverPreview() {
	const { popover, arrow } = usePopoverStyles()();
	return (
		<InertPreview className="flex flex-col items-center justify-center gap-3 px-4">
			{/* data-popover="" so the dialog's `in-data-popover:` density styles apply. */}
			<div data-popover="" data-placement="bottom" className={popover({ className: "relative max-w-[92%]" })}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Need help?</DialogTitle>
					</DialogHeader>
					<p>If you&apos;re having issues, contact our customer support team.</p>
				</DialogContent>
				{/* Arrow markup mirrors popover/base.tsx PopoverArrow, hand-placed (no Floating UI). */}
				<span className={arrow({ className: "absolute -bottom-2.5 left-1/2 -translate-x-1/2 rotate-180" })}>
					<svg aria-hidden="true" width={12} height={12} viewBox="0 0 8 8">
						<path d="M0 0 L4 4 L8 0" />
					</svg>
				</span>
			</div>
			<Button aria-label="Help" isIconOnly>
				<InfoIcon />
			</Button>
		</InertPreview>
	);
}
