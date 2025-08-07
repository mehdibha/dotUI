"use client";

import React from "react";
import {
  ChevronsUpDownIcon,
  ContrastIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";

import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";
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

import { ThemeModeSwitch } from "@/components/theme-mode-switch";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { useStyleForm } from "@/modules/styles/providers/style-pages-provider";
import { ColorScale } from "./color-scale";
import { EditorSection } from "./editor-section";
import { ScaleEditor } from "./scale-editor";
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
  const { setActiveMode } = usePreferences();

  return (
    <div>
      <EditorSection title="Mode">
        <div className="mt-2 flex items-start justify-between">
          <ModeConfig />
          <Skeleton show={!isSuccess}>
            {form.watch("theme.colors.activeModes").join("-") ===
              "light-dark" && (
              <ThemeModeSwitch
                isSelected={resolvedMode === "light"}
                onChange={(isSelected) => {
                  setActiveMode(isSelected ? "light" : "dark");
                }}
              />
            )}
          </Skeleton>
        </div>
      </EditorSection>

      <EditorSection title="Color adjustments">
        <ColorAdjustments />
      </EditorSection>

      <EditorSection title="Base colors">
        <div className="mt-2 flex items-center gap-2">
          {baseColors.map((color) => {
            return (
              <Skeleton key={color.name} show={!isSuccess}>
                <ScaleEditor scaleId={color.name} />
              </Skeleton>
            );
          })}
        </div>
        <div className="mt-3 space-y-2">
          {baseColors.map((color) => {
            return <ColorScale key={color.name} scaleId={color.name} />;
          })}
        </div>
      </EditorSection>

      <EditorSection title="Semantic colors">
        <div className="mt-2 flex items-center gap-2">
          {semanticColors.map((color) => {
            return (
              <Skeleton key={color.name} show={!isSuccess}>
                <ScaleEditor scaleId={color.name} />
              </Skeleton>
            );
          })}
        </div>
        <div className="mt-3 space-y-2">
          {semanticColors.map((color) => {
            return <ColorScale key={color.name} scaleId={color.name} />;
          })}
        </div>
      </EditorSection>

      <EditorSection title="Tokens">
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
      </EditorSection>
    </div>
  );
}

const ModeConfig = () => {
  const { form, isSuccess } = useStyleForm();

  return (
    <Skeleton show={!isSuccess}>
      <FormControl
        control={form.control}
        name="theme.colors.activeModes"
        render={({ value, onChange, ...props }) => (
          <SelectRoot
            aria-label="Mode configuration"
            selectedKey={value.join("-")}
            onSelectionChange={(key) => {
              if (key === "light-dark") {
                onChange(["light", "dark"]);
              } else if (key === "light") {
                onChange(["light"]);
              } else if (key === "dark") {
                onChange(["dark"]);
              }
            }}
          >
            <Button suffix={<ChevronsUpDownIcon />}>
              <SelectValue />
            </Button>
            <Popover>
              <ListBox>
                <ListBoxItem id="light-dark" prefix={<ContrastIcon />}>
                  light/dark
                </ListBoxItem>
                <ListBoxItem id="light" prefix={<SunIcon />}>
                  light only
                </ListBoxItem>
                <ListBoxItem id="dark" prefix={<MoonIcon />}>
                  dark only
                </ListBoxItem>
              </ListBox>
            </Popover>
          </SelectRoot>
        )}
      />
    </Skeleton>
  );
};

const ColorAdjustments = () => {
  const { form, resolvedMode, isSuccess } = useStyleForm();

  return (
    <div className="mt-2 grid grid-cols-2 gap-3">
      <FormControl
        key={`theme.colors.modes.${resolvedMode}.lightness`}
        name={`theme.colors.modes.${resolvedMode}.lightness`}
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
                  <Skeleton show={!isSuccess}>{`${state.values[0]}%`}</Skeleton>
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
        key={`${resolvedMode}.saturation`}
        name={`theme.colors.modes.${resolvedMode}.saturation`}
        control={form.control}
        render={(props) => (
          <SliderRoot {...props} minValue={0} maxValue={100} className="w-full">
            <div className="flex items-center justify-between gap-2">
              <Label>Saturation</Label>
              <SliderValueLabel>
                {({ state }) => (
                  <Skeleton show={!isSuccess}>{`${state.values[0]}%`}</Skeleton>
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
        key={`${resolvedMode}.contrast`}
        name={`theme.colors.modes.${resolvedMode}.contrast`}
        control={form.control}
        render={(props) => (
          <SliderRoot {...props} minValue={0} maxValue={500} className="w-full">
            <div className="flex items-center justify-between gap-2">
              <Label>Contrast</Label>
              <SliderValueLabel>
                {({ state }) => (
                  <Skeleton show={!isSuccess}>{`${state.values[0]}%`}</Skeleton>
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
    </div>
  );
};
