"use client";

import { Skeleton } from "@dotui/registry/ui/skeleton";

import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { StyleEditorSection } from "../section";

export function LayoutEditor() {
  const { isPending } = useEditorStyle();
  const form = useStyleEditorForm();

  return (
    <div>
      <StyleEditorSection title="Border radius">
        <form.AppField name="theme.radius">
          {(field) => (
            <Skeleton show={isPending}>
              <field.Slider
                label="Radius factor"
                minValue={0}
                maxValue={2}
                step={0.1}
                className="mt-2 w-full"
              />
            </Skeleton>
          )}
        </form.AppField>

        <form.AppField name="theme.spacing">
          {(field) => (
            <Skeleton show={isPending}>
              <field.Slider
                label="Spacing"
                minValue={0}
                maxValue={2}
                step={0.1}
                className="mt-2 w-full"
              />
            </Skeleton>
          )}
        </form.AppField>
      </StyleEditorSection>
    </div>
  );
}
