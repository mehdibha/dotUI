"use client";

import * as icons from "@dotui/registry/icons";
import { iconLibraries } from "@dotui/registry/icons/registry";
import { cn } from "@dotui/registry/lib/utils";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";
import { SliderControl } from "@dotui/registry/ui/slider";
import type { IconLibrary } from "@dotui/style-system";

import { useDraftStyle } from "@/modules/style-editor/draft-style-atom";
import { DraftStyleProvider } from "@/modules/style-editor/draft-style-provider";
import { StyleEditorSection } from "@/modules/style-editor/section";
import { useStyleEditorForm } from "@/modules/style-editor/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/use-editor-style";

export function IconsEditor() {
  const form = useStyleEditorForm();
  const { isPending } = useEditorStyle();
  const { saveDraft } = useDraftStyle();

  return (
    <div>
      <StyleEditorSection title="Iconography">
        <form.AppField
          name="icons.library"
          listeners={{
            onChange: () => {
              saveDraft();
            },
          }}
        >
          {(field) => (
            <field.Select
              aria-label="Icon library"
              className={cn(
                "w-full",
                isPending &&
                  "[&_[data-slot='button']]:!bg-bg-muted [&_[data-slot='button']]:pointer-events-none [&_[data-slot='button']]:animate-pulse [&_[data-slot='button']]:border-0 [&_[data-slot='button']]:*:invisible",
              )}
            >
              <SelectTrigger />
              <SelectContent>
                {iconLibraries.map((library) => (
                  <SelectItem key={library.name} id={library.name}>
                    {library.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </field.Select>
          )}
        </form.AppField>

        <form.Subscribe selector={(state) => state.values.icons.library}>
          {(library) =>
            supportsIconStrokeWidth(library) && (
              <form.AppField
                name="icons.strokeWidth"
                listeners={{
                  onChange: () => {
                    saveDraft();
                  },
                }}
              >
                {(field) => (
                  <field.Slider
                    aria-label="Stroke width"
                    className={cn(
                      "w-full",
                      isPending &&
                        "[&_[data-slot='slider-filler']]:opacity-0 [&_[data-slot='slider-thumb']]:opacity-0 [&_[data-slot='slider-track']]:animate-pulse [&_[data-slot='slider-value-label']]:opacity-0",
                    )}
                    minValue={0.5}
                    maxValue={3}
                    step={0.1}
                  >
                    <SliderControl />
                  </field.Slider>
                )}
              </form.AppField>
            )
          }
        </form.Subscribe>

        <p data-slot="label" className="mt-6">
          Icons
        </p>
        <DraftStyleProvider className="rounded-md border p-4">
          <div className="grid max-h-[168px] gap-2 overflow-hidden [grid-template-columns:repeat(auto-fill,minmax(36px,1fr))] [grid-template-rows:repeat(auto-fill,minmax(36px,1fr))] [&_svg]:size-6">
            {Object.entries(icons)
              .slice(0, 100)
              .map(([name, IconComponent]) => {
                return (
                  <div key={name} className="flex items-center justify-center">
                    <IconComponent />
                  </div>
                );
              })}
          </div>
        </DraftStyleProvider>
      </StyleEditorSection>
    </div>
  );
}

function supportsIconStrokeWidth(library: IconLibrary) {
  return library === "lucide";
}
