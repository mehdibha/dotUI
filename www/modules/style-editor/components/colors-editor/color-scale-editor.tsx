"use client";

import React, { useMemo } from "react";
import {
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import { useStore } from "@tanstack/react-form";
import {
  CheckIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { parseColor } from "react-aria-components";
import { useFieldArray, useWatch } from "react-hook-form";
import type { CssColor } from "@adobe/leonardo-contrast-colors";

import { SCALE_NUMBERRS, SCALE_STEPS } from "@dotui/style-engine/constants";
import { createColorScales } from "@dotui/style-engine/core";
import { Badge } from "@dotui/ui/components/badge";
import { Button } from "@dotui/ui/components/button";
import {
  ColorPicker,
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
import { Skeleton } from "@dotui/ui/components/skeleton";
import {
  Slider,
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
import { TextField } from "@dotui/ui/components/text-field";
import { Tooltip } from "@dotui/ui/components/tooltip";
import { cn } from "@dotui/ui/lib/utils";

import { AutoResizeTextField } from "@/components/ui/auto-resize-input";
import { EditableInput } from "@/components/ui/editable-input";
import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { useResolvedModeState } from "@/modules/style-editor/hooks/use-resolved-mode";

type ScaleId = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

export function ColorScaleEditor({ scaleId }: { scaleId: ScaleId }) {
  const form = useStyleEditorForm();
  const { resolvedMode } = useResolvedModeState();
  const { isPending } = useEditorStyle();

  // const name = useWatch({
  //   control: form.control,
  //   name: `theme.colors.modes.${resolvedMode}.scales.${scaleId}.name`,
  // });

  // const colorKeys = useWatch({
  //   control: form.control,
  //   name: `theme.colors.modes.${resolvedMode}.scales.${scaleId}.colorKeys`,
  // });

  return (
    <DialogRoot>
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
                <ColorSwatch key={index} color={color.color} />
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
      <Dialog
        type="drawer"
        drawerProps={{ placement: "left", className: "min-w-72" }}
        className="!pb-0"
      >
        <DialogHeader>
          <ScaleNameEditor scaleId={scaleId} />
        </DialogHeader>
        <DialogBody className="flex flex-col pb-4">
          <ColorKeysEditor scaleId={scaleId} />
          <RatiosEditor scaleId={scaleId} />
        </DialogBody>
      </Dialog>
    </DialogRoot>
  );
}

function ScaleNameEditor({ scaleId }: { scaleId: ScaleId }) {
  const form = useStyleEditorForm();
  const { resolvedMode } = useResolvedModeState();

  return (
    <form.AppField
      name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.name`}
    >
      {(field) => (
        <EditableInput
          value={field.state.value}
          onSubmit={(newVal) => field.handleChange(newVal as any)}
        />
      )}
    </form.AppField>
  );
}

interface ColorKeysEditorProps {
  scaleId: string;
}

function ColorKeysEditor({ scaleId }: ColorKeysEditorProps) {
  const form = useStyleEditorForm();
  const { resolvedMode } = useResolvedModeState();

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
                      name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.colorKeys.${i}.color`}
                    >
                      {(subField) => (
                        <div className="flex items-center">
                          <subField.ColorPicker
                            shape="square"
                            showValue={false}
                            className={cn(i > 0 && "rounded-r-none")}
                          />
                          {i > 0 && (
                            <Button
                              shape="square"
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
                <Tooltip content="Add color">
                  <Button
                    shape="square"
                    onPress={() => {
                      field.pushValue({
                        id: field.state.value.length,
                        color: "#000000",
                      });
                    }}
                  >
                    <PlusIcon />
                  </Button>
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

  const dynamicGradient = useDynamicGradient(scaleId);

  return (
    <div className="flex-1">
      <p className="text-fg-muted text-sm">Contrast ratios</p>
      <form.Subscribe
        selector={(state) =>
          state.values.theme.colors.modes[resolvedMode].scales[scaleId].ratios
        }
      >
        {(ratios) => {
          return (
            <div>
              {ratios.map((ratio, index) => (
                <span key={index}>{ratio}, </span>
              ))}
            </div>
          );
        }}
      </form.Subscribe>
      <div className="flex items-stretch gap-4">
        <form.Subscribe
          selector={(state) =>
            state.values.theme.colors.modes[resolvedMode].scales[scaleId].ratios
          }
        >
          <form.AppField
            mode="array"
            name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.ratios`}
          >
            {(field) => {
              return (
                <field.Slider
                  aria-label="Ratios"
                  orientation="vertical"
                  minValue={1}
                  maxValue={16}
                  step={0.05}
                  showValueLabel={false}
                  className="[&_[data-slot='slider-thumb']]:dragging:size-4 h-auto [&_[data-slot='slider-filler']]:hidden [&_[data-slot='slider-thumb']]:size-3 [&_[data-slot='slider-track']]:w-40 [&_[data-slot='slider-track']]:rounded-sm [&_[data-slot='slider-track']]:[background:var(--dynamic-gradient)]"
                  style={
                    {
                      "--dynamic-gradient": dynamicGradient,
                    } as React.CSSProperties
                  }
                />
              );
            }}
          </form.AppField>
        </form.Subscribe>
        <form.AppField
          mode="array"
          name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.ratios`}
        >
          {(field) => {
            return (
              <TableRoot aria-label="Color ratios" variant="line">
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
                            <span className="text-fg-muted font-mono text-xs">
                              {`${scaleId}-${step}`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <form.AppField
                            name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.ratios.${i}`}
                          >
                            {(subField) => (
                              <subField.NumberField
                                aria-label={`${field.state.value.name}-${step} contrast ratio`}
                                step={0.05}
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
              </TableRoot>
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
      colorKeys: neutralColorKeys.map((color) => color.color) as CssColor[],
      ratios,
    });

    const currentColor = new LeonardoColor({
      name: scaleId,
      colorKeys: colorKeys.map((color) => color.color) as CssColor[],
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

//  interface RatioSliderProps {
//   scaleId: string;
// }

// function RatioSlider({ scaleId }: RatioSliderProps) {
//   const form = useStyleEditorForm();
//   const { resolvedMode } = useResolvedModeState();

//   const name = useWatch({
//     control: form.control,
//     name: `theme.colors.modes.${resolvedMode}.scales.${scaleId}.name`,
//   });

//   const neutralColorKeys = useWatch({
//     control: form.control,
//     name: `theme.colors.modes.${resolvedMode}.scales.neutral.colorKeys`,
//   }).map((color) => color.color) as CssColor[];
//   const colorKeys = useWatch({
//     control: form.control,
//     name: `theme.colors.modes.${resolvedMode}.scales.${scaleId}.colorKeys`,
//   }).map((color) => color.color) as CssColor[];
//   const ratios = Array.from({ length: 19 }, (_, i) => i + 1);
//   const lightness = useWatch({
//     control: form.control,
//     name: `theme.colors.modes.${resolvedMode}.lightness`,
//   });
//   const saturation = useWatch({
//     control: form.control,
//     name: `theme.colors.modes.${resolvedMode}.saturation`,
//   });
//   const contrast = useWatch({
//     control: form.control,
//     name: `theme.colors.modes.${resolvedMode}.contrast`,
//   });

//   const dynamicGradient = useMemo(() => {
//     const neutral = new LeonardoBgColor({
//       name: "neutral",
//       colorKeys: neutralColorKeys,
//       ratios,
//     });

//     const currentColor = new LeonardoColor({
//       name,
//       colorKeys,
//       ratios,
//     });

//     const theme = new LeonardoTheme({
//       backgroundColor: neutral,
//       colors: [currentColor],
//       lightness,
//       saturation,
//       contrast: contrast / 100,
//       output: "HEX",
//     });

//     const palette = theme.contrastColors[1]!;

//     return `linear-gradient(0deg, ${palette.values
//       .map((value) => value.value)
//       .join(", ")})`;
//   }, [
//     neutralColorKeys,
//     ratios,
//     name,
//     colorKeys,
//     lightness,
//     saturation,
//     contrast,
//   ]);

//   return (
//     <FormControl
//       name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.ratios`}
//       control={form.control}
//       render={(props) => (
//         <SliderRoot
//           aria-label="Ratios"
//           orientation="vertical"
//           minValue={1}
//           maxValue={20}
//           step={0.05}
//           className="h-full"
//           {...props}
//         >
//           <SliderTrack
//             className="w-40 rounded-sm"
//             style={{ background: dynamicGradient }}
//           >
//             {({ state }) => (
//               <>
//                 {state.values.map((_, i) => (
//                   <SliderThumb
//                     key={i}
//                     index={i}
//                     className="dragging:size-3 size-2"
//                   />
//                 ))}
//               </>
//             )}
//           </SliderTrack>
//         </SliderRoot>
//       )}
//     />
//   );
// }

// interface RatioTableProps {
//   scaleId: string;
// }

// function RatioTable({ scaleId }: RatioTableProps) {
//   const form = useStyleEditorForm();
//   const { resolvedMode } = useResolvedModeState();

//   const currentModeDefinition = useWatch({
//     name: `theme.colors.modes.${resolvedMode}`,
//     control: form.control,
//   });

//   const generatedTheme = React.useMemo(() => {
//     const theme = createColorScales(currentModeDefinition);
//     return theme;
//   }, [currentModeDefinition]);

//   const generatedScale = generatedTheme.find(
//     (scale) => scale.name === scaleId,
//   )?.values;

//   const scaleName = useWatch({
//     control: form.control,
//     name: `theme.colors.modes.${resolvedMode}.scales.${scaleId}.name`,
//   });

//   return (
//     <div className="flex-1">
//       <TableRoot aria-label="Color ratios" variant="line">
//         <TableHeader>
//           <TableColumn id="token" isRowHeader>
//             Token
//           </TableColumn>
//           <TableColumn id="ratio">Ratio</TableColumn>
//           <TableColumn id="wcag">WCAG</TableColumn>
//         </TableHeader>
//         <TableBody>
//           {SCALE_NUMBERRS.map((scaleNameValue, index) => {
//             return (
//               <FormControl
//                 key={index}
//                 name={`theme.colors.modes.${resolvedMode}.scales.${scaleId}.ratios.${index}`}
//                 control={form.control}
//                 render={(props) => {
//                   const requiredContrast = getWcagRequirement(index);
//                   const meetsRequirement = requiredContrast
//                     ? props.value >= requiredContrast
//                     : null;
//                   return (
//                     <TableRow key={scaleNameValue}>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           <ColorSwatch color={generatedScale?.[index]?.value} />
//                           <span className="text-fg-muted font-mono text-xs">
//                             {`${scaleName}-${scaleNameValue}`}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <NumberField
//                           aria-label={`${scaleName} ${scaleNameValue} ratio`}
//                           step={0.05}
//                           minValue={1}
//                           maxValue={20}
//                           className="w-20"
//                           {...props}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         {requiredContrast && (
//                           <Badge
//                             variant={meetsRequirement ? "success" : "danger"}
//                             className="w-12 text-xs"
//                           >
//                             {requiredContrast}:1
//                           </Badge>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 }}
//               />
//             );
//           })}
//         </TableBody>
//       </TableRoot>
//     </div>
//   );
// }

const getWcagRequirement = (index: number) => {
  if (index === 5) return 3.0;
  if (index >= 6 && index <= 9) return 4.5;
  return null;
};
