"use client";

import { Slider, SliderControl } from "@dotui/registry/ui/slider";

import { StyleEditorSection } from "@/modules/style-editor/section";

export function LayoutEditor() {
	return (
		<div className="space-y-4">
			<StyleEditorSection title="Border radius">
				<Slider aria-label="Radius factor" defaultValue={1} minValue={0} maxValue={2} step={0.1} className="mt-2 w-full">
					<SliderControl />
				</Slider>
			</StyleEditorSection>
			<StyleEditorSection title="Spacing">
				<Slider aria-label="Spacing" defaultValue={0.25} minValue={0.2} maxValue={0.35} step={0.01} className="w-full">
					<SliderControl />
				</Slider>
			</StyleEditorSection>
		</div>
	);
}
