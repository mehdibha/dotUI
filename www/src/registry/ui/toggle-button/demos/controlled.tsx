"use client";

import React from "react";

import { PinIcon } from "@/registry/__generated__/icons";
import { ToggleButton } from "@/registry/ui/toggle-button";

export default function Demo() {
	const [isSelected, setSelected] = React.useState(true);
	return (
		<>
			<ToggleButton isIconOnly isSelected={isSelected} onChange={setSelected} aria-label="Toggle pin">
				<PinIcon className="rotate-45" />
			</ToggleButton>
			<span className="text-sm text-fg-muted">state: {isSelected ? "on" : "off"}</span>
		</>
	);
}
