"use client";

import { iconLibraries } from "@dotui/registry-definition/registry-icons";
import { registryIcons } from "@dotui/ui/__registry__/icons";
import * as Icons from "@dotui/ui/__registry__/icons";
import { Button } from "@dotui/ui/components/button";
import { Label } from "@dotui/ui/components/field";
import { FormControl } from "@dotui/ui/components/form";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Popover } from "@dotui/ui/components/popover";
import {
  SelectItem,
  SelectRoot,
  SelectValue,
} from "@dotui/ui/components/select";
import { Slider } from "@dotui/ui/components/slider";
import { Skeleton } from "@dotui/ui/registry/components/skeleton/basic";
import type { IconLibrary } from "@dotui/style-engine/types";

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
            {Object.entries(registryIcons)
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
