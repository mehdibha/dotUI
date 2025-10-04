"use client";

import { Key } from "react-aria";

import { cn } from "@dotui/registry/lib/utils";
import { Skeleton } from "@dotui/registry/ui/skeleton";
import { Slider } from "@dotui/registry/ui/slider";

import { useDraftStyle } from "@/modules/style-editor/atoms/draft-style-atom";
import { StyleEditorSection } from "@/modules/style-editor/components/section";
import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { FontSelector } from "@/modules/styles/components/fonts-selector";

export function TypographyEditor() {
  const { isPending } = useEditorStyle();
  const form = useStyleEditorForm();
  const { saveDraft } = useDraftStyle();

  return (
    <div className="space-y-4">
      <StyleEditorSection title="Font family">
        <form.AppField
          name="theme.fonts.heading"
          listeners={{
            onChange: () => {
              saveDraft();
            },
          }}
        >
          {(field) => (
            <FontSelector
              label="Heading font"
              value={field.state.value}
              onChange={(font) => field.handleChange(font as string)}
              className={cn(
                "w-full",
                isPending &&
                  "[&_[data-slot='button']]:!bg-bg-muted [&_[data-slot='button']]:pointer-events-none [&_[data-slot='button']]:animate-pulse [&_[data-slot='button']]:border-0 [&_[data-slot='button']]:*:invisible",
              )}
            />
          )}
        </form.AppField>
        <form.AppField
          name="theme.fonts.body"
          listeners={{
            onChange: () => {
              saveDraft();
            },
          }}
        >
          {(field) => (
            <FontSelector
              label="Body font"
              value={field.state.value}
              onChange={(font) => field.handleChange(font as string)}
              className={cn(
                "w-full",
                isPending &&
                  "[&_[data-slot='button']]:!bg-bg-muted [&_[data-slot='button']]:pointer-events-none [&_[data-slot='button']]:animate-pulse [&_[data-slot='button']]:border-0 [&_[data-slot='button']]:*:invisible",
              )}
            />
          )}
        </form.AppField>
      </StyleEditorSection>

      <StyleEditorSection title="Font size">
        <Slider
          label="Font size"
          defaultValue={16}
          minValue={12}
          maxValue={24}
          step={1}
          className={cn(
            "w-full",
            isPending &&
              "[&_[data-slot='slider-filler']]:opacity-0 [&_[data-slot='slider-thumb']]:opacity-0 [&_[data-slot='slider-track']]:animate-pulse [&_[data-slot='slider-value-label']]:opacity-0",
          )}
        />
      </StyleEditorSection>
    </div>
  );
}
