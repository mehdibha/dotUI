"use client";

import { useMemo } from "react";
import {
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import { useStore } from "@tanstack/react-form";
import { PlusIcon, Trash2Icon } from "lucide-react";
import type React from "react";

import { cn } from "@dotui/registry/lib/utils";
import { Badge } from "@dotui/registry/ui/badge";
import { Button } from "@dotui/registry/ui/button";
import { ColorEditor } from "@dotui/registry/ui/color-editor";
import {
  ColorPickerContent,
  ColorPickerTrigger,
} from "@dotui/registry/ui/color-picker";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Drawer } from "@dotui/registry/ui/drawer";
import { SliderControl } from "@dotui/registry/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@dotui/registry/ui/table";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";
import { SCALE_STEPS, toColorString } from "@dotui/style-system/core";
import type { ScaleId } from "@dotui/style-system/types";

import { ON_CHANGE_DEBOUNCE_MS } from "@/modules/style-editor/constants";
import {
  useStyleEditorForm,
  useSyncTheme,
} from "@/modules/style-editor/style-editor-provider";
import { useResolvedModeState } from "@/modules/style-editor/use-resolved-mode";

import { useDraftStyle } from "../draft-style-atom";

export function ColorScaleEditor({ scaleId }: { scaleId: ScaleId }) {
  const form = useStyleEditorForm();
  const { resolvedMode } = useResolvedModeState();

  return (
    <Dialog>
      <Button aspect="default">
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
      <Drawer placement="left">
        <DialogContent>
          <DialogHeader>
            <DialogHeading>
              <ScaleName scaleId={scaleId} />
            </DialogHeading>
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

function ScaleName({ scaleId }: { scaleId: ScaleId }) {
  const form = useStyleEditorForm();
  const { resolvedMode } = useResolvedModeState();

  return (
    <form.Subscribe
      selector={(state) =>
        state.values.theme.colors.modes[resolvedMode].scales[scaleId].name
      }
    >
      {(name) => `${name} scale`}
    </form.Subscribe>
  );
}

function ColorKeysEditor({ scaleId }: { scaleId: ScaleId }) {
  const form = useStyleEditorForm();
  const { resolvedMode } = useResolvedModeState();
  const syncTheme = useSyncTheme();
  const { saveDraft } = useDraftStyle();

  return (
    <div>
      <p className="text-fg-muted text-sm">Color keys</p>
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
      <p className="text-fg-muted text-sm">Contrast ratios</p>
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
              className="h-auto [&_[data-slot='slider-filler']]:hidden [&_[data-slot='slider-thumb']]:dragging:size-4 [&_[data-slot='slider-thumb']]:size-3 [&_[data-slot='slider-track']]:w-40 [&_[data-slot='slider-track']]:rounded-sm [&_[data-slot='slider-track']]:[background:var(--dynamic-gradient)]"
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
                            <span className="font-mono text-fg-muted text-xs">
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
