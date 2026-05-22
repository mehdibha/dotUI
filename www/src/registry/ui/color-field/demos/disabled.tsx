"use client";

import { parseColor } from "react-aria-components/ColorField";

import { ColorField } from "@/registry/ui/color-field";
import { Input } from "@/registry/ui/input";

export default function Demo() {
	return (
		<ColorField aria-label="Disabled color" value={parseColor("rgb(222,70,58)")} isDisabled>
			<Input />
		</ColorField>
	);
}
