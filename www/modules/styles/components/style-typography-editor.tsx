"use client";

import { FormControl } from "@dotui/ui/components/form";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { Slider } from "@dotui/ui/components/slider";

import { FontSelector } from "@/modules/styles/components/fonts-selector";
import { useStyleForm } from "@/modules/styles/providers/style-editor-provider";
import { EditorSection } from "./editor-section";

export function StyleTypographyEditor() {
  const { form, isSuccess } = useStyleForm();

  return (
    <div className="min-h-[200svh]">
      <EditorSection title="Font family">
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
      </EditorSection>

      <EditorSection title="Letter spacing">
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
      </EditorSection>
    </div>
  );
}
