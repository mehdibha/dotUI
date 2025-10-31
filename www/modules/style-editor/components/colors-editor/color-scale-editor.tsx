"use client";

import type React from "react";
import { useMemo } from "react";
import {
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import { useStore } from "@tanstack/react-form";
import { PlusIcon, Trash2Icon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { SCALE_STEPS } from "@dotui/registry/style-system/constants";
import { toColorString } from "@dotui/registry/style-system/core";
import { Badge } from "@dotui/registry/ui/badge";
import { Button } from "@dotui/registry/ui/button";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import {
  ColorPicker,
  ColorPickerContent,
  ColorPickerTrigger,
} from "@dotui/registry/ui/color-picker";
import { ColorEditor } from "@dotui/registry/ui/color-editor";
import { SliderControl } from "@dotui/registry/ui/slider";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Drawer } from "@dotui/registry/ui/drawer";
import { Skeleton } from "@dotui/registry/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@dotui/registry/ui/table";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";
import type { ScaleId } from "@dotui/registry/style-system/types";

import { ON_CHANGE_DEBOUNCE_MS } from "@/modules/style-editor/constants";
import {
  useStyleEditorForm,
  useSyncTheme,
} from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { useResolvedModeState } from "@/modules/style-editor/hooks/use-resolved-mode";
import { useDraftStyle } from "../../atoms/draft-style-atom";

export function ColorScaleEditor({ scaleId }: { scaleId: ScaleId }) {
  const form = useStyleEditorForm();
  const { resolvedMode } = useResolvedModeState();
  const { isPending } = useEditorStyle();

  return (
    <Dialog>
      <Skeleton show={isPending}>
        <Button>
          <form.Subscribe
            selector={(state) =>
              state.values.theme.colors.modes[resolvedMode].scales[scaleId]
                .colorKeys
            }
          >
            {(colorKeys) =>
              colorKeys.map((color, index) => (
                <ColorSwatch key={index} color={color} />
              ))
            }
          </form.Subscribe>
          <form.Subscribe
            selector={(state) =>
              state.values.theme.colors.modes[resolvedMode].scales[scaleId].name
            }
          >
            {(name) => name.charAt(0).toUpperCase() + name.slice(1)}
          </form.Subscribe>
        </Button>
      </Skeleton>
      <Drawer placement="left">
        <DialogContent className="min-w-72 !pb-0">
          <DialogHeader className="mb-1">
            <ScaleNameEditor scaleId={scaleId} />
          </DialogHeader>
          <DialogBody className="flex flex-col pb-4">
            <ColorKeysEditor scaleId={scaleId} />
            <RatiosEditor scaleId={scaleId} />
          </DialogBody>
        </DialogContent>
      </Drawer>
    </Dialog>
  );
}

function ScaleNameEditor({ scaleId }: { scaleId: ScaleId }) {
  const form = useStyleEditorForm();
  const { resolvedMode } = useResolvedModeState();

  return (
    <DialogHeading>
      <form.Subscribe
        selector={(state) =>
          state.values.theme.colors.modes[resolvedMode].scales[scaleId].name
        }
      >
        {(name) => `${name} scale`}
      </form.Subscribe>
    </DialogHeading>
  );

  // return (
  //   <form.AppField
  //     name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.name`}
  //   >
  //     {(field) => (
  //       <EditableInput
  //         as={DialogHeading}
  //         value={field.state.value}
  //         onSubmit={(newVal) => field.handleChange(newVal as any)}
  //       />
  //     )}
  //   </form.AppField>
  // );
}

function ColorKeysEditor({ scaleId }: { scaleId: ScaleId }) {
  const form = useStyleEditorForm();
  const { resolvedMode } = useResolvedModeState();
  const syncTheme = useSyncTheme();
  const { saveDraft } = useDraftStyle();

  return (
    <div>
      <p className="text-sm text-fg-muted">Color keys</p>
      <div className="mt-2 flex items-center gap-2">
        <form.AppField
          name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.colorKeys`}
        >
          {(field) => {
            return (
              <div className="flex flex-wrap items-center gap-2">
                {field.state.value.map((_, i) => {
                  return (
                    <form.AppField
                      key={i}
                      name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.colorKeys[${i}]`}
                      listeners={{
                        onChange: () => {
                          syncTheme();
                          saveDraft();
                        },
                        onChangeDebounceMs: ON_CHANGE_DEBOUNCE_MS,
                      }}
                    >
                      {(subField) => (
                        <div className="flex items-center">
                          <subField.ColorPicker>
                            <ColorPickerTrigger
                              className={cn(i > 0 && "rounded-r-none")}
                            >
                              <ColorSwatch />
                            </ColorPickerTrigger>
                            <ColorPickerContent>
                              <ColorEditor />
                            </ColorPickerContent>
                          </subField.ColorPicker>
                          {i > 0 && (
                            <Button
                              className="rounded-l-none border-l-0"
                              onPress={() => {
                                field.removeValue(i);
                              }}
                            >
                              <Trash2Icon />
                            </Button>
                          )}
                        </div>
                      )}
                    </form.AppField>
                  );
                })}
                <Tooltip>
                  <Button
                    onPress={() => {
                      field.pushValue("#000000");
                    }}
                  >
                    <PlusIcon />
                  </Button>
                  <TooltipContent>Add color</TooltipContent>
                </Tooltip>
              </div>
            );
          }}
        </form.AppField>
      </div>
    </div>
  );
}

