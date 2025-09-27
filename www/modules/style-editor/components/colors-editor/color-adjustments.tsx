"use client";

import { cn } from "@dotui/ui/lib/utils";

import {
  useStyleEditorForm,
  useSyncTheme,
} from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { useResolvedModeState } from "@/modules/style-editor/hooks/use-resolved-mode";
import { ON_CHANGE_DEBOUNCE_MS } from "@/modules/style-editor/constants";

export const ColorAdjustments = () => {
  const form = useStyleEditorForm();
  const { isPending } = useEditorStyle();
  const { resolvedMode } = useResolvedModeState();
  const syncTheme = useSyncTheme();

  return (
    <div
      className={cn(
        "mt-2 grid grid-cols-2 gap-3",
        isPending &&
          "[&_[data-slot='slider-filler']]:opacity-0 [&_[data-slot='slider-thumb']]:opacity-0 [&_[data-slot='slider-track']]:animate-pulse [&_[data-slot='slider-value-label']]:opacity-0",
      )}
    >
      <form.AppField
        name={`theme.colors.modes.${resolvedMode}.lightness`}
        listeners={{
          onChange: () => {
            syncTheme();
          },
          onChangeDebounceMs: ON_CHANGE_DEBOUNCE_MS,
        }}
      >
        {(field) => (
          <field.Slider
            label="Lightness"
            minValue={0}
            maxValue={100}
            className="col-span-2 w-auto"
          />
        )}
      </form.AppField>
      <form.AppField
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
            label="Saturation"
            minValue={0}
            maxValue={100}
            className="col-span-1 w-auto"
          />
        )}
      </form.AppField>
      <form.AppField
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
            label="Contrast"
            minValue={0}
            maxValue={500}
            className="col-span-1 w-auto"
          />
        )}
      </form.AppField>
    </div>
  );
};
