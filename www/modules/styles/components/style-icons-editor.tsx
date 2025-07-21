"use client";

import { iconLibraries } from "@dotui/registry-definition/registry-icons";
import { registryIcons } from "@dotui/ui/__registry__/icons";
import * as Icons from "@dotui/ui/__registry__/icons";
import { Button } from "@dotui/ui/components/button";
import { Label } from "@dotui/ui/components/field";
import { FormControl } from "@dotui/ui/components/form";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Popover } from "@dotui/ui/components/popover";
import { SelectRoot, SelectValue } from "@dotui/ui/components/select";
import { Slider } from "@dotui/ui/components/slider";
import { StyleProvider } from "@dotui/ui/index";
import { Skeleton } from "@dotui/ui/registry/components/skeleton/basic";

import { useStyleForm } from "@/modules/styles/providers/style-pages-provider";
import { EditorSection } from "./editor-section";

export function StyleIconsEditor() {
  const { form, isSuccess } = useStyleForm();

  //  TODO: add icons effects such as glow effect with box-shadow

  return (
    <div>
      <EditorSection title="Iconography">
        <div className="mt-4 space-y-4">
          <Skeleton show={!isSuccess}>
            <FormControl
              name="icons.library"
              control={form.control}
              render={({ value, onChange, ...props }) => (
                <SelectRoot
                  selectedKey={value}
                  onSelectionChange={onChange}
                  {...props}
                  className="mt-2 w-full"
                >
                  <Label>Icon library</Label>
                  <Button suffix={<Icons.ChevronDownIcon />} className="w-full">
                    <SelectValue />
                  </Button>
                  <Popover>
                    <ListBox>
                      {iconLibraries.map((library) => (
                        <ListBoxItem key={library.name} id={library.name}>
                          {library.label}
                        </ListBoxItem>
                      ))}
                    </ListBox>
                  </Popover>
                </SelectRoot>
              )}
            />
          </Skeleton>

          <Skeleton show={!isSuccess}>
            <FormControl
              name="icons.strokeWidth"
              control={form.control}
              render={(props) => (
                <Slider
                  label="Stroke width"
                  defaultValue={1.5}
                  minValue={0.5}
                  maxValue={3}
                  step={0.1}
                  getValueLabel={(value) => `${value}px`}
                  className="mt-2 w-full"
                  {...props}
                />
              )}
            />
          </Skeleton>
        </div>

        <Label className="mt-6">Icons</Label>
        <StyleProvider style={form.watch()} className="rounded-md border p-4">
          <div className="grid max-h-[168px] [grid-template-columns:repeat(auto-fill,minmax(36px,1fr))] [grid-template-rows:repeat(auto-fill,minmax(36px,1fr))] gap-2 overflow-hidden [&_svg]:size-6">
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
        </StyleProvider>
      </EditorSection>
    </div>
  );
}
