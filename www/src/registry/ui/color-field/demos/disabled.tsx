"use client";

import * as ColorAreaPrimitives from "react-aria-components/ColorArea";

import { ColorField } from "@/registry/ui/color-field";
import { Input } from "@/registry/ui/input";

export default function Demo() {
	return (
		<ColorField aria-label="Disabled color" value={ColorAreaPrimitives.parseColor("rgb(222,70,58)")} isDisabled>
			<Input />
		</ColorField>
	);
}
