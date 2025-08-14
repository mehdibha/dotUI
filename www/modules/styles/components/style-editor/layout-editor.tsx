"use client";

import { FormControl } from "@dotui/ui/components/form";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { Slider } from "@dotui/ui/components/slider";

import { useStyleForm } from "@/modules/styles/providers/style-editor-provider";
import { StyleEditorSection } from "./section";

export function LayoutEditor() {
  const { form, isSuccess } = useStyleForm();

  return (
    <div>
      <StyleEditorSection title="Border radius">
        <Skeleton show={!isSuccess}>
          <FormControl
            name="theme.radius"
            control={form.control}
            render={(props) => (
              <Slider
                label="Radius factor"
                minValue={0}
                maxValue={2}
                step={0.1}
                className="mt-2 w-full"
                {...props}
              />
            )}
          />
        </Skeleton>
      </StyleEditorSection>

      <StyleEditorSection title="Spacing">
        <Skeleton show={!isSuccess}>
          <FormControl
            name="theme.spacing"
            control={form.control}
            render={(props) => (
              <Slider
                label="Spacing"
                minValue={0.2}
                maxValue={0.3}
                step={0.01}
                getValueLabel={(value) => `${value}rem`}
                className="mt-2 w-full"
                {...props}
              />
            )}
          />
        </Skeleton>
      </StyleEditorSection>
    </div>
  );
}
