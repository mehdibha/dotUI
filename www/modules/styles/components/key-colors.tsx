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

import { SCALE_NUMBERRS } from "@dotui/style-engine/constants";
import { Badge } from "@dotui/ui/components/badge";
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
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRoot,
  TableRow,
} from "@dotui/ui/components/table";
import { Tooltip } from "@dotui/ui/components/tooltip";
import { cn } from "@dotui/ui/lib/utils";

import { getHighestWcagCompliance } from "@/lib/colors";
import { useStyleForm } from "@/modules/styles/providers/style-pages-provider";

export function ColorKeys({ scaleId }: { scaleId: string }) {
  const { form, resolvedMode } = useStyleForm();

  const name = form.watch(
    `theme.colors.modes.${resolvedMode}.scales.${scaleId}.name`,
  );

  const colorKeys = form
    .watch(`theme.colors.modes.${resolvedMode}.scales.${scaleId}.colorKeys`)
    .map((color) => color.color) as CssColor[];

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
          <ColorKeysEditor scaleId={scaleId} />
          <p className="text-sm text-fg-muted">Ratios</p>
          <div className="flex flex-1 items-start gap-4">
            <RatioSlider scaleId={scaleId} />
            <RatioTable scaleId={scaleId} />
          </div>
        </DialogBody>
      </Dialog>
    </DialogRoot>
  );
}

interface ColorKeysEditorProps {
  scaleId: string;
}

function ColorKeysEditor({ scaleId }: ColorKeysEditorProps) {
  const { form, resolvedMode } = useStyleForm();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `theme.colors.modes.${resolvedMode}.scales.${scaleId}.colorKeys`,
  });

  return (
    <div>
      <p className="text-sm text-fg-muted">Color keys</p>
      <div className="flex items-center gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center">
            <FormControl
              control={form.control}
              name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.colorKeys.${index}.color`}
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
    </div>
  );
}

interface RatioSliderProps {
  scaleId: string;
}

function RatioSlider({ scaleId }: RatioSliderProps) {
  const { form, resolvedMode } = useStyleForm();

  const name = form.watch(
    `theme.colors.modes.${resolvedMode}.scales.${scaleId}.name`,
  );
  const neutralColorKeys = form
    .watch(`theme.colors.modes.${resolvedMode}.scales.neutral.colorKeys`)
    .map((color) => color.color) as CssColor[];
  const colorKeys = form
    .watch(`theme.colors.modes.${resolvedMode}.scales.${scaleId}.colorKeys`)
    .map((color) => color.color) as CssColor[];
  const ratios = Array.from({ length: 19 }, (_, i) => i + 1);
  const lightness = form.watch(`theme.colors.modes.${resolvedMode}.lightness`);
  const saturation = form.watch(
    `theme.colors.modes.${resolvedMode}.saturation`,
  );
  const contrast =
    form.watch(`theme.colors.modes.${resolvedMode}.contrast`) / 100;

  const dynamicGradient = useMemo(() => {
    const neutral = new LeonardoBgColor({
      name: "neutral",
      colorKeys: neutralColorKeys,
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
    colorKeys,
    lightness,
    saturation,
    contrast,
    neutralColorKeys,
    ratios,
    name,
  ]);

  return (
    <FormControl
      name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.ratios`}
      control={form.control}
      render={(props) => (
        <SliderRoot
          aria-label="Ratios"
          orientation="vertical"
          minValue={1}
          maxValue={20}
          step={0.01}
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
      )}
    />
  );
}

interface RatioTableProps {
  scaleId: string;
}

function RatioTable({ scaleId }: RatioTableProps) {
  const { form, resolvedMode, generatedTheme } = useStyleForm();

  const generatedScale = generatedTheme.find(
    (scale) => scale.name === scaleId,
  )?.values;

  const scaleName = form.watch(
    `theme.colors.modes.${resolvedMode}.scales.${scaleId}.name`,
  );

  return (
    <div className="flex-1">
      <TableRoot aria-label="Color ratios" variant="line">
        <TableHeader>
          <TableColumn id="token" isRowHeader>
            Token
          </TableColumn>
          <TableColumn id="ratio">Ratio</TableColumn>
          <TableColumn id="wcag">WCAG</TableColumn>
        </TableHeader>
        <TableBody>
          {SCALE_NUMBERRS.map((scaleNameValue, index) => {
            return (
              <FormControl
                name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.ratios.${index}`}
                control={form.control}
                render={(props) => {
                  const requiredContrast = getWcagRequirement(index);
                  const meetsRequirement = requiredContrast
                    ? props.value >= requiredContrast
                    : null;
                  return (
                    <TableRow key={scaleNameValue}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ColorSwatch color={generatedScale?.[index]?.value} />
                          <span className="font-mono text-xs text-fg-muted">
                            {`${scaleName}-${scaleNameValue}`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <NumberField
                          aria-label={`${scaleName} ${scaleNameValue} ratio`}
                          step={0.05}
                          minValue={1}
                          maxValue={20}
                          className="w-20"
                          {...props}
                        />
                      </TableCell>
                      <TableCell>
                        {requiredContrast && (
                          <Badge
                            variant={meetsRequirement ? "success" : "danger"}
                            className="w-12 text-xs"
                          >
                            {requiredContrast}:1
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                }}
              />
            );
          })}
        </TableBody>
      </TableRoot>
    </div>
  );
}

const getWcagRequirement = (index: number) => {
  if (index === 5) return 3.0;
  if (index >= 6 && index <= 9) return 4.5;
  return null;
};
