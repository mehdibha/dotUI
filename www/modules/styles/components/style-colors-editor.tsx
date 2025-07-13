"use client";

import {
  ChevronsUpDownIcon,
  ContrastIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { Button as AriaButton } from "react-aria-components";
import { useFieldArray } from "react-hook-form";

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
import { Tooltip } from "@dotui/ui/components/tooltip";

import { ThemeModeSwitch } from "@/components/theme-mode-switch";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { useStyleForm } from "@/modules/styles/providers/style-pages-provider";
import { EditorSection } from "./editor-section";
import { ColorKeys } from "./key-colors";

const baseColors = [
  { name: "neutral", label: "Neutral", color: "#000000" },
  { name: "accent", label: "Accent", color: "#0b36a3" },
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
          {currentModeIndex !== -1 &&
            baseColors.map((color) => (
              <Skeleton key={color.name} show={!isSuccess}>
                <ColorKeys
                  name={color.name}
                  currentModeIndex={currentModeIndex}
                  colorScale="baseScales"
                />
              </Skeleton>
            ))}
        </div>
        {/* <div className="mt-3 space-y-2">
          {baseColors.map((color) => (
            <div key={color.name} className="flex items-center gap-2">
              <p className="w-16 text-sm text-fg-muted">{color.label}</p>
              <div className="flex flex-1 items-center gap-1">
                {generatedTheme
                  .find((elem) => elem.name === color.name)
                  ?.values.map((color, index) => (
                    <Tooltip key={index} content={color.name} delay={0}>
                      <Skeleton show={!isSuccess} className="flex-1">
                        <AriaButton
                          className="h-8 flex-1 rounded-sm border"
                          style={{ backgroundColor: color.value }}
                        />
                      </Skeleton>
                    </Tooltip>
                  ))}
              </div>
            </div>
          ))}
        </div> */}
      </EditorSection>

      <EditorSection title="Semantic colors">
        <div className="mt-2 flex items-center gap-2">
          {currentModeIndex !== -1 &&
            semanticColors.map((color) => (
              <Skeleton key={color.name} show={!isSuccess}>
                <ColorKeys
                  name={color.name}
                  currentModeIndex={currentModeIndex}
                  colorScale="semanticScales"
                />
              </Skeleton>
            ))}
        </div>
        {/* <div className="mt-3 space-y-2">
          {semanticColors.map((color) => (
            <div key={color.name} className="flex items-center gap-2">
              <p className="w-16 text-sm text-fg-muted">{color.label}</p>
              <div className="flex flex-1 items-center gap-1">
                {generatedTheme
                  .find((elem) => elem.name === color.name)
                  ?.values.map((color, index) => (
                    <Tooltip
                      key={index}
                      content={`${color.name}-${(index + 1) * 100}`}
                      delay={0}
                    >
                      <Skeleton show={!isSuccess}>
                        <AriaButton
                          className="h-8 flex-1 rounded-sm border"
                          style={{
                            backgroundColor: color.value,
                          }}
                        />
                      </Skeleton>
                    </Tooltip>
                  ))}
              </div>
            </div>
          ))}
        </div> */}
      </EditorSection>

      {/* <EditorSection title="Tokens">
        <div className="mt-2 space-y-8">
          {Object.entries(tokensByCategory).map(
            ([category, categoryTokens]) => (
              <div key={category}>
                <h3 className="mb-3 text-sm font-medium text-fg-muted">
                  {tokenCategories[category as keyof typeof tokenCategories]}
                </h3>
                <Skeleton show={!isSuccess}>
                  <TableRoot
                    aria-label={`${tokenCategories[category as keyof typeof tokenCategories]} Tokens`}
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
                          <TableCell className="pl-0">{token.name}</TableCell>
                          <TableCell>{token.description}</TableCell>
                          <TableCell className="pr-0">
                            <SelectRoot defaultSelectedKey={token.value}>
                              <Button
                                size="sm"
                                suffix={
                                  <ChevronsUpDownIcon className="text-fg-muted" />
                                }
                                className="w-40"
                              >
                                <SelectValue />
                              </Button>
                              <Popover>
                                <ListBox items={token.items}>
                                  {(item) => (
                                    <ListBoxItem
                                      key={item.name}
                                      id={item.name}
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
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </TableRoot>
                </Skeleton>
              </div>
            ),
          )}
        </div>
      </EditorSection> */}
    </div>
  );
}

interface Token {
  name: string;
  value: string;
  description: string;
  items: {
    name: string;
    label: string;
    value: string;
  }[];
}

const tokenCategories = {
  background: "Backgrounds",
  foreground: "Foregrounds",
  border: "Borders",
} as const;

const colorCategories = ["background", "foreground", "border"] as const;

const tokensByCategory = Object.fromEntries(
  colorCategories.map((category) => [
    category,
    DESIGN_TOKENS.filter(
      (token) =>
        token.category === category &&
        token.name.startsWith("color") &&
        !token.name.includes("-fg-on") &&
        !token.name.includes("-hover") &&
        !token.name.includes("-active") &&
        !token.name.includes("-muted"),
    )
      .map((token) => {
        const match = /var\(--([a-z]+)-(\d+)\)/.exec(token.defaultValue);

        if (!match || !match[1] || !match[2]) {
          return null;
        }

        const baseColor = match[1];
        const shade = match[2];

        const items = Array.from({ length: 10 }, (_, index) => ({
          name: `${baseColor}-${(index + 1) * 100}`,
          label: `${baseColor.charAt(0).toUpperCase() + baseColor.slice(1)} ${(index + 1) * 100}`,
          value: `var(--${baseColor}-${(index + 1) * 100})`,
        }));

        return {
          name: token.name,
          value: `${baseColor}-${shade}`,
          description: token.description,
          items,
        };
      })
      .filter((token): token is Token => token !== null),
  ]),
);
