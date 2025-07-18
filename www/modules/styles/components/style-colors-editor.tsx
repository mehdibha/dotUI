"use client";

import React from "react";
import {
  ChevronsUpDownIcon,
  ContrastIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { useFieldArray } from "react-hook-form";
import type { Key } from "react-aria-components";

import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";
import { DEFAULT_DARK_MODE, DEFAULT_LIGHT_MODE } from "@dotui/style-engine";
import { Button } from "@dotui/ui/components/button";
import { Label } from "@dotui/ui/components/field";
import { FormControl } from "@dotui/ui/components/form";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Popover } from "@dotui/ui/components/popover";
import { SelectRoot, SelectValue } from "@dotui/ui/components/select";
import { Skeleton } from "@dotui/ui/components/skeleton";
import {
  SliderFiller,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  SliderValueLabel,
} from "@dotui/ui/components/slider";
import type { ModeDefinition } from "@dotui/style-engine";

import { ThemeModeSwitch } from "@/components/theme-mode-switch";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { useStyleForm } from "@/modules/styles/providers/style-pages-provider";
import { ColorScale } from "./color-scale";
import { EditorSection } from "./editor-section";
import { ColorKeys } from "./key-colors";
import { ColorTokens } from "./style-color-tokens";

const baseColors = [
  { name: "neutral", label: "Neutral" },
  { name: "accent", label: "Accent" },
] as const;

const semanticColors = [
  { name: "success", label: "Success", color: "#008000" },
  { name: "danger", label: "Danger", color: "#ff0000" },
  { name: "warning", label: "Warning", color: "#ffa500" },
  { name: "info", label: "Info", color: "#0000ff" },
] as const;

type ModeConfig = "light-only" | "dark-only" | "light-dark";

