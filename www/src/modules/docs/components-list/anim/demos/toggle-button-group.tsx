"use client";

import { useState } from "react";

import type { Selection } from "react-aria-components";

import { BoldIcon, ItalicIcon, UnderlineIcon } from "@/registry/__generated__/icons";
import { ToggleButton } from "@/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group";

import { AnimatedPreview } from "../animated-preview";

export default function Demo() {
	const [selected, setSelected] = useState<Selection>(() => new Set(["bold"]));
	return (
		<AnimatedPreview
			reset={() => setSelected(new Set(["bold"]))}
			script={async (s) => {
				await s.wait(500);
				await s.click({ selector: "[data-toggle-button]:nth-child(2)" }, () =>
					setSelected(new Set(["bold", "italic"])),
				);
				await s.wait(850);
				await s.click({ selector: "[data-toggle-button]:nth-child(3)" }, () =>
					setSelected(new Set(["bold", "italic", "underline"])),
				);
				await s.wait(900);
				await s.click({ selector: "[data-toggle-button]:nth-child(1)" }, () =>
					setSelected(new Set(["italic", "underline"])),
				);
				await s.wait(1000);
				await s.moveOff();
				await s.wait(500);
			}}
		>
			{() => (
				<ToggleButtonGroup
					selectionMode="multiple"
					selectedKeys={selected}
					onSelectionChange={setSelected}
					aria-label="Text formatting"
				>
					<ToggleButton id="bold" isIconOnly aria-label="Bold">
						<BoldIcon />
					</ToggleButton>
					<ToggleButton id="italic" isIconOnly aria-label="Italic">
						<ItalicIcon />
					</ToggleButton>
					<ToggleButton id="underline" isIconOnly aria-label="Underline">
						<UnderlineIcon />
					</ToggleButton>
				</ToggleButtonGroup>
			)}
		</AnimatedPreview>
	);
}
