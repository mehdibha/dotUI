"use client";

import { Slider } from "@dotui/registry/ui/slider";

import { FontSelector } from "@/modules/style-editor/fonts-selector";
import { StyleEditorSection } from "@/modules/style-editor/section";

export function TypographyEditor() {
	return (
		<div className="space-y-4">
			<StyleEditorSection title="Font family">
				<FontSelector className="w-full" />
				<FontSelector className="w-full" />
			</StyleEditorSection>

			<StyleEditorSection title="Font size">
				<Slider aria-label="Font size" defaultValue={16} minValue={12} maxValue={24} step={1} className="w-full" />
			</StyleEditorSection>
		</div>
	);
}
