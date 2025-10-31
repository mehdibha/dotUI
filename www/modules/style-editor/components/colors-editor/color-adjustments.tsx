"use client";

import { cn } from "@dotui/registry/lib/utils";
import { SliderControl } from "@dotui/registry/ui/slider";

import { useDraftStyle } from "@/modules/style-editor/atoms/draft-style-atom";
import { ON_CHANGE_DEBOUNCE_MS } from "@/modules/style-editor/constants";
import {
  useStyleEditorForm,
  useSyncTheme,
} from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { useResolvedModeState } from "@/modules/style-editor/hooks/use-resolved-mode";

const clampLightnessByMode = (value: number, mode: "light" | "dark") => {
  return mode === "dark" ? Math.min(value, 49) : Math.max(value, 51);
};

export const ColorAdjustments = () => {
  const form = useStyleEditorForm();
  const { isPending } = useEditorStyle();
  const { resolvedMode } = useResolvedModeState();

  const syncTheme = useSyncTheme();
  const { saveDraft } = useDraftStyle();

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3",
        isPending &&
          "[&_[data-slot='slider-filler']]:opacity-0 [&_[data-slot='slider-thumb']]:opacity-0 [&_[data-slot='slider-track']]:animate-pulse [&_[data-slot='slider-value-label']]:opacity-0",
      )}
    >
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
              field.handleChange(
                clampLightnessByMode(value as number, resolvedMode),
              );
            }}
            minValue={0}
            maxValue={100}
            className="col-span-2 w-auto"
          >
            <SliderControl />
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
          <field.Slider
            aria-label="Saturation"
            minValue={0}
            maxValue={100}
            className="col-span-1 w-auto"
          >
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
          <field.Slider
            aria-label="Contrast"
            minValue={0}
            maxValue={500}
            className="col-span-1 w-auto"
          >
            <SliderControl />
          </field.Slider>
        )}
      </form.AppField>
    </div>
  );
};
