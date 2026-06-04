"use client";

import { ColorArea, type ColorAreaProps } from "@/registry/ui/color-area";
import { ColorThumb } from "@/registry/ui/color-thumb";

export default function Demo({ isDisabled = false }: ColorAreaProps = {}) {
	return (
		<ColorArea defaultValue="#ff0000" isDisabled={isDisabled}>
			<ColorThumb />
		</ColorArea>
	);
}
