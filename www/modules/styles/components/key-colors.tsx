"use client";

import { useMemo } from "react";
import {
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import type { CssColor } from "@adobe/leonardo-contrast-colors";

import { Button } from "@dotui/ui/components/button";
import {
  ColorPickerEditor,
  ColorPickerRoot,
} from "@dotui/ui/components/color-picker";
import { ColorSwatch } from "@dotui/ui/components/color-swatch";
import { Dialog, DialogBody, DialogRoot } from "@dotui/ui/components/dialog";
import { FormControl } from "@dotui/ui/components/form";
import { NumberField } from "@dotui/ui/components/number-field";
import {
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from "@dotui/ui/components/slider";
import { Tooltip } from "@dotui/ui/components/tooltip";
import { cn } from "@dotui/ui/lib/utils";

import { useStyleForm } from "@/modules/styles/providers/style-pages-provider";

export function ColorKeys({
  id,
  name,
  currentModeIndex,
  scaleIndex,
  neutralIndex,
}: {
  id: string;
  name: string;
  currentModeIndex: number;
  scaleIndex: number;
  neutralIndex: number;
}) {
  const { form } = useStyleForm();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `theme.colors.modes.${currentModeIndex}.scales.${scaleIndex}.colorKeys`,
  });

  const colorKeys = form
    .watch(
      `theme.colors.modes.${currentModeIndex}.scales.${scaleIndex}.colorKeys`,
    )
    .map((color) => color.color) as CssColor[];
  const ratios = Array.from({ length: 19 }, (_, i) => i + 1);
  const lightness = form.watch(
    `theme.colors.modes.${currentModeIndex}.lightness`,
  );
  const saturation = form.watch(
    `theme.colors.modes.${currentModeIndex}.saturation`,
  );
  const contrast =
    form.watch(`theme.colors.modes.${currentModeIndex}.contrast`) / 100;
  const neutralColorKeys = form.watch(
    `theme.colors.modes.${currentModeIndex}.scales.${neutralIndex}.colorKeys`,
  );

  const dynamicGradient = useMemo(() => {
    const neutral = new LeonardoBgColor({
      name: "neutral",
      colorKeys: neutralColorKeys.map((color) => color.color) as CssColor[],
      ratios,
    });

    const currentColor = new LeonardoColor({
      name,
      colorKeys,
      ratios,
    });

    const theme = new LeonardoTheme({
      backgroundColor: neutral,
      colors: [currentColor],
      lightness,
      saturation,
      contrast,
      output: "HEX",
    });

    const palette = theme.contrastColors[1]!;

    return `linear-gradient(0deg, ${palette.values
      .map((value) => value.value)
      .join(", ")})`;
  }, [
    ratios,
    colorKeys,
    lightness,
    saturation,
    contrast,
    neutralColorKeys,
    name,
  ]);

  return (
    <DialogRoot>
      <Button>
        {colorKeys.map((color, index) => (
          <ColorSwatch key={index} color={color} />
        ))}
        {name}
      </Button>
      <Dialog
        type="drawer"
        drawerProps={{ placement: "right" }}
        title={`${name.charAt(0).toUpperCase() + name.slice(1)} palette`}
      >
        <DialogBody className="flex flex-col">
          <p className="text-sm text-fg-muted">Color keys</p>
          <div className="flex items-center gap-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center">
                <FormControl
                  control={form.control}
                  name={`theme.colors.modes.${currentModeIndex}.scales.${scaleIndex}.colorKeys.${index}.color`}
                  render={({ onChange, ...props }) => {
                    return (
                      <ColorPickerRoot
                        onChange={(value) => {
                          onChange(value.toString("hex"));
                        }}
                        {...props}
                      >
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
          <p className="text-sm text-fg-muted">Ratios</p>
          <FormControl
            name={`theme.colors.modes.${currentModeIndex}.scales.${scaleIndex}.ratios`}
            control={form.control}
            render={(props) => (
              <div className="flex flex-1 items-start gap-4">
                <SliderRoot
                  orientation="vertical"
                  minValue={1}
                  maxValue={20}
                  step={0.05}
                  className="h-full"
                  {...props}
                >
                  <SliderTrack
                    className="w-40 rounded-sm"
                    style={{ background: dynamicGradient }}
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
                <div className="space-y-2">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <NumberField
                      key={index}
                      step={0.05}
                      minValue={1}
                      maxValue={20}
                      value={props.value[index]}
                      onChange={(val) =>
                        props.onChange(
                          props.value.map((ratio, i) => {
                            if (index === i) {
                              return val;
                            }
                            return ratio;
                          }),
                        )
                      }
                      className="w-20"
                    />
                  ))}
                </div>
              </div>
            )}
          />
        </DialogBody>
      </Dialog>
    </DialogRoot>
  );
}
