"use client";

import React, { useMemo } from "react";
import {
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import {
  CheckIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { Reorder } from "motion/react";
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
import {
  Dialog,
  DialogBody,
  DialogHeader,
  DialogHeading,
  DialogRoot,
} from "@dotui/ui/components/dialog";
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

import { AutoResizeTextField } from "@/components/auto-resize-input";
import { useStyleForm } from "@/modules/styles/providers/style-editor-provider";

export function ScaleEditor({ scaleId }: { scaleId: string }) {
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
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </Button>
      <Dialog type="drawer" drawerProps={{ placement: "right" }}>
        <DialogHeader>
          <ScaleNameEditor scaleId={scaleId} />
        </DialogHeader>
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

interface ScaleNameEditorProps {
  scaleId: string;
}

function ScaleNameEditor({ scaleId }: ScaleNameEditorProps) {
  const { form, resolvedMode } = useStyleForm();
  const value = form.watch(
    `theme.colors.modes.${resolvedMode}.scales.${scaleId}.name`,
  );

  const [isEditMode, setEditMode] = React.useState(false);
  const [localValue, setLocalValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleEditStart = React.useCallback(() => {
    setLocalValue(value);
    setEditMode(true);
  }, [value]);

  const handleSubmit = React.useCallback(() => {
    form.setValue(
      `theme.colors.modes.${resolvedMode}.scales.${scaleId}.name`,
      localValue,
      {
        shouldDirty: true,
        shouldTouch: true,
      },
    );
    setEditMode(false);
  }, [form, localValue, resolvedMode, scaleId]);

  const handleCancel = React.useCallback(() => {
    setEditMode(false);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        inputRef.current &&
        isEditMode
      ) {
        handleCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleCancel, isEditMode]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isEditMode) {
        handleCancel();
      }
    };
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isEditMode) {
        handleSubmit();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleEnter);
    };
  }, [handleCancel, handleSubmit, isEditMode]);

  if (isEditMode) {
    return (
      <div ref={containerRef} className="flex items-center gap-2">
        <AutoResizeTextField
          aria-label="Scale name"
          inputRef={inputRef}
          autoFocus
          className="text-xl leading-none font-semibold"
          value={localValue}
          onChange={setLocalValue}
        />
        <Button
          aria-label="Save"
          size="sm"
          shape="square"
          variant="quiet"
          className="size-6"
          onPress={handleSubmit}
        >
          <CheckIcon className="text-fg-success" />
        </Button>
        <Button
          aria-label="Cancel"
          size="sm"
          shape="square"
          variant="quiet"
          className="size-6"
          onPress={handleCancel}
        >
          <XIcon className="text-fg-danger" />
        </Button>
      </div>
    );
  }

  return (
    <FormControl
      name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.name`}
      control={form.control}
      render={(props) => (
        <div className="flex items-center gap-2">
          <DialogHeading className="text-xl leading-none font-semibold">
            {props.value}
          </DialogHeading>
          <Button
            aria-label="Edit scale name"
            size="sm"
            variant="quiet"
            shape="square"
            className="size-6 text-fg-muted [&_svg]:size-3"
            onPress={() => handleEditStart()}
          >
            <PencilIcon />
          </Button>
        </div>
      )}
    />
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
      <div className="mt-2 flex items-center gap-2">
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
                key={index}
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
