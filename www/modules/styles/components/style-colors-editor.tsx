"use client";

import React from "react";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  ContrastIcon,
  MoonIcon,
  SunIcon,
  XIcon,
} from "lucide-react";
import { Button as AriaButton } from "react-aria-components";
import { useFieldArray } from "react-hook-form";

import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";
import { DESIGN_TOKENS } from "@dotui/style-engine/constants";
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

import { ThemeModeSwitch } from "@/components/theme-mode-switch";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { useStyleForm } from "@/modules/styles/providers/style-pages-provider";
import { ColorScale } from "./color-scale";
import { EditorSection } from "./editor-section";
import { ColorKeys } from "./key-colors";

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

export function StyleColorsEditor() {
  const { form, isSuccess } = useStyleForm();
  const { currentMode, setCurrentMode } = usePreferences();

  // TODO: support multiple themes in the future (e.g. light/dark/high-contrast/)
  const { fields: colorModes } = useFieldArray({
    control: form.control,
    name: "theme.colors.modes",
  });

  const currentModeIndex = colorModes.findIndex(
    (mode) => mode.mode === currentMode,
  );

  const formTokens = form.watch("theme.colors.tokens");
  const tokens = Object.entries(
    formTokens as Record<string, { name: string; value: string }>,
  );
  // const tokens = Object.entries(formTokens).map(([name, value]) => {
  //   const registryToken = COLOR_TOKENS.find((token) => token.name === name);
  //   return {
  //     name,
  //     value: value,
  //     description: registryToken?.description || "",
  //     categories: registryToken?.categories || [],
  //     defaultValue: registryToken?.defaultValue || "",
  // //   }
  // });

  return (
    <div>
      <EditorSection title="Mode">
        <div className="mt-2 flex items-start justify-between">
          {/* <Skeleton show={!isSuccess}>
            <FormControl
              name="colors.mode."
              control={form.control}
              render={({ value, onChange, ...props }) => (
                <SelectRoot
                  selectedKey={value}
                  onSelectionChange={onChange}
                  {...props}
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
          </Skeleton> */}
          <Skeleton show={!isSuccess}>
            {colorModes.length > 1 && (
              <ThemeModeSwitch
                isSelected={currentMode === "light"}
                onChange={(isSelected) => {
                  setCurrentMode(isSelected ? "light" : "dark");
                }}
              />
            )}
          </Skeleton>
        </div>
      </EditorSection>

      <EditorSection title="Color adjustments">
        <div className="mt-2 grid grid-cols-2 gap-3">
          {currentModeIndex !== -1 && (
            <>
              <FormControl
                key={`${currentMode}-lightness`}
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
                key={`${currentMode}-saturation`}
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
                key={`${currentMode}-contrast`}
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
        </div>
      </EditorSection>

      <EditorSection title="Base colors">
        <div className="mt-2 flex items-center gap-2">
          {baseColors.map((color) => (
            <Skeleton key={color.name} show={!isSuccess}>
              <ColorKeys
                name={color.name}
                currentModeIndex={currentModeIndex}
              />
            </Skeleton>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {baseColors.map((color) => (
            <ColorScale
              key={color.name}
              name={color.name}
              label={color.label}
            />
          ))}
        </div>
      </EditorSection>

      <EditorSection title="Semantic colors">
        <div className="mt-2 flex items-center gap-2">
          {semanticColors.map((color) => (
            <Skeleton key={color.name} show={!isSuccess}>
              <ColorKeys
                name={color.name}
                currentModeIndex={currentModeIndex}
              />
            </Skeleton>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {semanticColors.map((color) => (
            <ColorScale
              key={color.name}
              name={color.name}
              label={color.label}
            />
          ))}
        </div>
      </EditorSection>

      <EditorSection title="Tokens">
        <div className="mt-2 space-y-8">
          {(
            [
              { label: "Backgrounds", name: "background" },
              { label: "Foregrounds", name: "foreground" },
              { label: "Borders", name: "border" },
            ] as const
          ).map((category) => {
            const categoryTokens = COLOR_TOKENS.filter((token) =>
              (token.categories as unknown as string[]).includes(category.name),
            ).map((token) => ({
              name: formTokens[token.name]
                .name as (typeof COLOR_TOKENS)[number]["name"],
              description: token.description,
              value: formTokens[token.name].value,
            }));

            if (categoryTokens.length === 0) return null;

            return (
              <div key={category.name}>
                <h3 className="mb-3 text-sm font-medium text-fg-muted">
                  {category.label}
                </h3>
                <Skeleton show={!isSuccess}>
                  <TableRoot
                    aria-label={`${category.label} Tokens`}
                    className="-mr-6 w-full"
                  >
                    <TableHeader>
                      <TableColumn id="name" isRowHeader className="pl-0">
                        Variable name
                      </TableColumn>
                      <TableColumn id="description">Description</TableColumn>
                      <TableColumn id="value" className="pr-0">
                        Value
                      </TableColumn>
                    </TableHeader>
                    <TableBody
                      items={categoryTokens.map((token) => ({
                        id: token.name,
                        ...token,
                      }))}
                    >
                      {(token) => (
                        <TableRow>
                          <TableCell className="pl-0">
                            <ColorTokenVariableName token={token} />
                          </TableCell>
                          {/* <TableCell>{token.description}</TableCell> */}
                          <TableCell>description</TableCell>
                          <TableCell className="pr-0">
                            <ColorTokenValue token={token} />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </TableRoot>
                </Skeleton>
              </div>
            );
          })}
        </div>
      </EditorSection>
    </div>
  );
}

const ColorTokenVariableName = ({
  token,
}: {
  token: { name: (typeof COLOR_TOKENS)[number]["name"]; value: string };
}) => {
  const { form } = useStyleForm();
  const [isEditMode, setEditMode] = React.useState(false);

  if (isEditMode) {
    return (
      <FormControl
        name={`theme.colors.tokens.${token.name}.name`}
        control={form.control}
        render={({ value, onChange, ...props }) => (
          <TextField
            size="sm"
            autoFocus
            value={value}
            onChange={onChange}
            {...props}
          />
        )}
      />
    );
  }

  return (
    <Button
      size="sm"
      className="font-mono text-xs"
      onClick={() => setEditMode(true)}
    >
      {token.name}
    </Button>
  );
};

const ColorTokenValue = ({
  token,
}: {
  token: { name: (typeof COLOR_TOKENS)[number]["name"]; value: string };
}) => {
  const { form } = useStyleForm();

  const [color] = token.value
    .replace("var(--", "")
    .replace(")", "")
    .split("-") as [string, string];

  const items = Array.from({ length: 10 }, (_, i) => ({
    label: `${color.charAt(0).toUpperCase() + color.slice(1)} ${(i + 1) * 100}`,
    value: `var(--${color}-${(i + 1) * 100})`,
  }));

  console.log({
    value: form.watch(`theme.colors.tokens.${token.name}.value`),
    items,
  });

  return (
    <FormControl
      name={`theme.colors.tokens.${token.name}.value`}
      control={form.control}
      render={({ value, onChange, ...props }) => (
        <SelectRoot selectedKey={value} onSelectionChange={onChange} {...props}>
          <Button
            size="sm"
            suffix={<ChevronsUpDownIcon className="text-fg-muted" />}
            className="w-40"
          >
            <SelectValue />
          </Button>
          <Popover>
            <ListBox items={items}>
              {(item) => (
                <ListBoxItem
                  key={item.name}
                  id={item.value}
                  className="flex items-center gap-2"
                  prefix={
                    <span
                      className="size-4 rounded-sm border"
                      style={{
                        backgroundColor: item.value,
                      }}
                    />
                  }
                >
                  {item.label}
                </ListBoxItem>
              )}
            </ListBox>
          </Popover>
        </SelectRoot>
      )}
    />
  );
};
