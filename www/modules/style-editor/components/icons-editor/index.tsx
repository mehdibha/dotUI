"use client";

import * as icons from "@dotui/registry/icons";
import { iconLibraries } from "@dotui/registry/icons/registry";
import { SelectItem } from "@dotui/registry/ui/select";
import { Skeleton } from "@dotui/registry/ui/skeleton";
import type { IconLibrary } from "@dotui/registry/style-system/types";

import { useStyleEditorForm } from "../../context/style-editor-provider";
import { useEditorStyle } from "../../hooks/use-editor-style";
import { DraftStyleProvider } from "../draft-style-provider";
import { StyleEditorSection } from "../section";

export function IconsEditor() {
  const form = useStyleEditorForm();
  const { isPending } = useEditorStyle();

  return (
    <div>
      <StyleEditorSection title="Iconography">
        <div className="mt-4 space-y-4">
          <form.AppField name="icons.library">
            {(field) => (
              <Skeleton show={isPending} className="mt-2">
                <field.Select label="Icon library" className="mt-2 w-full">
                  {iconLibraries.map((library) => (
                    <SelectItem key={library.name} id={library.name}>
                      {library.label}
                    </SelectItem>
                  ))}
                </field.Select>
              </Skeleton>
            )}
          </form.AppField>

          <form.Subscribe selector={(state) => state.values.icons.library}>
            {(library) =>
              supportsIconStrokeWidth(library) && (
                <form.AppField name="icons.strokeWidth">
                  {(field) => (
                    <Skeleton show={isPending} className="mt-2">
                      <field.Slider
                        label="Stroke width"
                        className="mt-2 w-full"
                        minValue={0.5}
                        maxValue={3}
                        step={0.1}
                        getValueLabel={(value) => `${value}px`}
                      />
                    </Skeleton>
                  )}
                </form.AppField>
              )
            }
          </form.Subscribe>
        </div>

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
