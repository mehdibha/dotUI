"use client";

import { cn } from "@dotui/registry/lib/utils";
import { Skeleton } from "@dotui/registry/ui/skeleton";
import { Slider } from "@dotui/registry/ui/slider";

import { StyleEditorSection } from "@/modules/style-editor/components/section";
import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { FontSelector } from "@/modules/styles/components/fonts-selector";

export function TypographyEditor() {
  const { isPending } = useEditorStyle();
  const form = useStyleEditorForm();

  return (
    <div className="min-h-[200svh]">
      <StyleEditorSection title="Font family">
        <div className="mt-3 space-y-3">
          <form.AppField name="theme.fonts.heading">
            {(field) => (
              <Skeleton show={isPending}>
                <FontSelector
                  label="Heading font"
                  font={field.state.value}
                  onFontChange={(font) => field.handleChange(font)}
                  className="mt-2"
                />
              </Skeleton>
            )}
          </form.AppField>

          <form.AppField name="theme.fonts.body">
            {(field) => (
              <Skeleton show={isPending}>
                <FontSelector
                  label="Body font"
                  font={field.state.value}
                  onFontChange={(font) => field.handleChange(font)}
                  className="mt-2"
                />
              </Skeleton>
            )}
          </form.AppField>
        </div>
      </StyleEditorSection>

      <StyleEditorSection title="Font size">
        <Slider
          label="Font size"
          defaultValue={16}
          minValue={12}
          maxValue={24}
          step={1}
          className={cn(
            isPending &&
              "[&_[data-slot='slider-filler']]:opacity-0 [&_[data-slot='slider-thumb']]:opacity-0 [&_[data-slot='slider-track']]:animate-pulse [&_[data-slot='slider-value-label']]:opacity-0",
          )}
        />
      </StyleEditorSection>
    </div>
  );
}
