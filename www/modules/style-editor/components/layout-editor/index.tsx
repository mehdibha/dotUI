"use client";

import { cn } from "@dotui/registry/lib/utils";
import { Skeleton } from "@dotui/registry/ui/skeleton";

import { useDraftStyle } from "@/modules/style-editor/atoms/draft-style-atom";
import { StyleEditorSection } from "@/modules/style-editor/components/section";
import { ON_CHANGE_DEBOUNCE_MS } from "@/modules/style-editor/constants";
import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";

export function LayoutEditor() {
  const { isPending } = useEditorStyle();
  const form = useStyleEditorForm();
  const { saveDraft } = useDraftStyle();

  return (
    <div
      className={cn(
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
            <field.Slider
              label="Radius factor"
              minValue={0}
              maxValue={2}
              step={0.1}
              className="mt-2 w-full"
            />
          )}
        </form.AppField>
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
              <field.Slider
                label="Spacing"
                minValue={0.2}
                maxValue={0.35}
                step={0.01}
                className="mt-2 w-full"
              />
            )}
          </form.AppField>
        </StyleEditorSection>
      </StyleEditorSection>
    </div>
  );
}