export function StyleColorsEditor() {
  const { form, resolvedMode, isSuccess } = useStyleForm();
  const { setCurrentMode } = usePreferences();

  // TODO: support multiple themes in the future (e.g. light/dark/high-contrast/)
  // const {
  //   fields: colorModes,
  //   append,
  //   remove,
  // } = useFieldArray({
  //   control: form.control,
  //   name: "theme.colors.modes",
  // });

  // const modesConfig: ModeConfig = React.useMemo(
  //   () =>
  //     colorModes.length > 1
  //       ? "light-dark"
  //       : colorModes[0]!.mode === "light"
  //         ? "light-only"
  //         : "dark-only",
  //   [colorModes],
  // );

  // const onModesConfigChange = React.useCallback(
  //   (key: Key | null) => {
  //     const targetMode = key as ModeConfig;

  //     const currentModes = new Set(colorModes.map((mode) => mode.mode));
  //     const modeConfigs: Record<
  //       ModeConfig,
  //       { required: ModeDefinition["mode"][]; remove: ModeDefinition["mode"][] }
  //     > = {
  //       "light-only": { required: ["light"], remove: ["dark"] },
  //       "dark-only": { required: ["dark"], remove: ["light"] },
  //       "light-dark": { required: ["light", "dark"], remove: [] },
  //     };

  //     const config = modeConfigs[targetMode];
  //     if (!config) return;

  //     const modesToAdd = config.required.filter(
  //       (mode) => !currentModes.has(mode),
  //     );
  //     const modesToRemove = config.remove.filter((mode) =>
  //       currentModes.has(mode),
  //     );

  //     modesToAdd.forEach((mode) => {
  //       const defaultMode =
  //         mode === "light" ? DEFAULT_LIGHT_MODE : DEFAULT_DARK_MODE;
  //       append(defaultMode);
  //     });

  //     modesToRemove.forEach((mode) => {
  //       const index = colorModes.findIndex((m) => m.mode === mode);
  //       if (index !== -1) remove(index);
  //     });
  //   },
  //   [append, remove, colorModes],
  // );

  // const currentModeIndex = colorModes.findIndex(
  //   (mode) => mode.mode === resolvedMode,
  // );

  // const colorScales = form.watch(
  //   `theme.colors.modes.${currentModeIndex}.scales`,
  // );

  // const neutralIndex = colorScales.findIndex((s) => s.id === "neutral");

  return (
    <div>
      <EditorSection title="Mode">
        {/* <div className="mt-2 flex items-start justify-between">
          <Skeleton show={!isSuccess}>
            {
              <SelectRoot
                aria-label="Mode configuration"
                selectedKey={modesConfig}
                onSelectionChange={onModesConfigChange}
              >
                <Button suffix={<ChevronsUpDownIcon />}>
                  <SelectValue />
                </Button>
                <Popover>
                  <ListBox>
                    <ListBoxItem id="light-dark" prefix={<ContrastIcon />}>
                      light/dark
                    </ListBoxItem>
                    <ListBoxItem id="light-only" prefix={<SunIcon />}>
                      light only
                    </ListBoxItem>
                    <ListBoxItem id="dark-only" prefix={<MoonIcon />}>
                      dark only
                    </ListBoxItem>
                  </ListBox>
                </Popover>
              </SelectRoot>
            }
          </Skeleton>
          <Skeleton show={!isSuccess}>
            {modesConfig === "light-dark" && (
              <ThemeModeSwitch
                isSelected={resolvedMode === "light"}
                onChange={(isSelected) => {
                  setCurrentMode(isSelected ? "light" : "dark");
                }}
              />
            )}
          </Skeleton>
        </div> */}
      </EditorSection>

      <EditorSection title="Color adjustments">
        {/* <div className="mt-2 grid grid-cols-2 gap-3">
          {currentModeIndex !== -1 && (
            <>
              <FormControl
                name={`theme.colors.modes.${currentModeIndex}.lightness`}
                control={form.control}
                render={(props) => (
                  <SliderRoot
                    {...props}
                    minValue={0}
                    maxValue={100}
                    className="col-span-2 w-full"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Label>Lightness</Label>
                      <SliderValueLabel>
                        {({ state }) => (
                          <Skeleton show={!isSuccess}>
                            {`${state.values[0]}%`}
                          </Skeleton>
                        )}
                      </SliderValueLabel>
                    </div>
                    <Skeleton show={!isSuccess}>
                      <SliderTrack>
                        <SliderFiller />
                        <SliderThumb />
                      </SliderTrack>
                    </Skeleton>
                  </SliderRoot>
                )}
              />
              <FormControl
                name={`theme.colors.modes.${currentModeIndex}.saturation`}
                control={form.control}
                render={(props) => (
                  <SliderRoot
                    {...props}
                    minValue={0}
                    maxValue={100}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Label>Saturation</Label>
                      <SliderValueLabel>
                        {({ state }) => (
                          <Skeleton show={!isSuccess}>
                            {`${state.values[0]}%`}
                          </Skeleton>
                        )}
                      </SliderValueLabel>
                    </div>
                    <Skeleton show={!isSuccess}>
                      <SliderTrack>
                        <SliderFiller />
                        <SliderThumb />
                      </SliderTrack>
                    </Skeleton>
                  </SliderRoot>
                )}
              />
              <FormControl
                name={`theme.colors.modes.${currentModeIndex}.contrast`}
                control={form.control}
                render={(props) => (
                  <SliderRoot
                    {...props}
                    minValue={0}
                    maxValue={500}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Label>Contrast</Label>
                      <SliderValueLabel>
                        {({ state }) => (
                          <Skeleton show={!isSuccess}>
                            {`${state.values[0]}%`}
                          </Skeleton>
                        )}
                      </SliderValueLabel>
                    </div>
                    <Skeleton show={!isSuccess}>
                      <SliderTrack>
                        <SliderFiller />
                        <SliderThumb />
                      </SliderTrack>
                    </Skeleton>
                  </SliderRoot>
                )}
              />
            </>
          )}
        </div> */}
      </EditorSection>

      <EditorSection title="Base colors">
        {/* <div className="mt-2 flex items-center gap-2">
          {baseColors.map((color) => {
            const scaleIndex = colorScales.findIndex(
              (s) => s.id === color.name,
            );

            const scale = colorScales[scaleIndex]!;

            return (
              <Skeleton key={scale.id} show={!isSuccess}>
                <ColorKeys
                  id={color.name}
                  name={scale.name as "neutral" | "accent"}
                  currentModeIndex={currentModeIndex}
                  neutralIndex={neutralIndex}
                  scaleIndex={scaleIndex}
                />
              </Skeleton>
            );
          })}
        </div>
        <div className="mt-3 space-y-2">
          {baseColors.map((color) => {
            const scaleIndex = colorScales.findIndex(
              (s) => s.id === color.name,
            );

            const scale = colorScales[scaleIndex]!;

            return (
              <ColorScale
                key={color.name}
                name={scale.name}
                label={color.label}
                scaleIndex={scaleIndex}
                neutralIndex={neutralIndex}
              />
            );
          })}
        </div> */}
      </EditorSection>

      <EditorSection title="Semantic colors">
        <div className="mt-2 flex items-center gap-2">
          {/* {semanticColors.map((color) => {
            const scaleIndex = colorScales.findIndex(
              (s) => s.id === color.name,
            );

            const scale = colorScales[scaleIndex]!;

            return (
              <Skeleton key={color.name} show={!isSuccess}>
                <ColorKeys
                  id={color.name}
                  name={scale.name}
                  currentModeIndex={currentModeIndex}
                  neutralIndex={neutralIndex}
                  scaleIndex={scaleIndex}
                />
              </Skeleton>
            );
          })} */}
        </div>
        <div className="mt-3 space-y-2">
          {/* {semanticColors.map((color) => {
            const scaleIndex = colorScales.findIndex(
              (s) => s.id === color.name,
            );

            const scale = colorScales[scaleIndex]!;

            return (
              <ColorScale
                key={color.name}
                name={scale.name}
                label={color.label}
                scaleIndex={scaleIndex}
                neutralIndex={neutralIndex}
              />
            );
          })} */}
        </div>
      </EditorSection>

      {/* <EditorSection title="Tokens">
        <div className="mt-3 space-y-4">
          {[
            {
              name: "Backgrounds",
              category: "background" as const,
            },
            {
              name: "Foregrounds",
              category: "foreground" as const,
            },
            {
              name: "Borders",
              category: "border" as const,
            },
          ].map(({ name, category }) => (
            <div key={name}>
              <h3 className="text-sm font-medium">{name}</h3>
              <ColorTokens
                tokenIds={COLOR_TOKENS.filter((tk) =>
                  tk.categories?.some((cat) => cat === category),
                ).map((tk) => tk.name)}
              />
            </div>
          ))}
        </div>
      </EditorSection> */}
    </div>
  );
}

