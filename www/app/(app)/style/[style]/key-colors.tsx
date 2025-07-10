"use client";

import { DeleteIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { parseColor } from "react-aria-components";
import { useFieldArray } from "react-hook-form";

import { Button } from "@dotui/ui/components/button";
import {
  ColorPicker,
  ColorPickerButton,
  ColorPickerEditor,
  ColorPickerRoot,
} from "@dotui/ui/components/color-picker";
import { ColorSwatch } from "@dotui/ui/components/color-swatch";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogRoot,
} from "@dotui/ui/components/dialog";
import { FormControl } from "@dotui/ui/components/form";
import {
  Slider,
  SliderFiller,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from "@dotui/ui/components/slider";
import { Tooltip } from "@dotui/ui/components/tooltip";
import { cn } from "@dotui/ui/lib/utils";

import { useStyleForm } from "@/modules/styles/lib/form-context";

export function ColorKeys({
  currentMode,
  name,
}: {
  currentMode: "light" | "dark";
  name: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
}) {
  const { form } = useStyleForm();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `colors.${currentMode}.colors.${name}.colorKeys`,
  });

  const colorKeys = form.watch(
    `colors.${currentMode}.colors.${name}.colorKeys`,
  );

  return (
    <DialogRoot>
      <Button>
        <ColorSwatch color={colorKeys[0]?.color} />
        {name}
      </Button>
      <Dialog title={`${name.charAt(0).toUpperCase() + name.slice(1)} palette`}>
        <DialogBody>
          <p>Color keys</p>
          <div className="mt-2 flex items-center gap-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center">
                <FormControl
                  control={form.control}
                  name={`colors.${currentMode}.colors.${name}.colorKeys.${index}.color`}
                  render={(props) => {
                    return (
                      <ColorPickerRoot {...props}>
                        <DialogRoot>
                          <Button
                            shape="square"
                            className={cn(index > 0 && "rounded-r-none")}
                          >
                            <ColorSwatch />
                          </Button>
                          <Dialog type="popover" mobileType="drawer">
                            <ColorPickerEditor />
                          </Dialog>
                        </DialogRoot>
                      </ColorPickerRoot>
                    );
                  }}
                />
                {index > 0 && (
                  <Button
                    shape="square"
                    className="rounded-l-none border-l-0"
                    onPress={() => {
                      remove(index);
                    }}
                  >
                    <Trash2Icon />
                  </Button>
                )}
              </div>
            ))}
            <Tooltip content="Add color">
              <Button
                shape="square"
                onPress={() => {
                  append({ id: fields.length, color: "#000000" });
                }}
              >
                <PlusIcon />
              </Button>
            </Tooltip>
          </div>
          <SliderRoot
            minValue={1}
            maxValue={20}
            step={0.1}
            defaultValue={[
              1.25, 1.5, 1.8, 2.23, 3.16, 4.78, 6.36, 8.28, 13.2, 15.2,
            ]}
            className="mt-6 w-full"
          >
            <SliderTrack
              className="h-20 rounded-sm"
              style={{ background: "linear-gradient(90deg, #fff, #000)" }}
            >
              {({ state }) => (
                <>
                  {state.values.map((_, i) => (
                    <SliderThumb
                      key={i}
                      index={i}
                      className="size-2 dragging:size-3"
                    />
                  ))}
                </>
              )}
            </SliderTrack>
          </SliderRoot>
        </DialogBody>
      </Dialog>
    </DialogRoot>
  );
}
