"use client";

import { FormControl } from "@dotui/ui/components/form";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { Slider } from "@dotui/ui/components/slider";

import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { FontSelector } from "@/modules/styles/components/fonts-selector";
import { StyleEditorSection } from "./section";

export function TypographyEditor() {
  const { isSuccess } = useEditorStyle();
  const form = useStyleEditorForm();

  return (
    <div className="min-h-[200svh]">
      <StyleEditorSection title="Font family">
        <div className="mt-3 space-y-3">
          <Skeleton show={!isSuccess}>
            <FormControl
              name="theme.fonts.heading"
              control={form.control}
              render={({ value, onChange }) => (
                <FontSelector
                  label="Heading font"
                  font={value}
                  onFontChange={onChange}
                  className="mt-2"
                />
              )}
            />
          </Skeleton>
          <Skeleton show={!isSuccess}>
            <FormControl
              name="theme.fonts.body"
              control={form.control}
              render={({ value, onChange }) => (
                <FontSelector
                  label="Body font"
                  font={value}
                  onFontChange={onChange}
                  className="mt-2"
                />
              )}
            />
          </Skeleton>
        </div>
      </StyleEditorSection>

      <StyleEditorSection title="Letter spacing">
        <Skeleton show={!isSuccess}>
          <Slider
            label="Letter spacing"
            defaultValue={0}
            minValue={-0.1}
            maxValue={0.1}
            step={0.025}
            getValueLabel={(value) => `${value}em`}
            className="mt-2 w-full"
          />
        </Skeleton>
      </StyleEditorSection>
    </div>
  );
}