const ModeConfig = () => {
  const { form, resolvedMode, isSuccess } = useStyleForm();

  const modes = form.watch("theme.colors.modes");
  const modeConfig = React.useMemo(() => {
    if (modes.light && modes.dark) return "light-dark";
    if (modes.light) return "light-only";
    return "dark-only";
  }, [modes]);

  const onModesConfigChange = React.useCallback(
    (key: Key | null) => {
      const targetMode = key as ModeConfig;

      switch (targetMode) {
        case "light-only":
          form.setValue("theme.colors.modes.light", DEFAULT_LIGHT_MODE);
          form.setValue("theme.colors.modes.dark", undefined);
          break;
        case "dark-only":
          form.setValue("theme.colors.modes.light", undefined);
          form.setValue("theme.colors.modes.dark", DEFAULT_DARK_MODE);
          break;
        case "light-dark":
          form.setValue("theme.colors.modes.light", DEFAULT_LIGHT_MODE);
          form.setValue("theme.colors.modes.dark", DEFAULT_DARK_MODE);
          break;
      }
    },
    [form],
  );

  return (
    <Skeleton show={!isSuccess}>
      {
        <SelectRoot
          aria-label="Mode configuration"
          selectedKey={modeConfig}
          onSelectionChange={onModesConfigChange}
        >
          <Button suffix={<ChevronsUpDownIcon />}>
            <SelectValue />
          </Button>
          <Popover>
            <ListBox>
              <ListBoxItem id="light-dark" prefix={<ContrastIcon />}>
                light/dark
              </ListBoxItem>
              <ListBoxItem id="light-only" prefix={<SunIcon />}>
                light only
              </ListBoxItem>
              <ListBoxItem id="dark-only" prefix={<MoonIcon />}>
                dark only
              </ListBoxItem>
            </ListBox>
          </Popover>
        </SelectRoot>
      }
    </Skeleton>
  );
};
