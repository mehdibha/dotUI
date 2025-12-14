"use client";

import { cn } from "@dotui/registry/lib/utils";
import { SliderControl } from "@dotui/registry/ui/slider";

import { useDraftStyle } from "@/modules/style-editor/draft-style-atom";
import { StyleEditorSection } from "@/modules/style-editor/section";
import { useStyleEditorForm } from "@/modules/style-editor/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/use-editor-style";

export function LayoutEditor() {
	const { isPending } = useEditorStyle();
	const form = useStyleEditorForm();
	const { saveDraft } = useDraftStyle();

	return (
		<div
			className={cn(
				"space-y-4",
				isPending &&
					"[&_[data-slot='slider-filler']]:opacity-0 [&_[data-slot='slider-thumb']]:opacity-0 [&_[data-slot='slider-track']]:animate-pulse [&_[data-slot='slider-value-label']]:opacity-0",
			)}
		>
			<StyleEditorSection title="Border radius">
				<form.AppField
					name="theme.radius"
					listeners={{
						onChange: () => {
							saveDraft();
						},
					}}
				>
					{(field) => (
						<field.Slider aria-label="Radius factor" minValue={0} maxValue={2} step={0.1} className="mt-2 w-full">
							<SliderControl />
						</field.Slider>
					)}
				</form.AppField>
			</StyleEditorSection>
			<StyleEditorSection title="Spacing">
				<form.AppField
					name="theme.spacing"
					listeners={{
						onChange: () => {
							saveDraft();
						},
					}}
				>
					{(field) => (
						<field.Slider aria-label="Spacing" minValue={0.2} maxValue={0.35} step={0.01} className="w-full">
							<SliderControl />
						</field.Slider>
					)}
				</form.AppField>
			</StyleEditorSection>
		</div>
	);
}
