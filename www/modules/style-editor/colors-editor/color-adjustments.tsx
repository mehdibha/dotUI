"use client";

import { Label } from "@dotui/registry/ui/field";
import { SliderControl } from "@dotui/registry/ui/slider";

import { ON_CHANGE_DEBOUNCE_MS } from "@/modules/style-editor/constants";
import { useDraftStyle } from "@/modules/style-editor/draft-style-atom";
import { useStyleEditorForm, useSyncTheme } from "@/modules/style-editor/style-editor-provider";
import { useResolvedModeState } from "@/modules/style-editor/use-resolved-mode";

const clampLightnessByMode = (value: number, mode: "light" | "dark") => {
	return mode === "dark" ? Math.min(value, 49) : Math.max(value, 51);
};

export const ColorAdjustments = () => {
	const form = useStyleEditorForm();
	const { resolvedMode } = useResolvedModeState();

	const syncTheme = useSyncTheme();
	const { saveDraft } = useDraftStyle();

	return (
		<>
			<form.AppField
				key={`${resolvedMode}-lightness`}
				name={`theme.colors.modes.${resolvedMode}.lightness`}
				listeners={{
					onChange: () => {
						syncTheme();
						saveDraft();
					},
					onChangeDebounceMs: ON_CHANGE_DEBOUNCE_MS,
				}}
			>
				{(field) => (
					<field.Slider
						aria-label="Lightness"
						onChange={(value) => {
							field.handleChange(clampLightnessByMode(value as number, resolvedMode));
						}}
						minValue={0}
						maxValue={100}
						className="col-span-2"
					>
						<Label>Lightness</Label>
						<SliderControl className="w-full" />
					</field.Slider>
				)}
			</form.AppField>
			<form.AppField
				key={`${resolvedMode}-saturation`}
				name={`theme.colors.modes.${resolvedMode}.saturation`}
				listeners={{
					onChange: () => {
						syncTheme();
					},
					onChangeDebounceMs: ON_CHANGE_DEBOUNCE_MS,
				}}
			>
				{(field) => (
					<field.Slider aria-label="Saturation" minValue={0} maxValue={100}>
						<Label>Saturation</Label>
						<SliderControl />
					</field.Slider>
				)}
			</form.AppField>
			<form.AppField
				key={`${resolvedMode}-contrast`}
				name={`theme.colors.modes.${resolvedMode}.contrast`}
				listeners={{
					onChange: () => {
						syncTheme();
					},
					onChangeDebounceMs: ON_CHANGE_DEBOUNCE_MS,
				}}
			>
				{(field) => (
					<field.Slider aria-label="Contrast" minValue={0} maxValue={500}>
						<Label>Contrast</Label>
						<SliderControl />
					</field.Slider>
				)}
			</form.AppField>
		</>
	);
};