function RatiosEditor({ scaleId }: { scaleId: ScaleId }) {
  const form = useStyleEditorForm();
  const { resolvedMode } = useResolvedModeState();
  const syncTheme = useSyncTheme();
  const { saveDraft } = useDraftStyle();
  const dynamicGradient = useDynamicGradient(scaleId);

  useStore(
    form.store,
    (state) =>
      state.values.theme.colors.modes[resolvedMode].scales[scaleId].ratios,
  );

  return (
    <div className="flex-1">
      <p className="text-sm text-fg-muted">Contrast ratios</p>
      <div className="flex items-stretch gap-4">
        {/* Contrast ratios slider */}
        <form.AppField
          mode="array"
          name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.ratios`}
          listeners={{
            onChange: () => {
              syncTheme();
              saveDraft();
            },
            onChangeDebounceMs: ON_CHANGE_DEBOUNCE_MS,
          }}
        >
          {(field) => (
            <field.Slider
              aria-label="Ratios"
              orientation="vertical"
              minValue={1}
              maxValue={16}
              step={0.05}
              className="h-auto [&_[data-slot='slider-filler']]:hidden [&_[data-slot='slider-thumb']]:size-3 [&_[data-slot='slider-thumb']]:dragging:size-4 [&_[data-slot='slider-track']]:w-40 [&_[data-slot='slider-track']]:rounded-sm [&_[data-slot='slider-track']]:[background:var(--dynamic-gradient)]"
              style={
                {
                  "--dynamic-gradient": dynamicGradient,
                } as React.CSSProperties
              }
            >
              <SliderControl />
            </field.Slider>
          )}
        </form.AppField>
        {/* Contrast ratios table */}
        <form.AppField
          mode="array"
          name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.ratios`}
        >
          {(field) => {
            return (
              <Table aria-label="Color ratios">
                <TableHeader>
                  <TableColumn id="token" isRowHeader>
                    Token
                  </TableColumn>
                  <TableColumn id="ratio">Ratio</TableColumn>
                  <TableColumn id="wcag">WCAG</TableColumn>
                </TableHeader>
                <TableBody>
                  {field.state.value.map((_, i) => {
                    const step = SCALE_STEPS[i];
                    const requiredContrast = getWcagRequirement(i);
                    return (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-fg-muted">
                              {`${scaleId}-${step}`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <form.AppField
                            name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.ratios[${i}]`}
                            listeners={{
                              onChange: () => {
                                syncTheme();
                                saveDraft();
                              },
                              onChangeDebounceMs: ON_CHANGE_DEBOUNCE_MS,
                            }}
                          >
                            {(subField) => (
                              <subField.NumberField
                                aria-label={`${scaleId}-${step} contrast ratio`}
                                step={0.01}
                                minValue={1}
                                maxValue={20}
                                className="w-20"
                              />
                            )}
                          </form.AppField>
                        </TableCell>
                        <TableCell>
                          {requiredContrast && (
                            <form.Subscribe
                              selector={(state) =>
                                state.values.theme.colors.modes[resolvedMode]
                                  .scales[scaleId].ratios[i]
                              }
                            >
                              {(ratio) =>
                                ratio && (
                                  <Badge
                                    variant={
                                      ratio > requiredContrast
                                        ? "success"
                                        : "danger"
                                    }
                                    className="w-12 text-xs"
                                  >
                                    {requiredContrast}:1
                                  </Badge>
                                )
                              }
                            </form.Subscribe>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            );
          }}
        </form.AppField>
      </div>
    </div>
  );
}

const useDynamicGradient = (scaleId: ScaleId) => {
  const form = useStyleEditorForm();
  const { resolvedMode } = useResolvedModeState();

  const [neutralColorKeys, colorKeys, lightness, saturation, contrast] =
    useStore(form.store, (state) => [
      state.values.theme.colors.modes[resolvedMode].scales.neutral.colorKeys,
      state.values.theme.colors.modes[resolvedMode].scales[scaleId].colorKeys,
      state.values.theme.colors.modes[resolvedMode].lightness,
      state.values.theme.colors.modes[resolvedMode].saturation,
      state.values.theme.colors.modes[resolvedMode].contrast,
    ]);

  const ratios = Array.from({ length: 15 }, (_, i) => i + 1);

  const dynamicGradient = useMemo(() => {
    const neutral = new LeonardoBgColor({
      name: "neutral",
      colorKeys: neutralColorKeys.map((color) => toColorString(color)),
      ratios,
    });

    const currentColor = new LeonardoColor({
      name: scaleId,
      colorKeys: colorKeys.map((color) => toColorString(color)),
      ratios,
    });

    const theme = new LeonardoTheme({
      backgroundColor: neutral,
      colors: [currentColor],
      lightness,
      saturation,
      contrast: contrast / 100,
      output: "HEX",
    });

    const palette = theme.contrastColors[1]!;

    return `linear-gradient(0deg, ${palette.values
      .map((value) => value.value)
      .join(", ")})`;
  }, [
    scaleId,
    neutralColorKeys,
    ratios,
    colorKeys,
    lightness,
    saturation,
    contrast,
  ]);

  return dynamicGradient;
};

const getWcagRequirement = (index: number) => {
  if (index === 5) return 3.0;
  if (index >= 6 && index <= 9) return 4.5;
  return null;
};
