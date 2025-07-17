"use client";

import React from "react";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  ContrastIcon,
  InfoIcon,
  MoonIcon,
  PencilIcon,
  SunIcon,
  XIcon,
} from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { $ZodArray } from "zod/v4/core";
import type { Key } from "react-aria-components";

import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";
import { DEFAULT_DARK_MODE, DEFAULT_LIGHT_MODE } from "@dotui/style-engine";
import { Button } from "@dotui/ui/components/button";
import { Dialog, DialogRoot } from "@dotui/ui/components/dialog";
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
import type { ModeDefinition } from "@dotui/style-engine";

import { AutoResizeTextField } from "@/components/auto-resize-input";
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

type ModeConfig = "light-only" | "dark-only" | "light-dark";

export function StyleColorsEditor() {
  const { form, resolvedMode, isSuccess } = useStyleForm();
  const { currentMode, setCurrentMode } = usePreferences();

  // TODO: support multiple themes in the future (e.g. light/dark/high-contrast/)
  const {
    fields: colorModes,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "theme.colors.modes",
  });

  const modesConfig: ModeConfig = React.useMemo(
    () =>
      colorModes.length > 1
        ? "light-dark"
        : colorModes[0]!.mode === "light"
          ? "light-only"
          : "dark-only",
    [colorModes],
  );

  const onModesConfigChange = React.useCallback(
    (key: Key | null) => {
      const targetMode = key as ModeConfig;

      const currentModes = new Set(colorModes.map((mode) => mode.mode));
      const modeConfigs: Record<
        ModeConfig,
        { required: ModeDefinition["mode"][]; remove: ModeDefinition["mode"][] }
      > = {
        "light-only": { required: ["light"], remove: ["dark"] },
        "dark-only": { required: ["dark"], remove: ["light"] },
        "light-dark": { required: ["light", "dark"], remove: [] },
      };

      const config = modeConfigs[targetMode];
      if (!config) return;

      const modesToAdd = config.required.filter(
        (mode) => !currentModes.has(mode),
      );
      const modesToRemove = config.remove.filter((mode) =>
        currentModes.has(mode),
      );

      modesToAdd.forEach((mode) => {
        const defaultMode =
          mode === "light" ? DEFAULT_LIGHT_MODE : DEFAULT_DARK_MODE;
        append(defaultMode);
      });

      modesToRemove.forEach((mode) => {
        const index = colorModes.findIndex((m) => m.mode === mode);
        if (index !== -1) remove(index);
      });
    },
    [append, remove, colorModes],
  );

  const currentModeIndex = colorModes.findIndex(
    (mode) => mode.mode === resolvedMode,
  );

  const colorScales = form.watch(
    `theme.colors.modes.${currentModeIndex}.scales`,
  );

  const neutralIndex = colorScales.findIndex((s) => s.id === "neutral");

  return (
    <div>
      <EditorSection title="Mode">
        <div className="mt-2 flex items-start justify-between">
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
        </div>
      </EditorSection>

      <EditorSection title="Color adjustments">
        <div className="mt-2 grid grid-cols-2 gap-3">
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
        </div>
      </EditorSection>

      <EditorSection title="Base colors">
        <div className="mt-2 flex items-center gap-2">
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
        </div>
      </EditorSection>

      <EditorSection title="Semantic colors">
        <div className="mt-2 flex items-center gap-2">
          {semanticColors.map((color) => {
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
          })}
        </div>
        <div className="mt-3 space-y-2">
          {semanticColors.map((color) => {
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
        </div>
      </EditorSection>

      <EditorSection title="Tokens">
        <Tokens />
      </EditorSection>
    </div>
  );
}

const Tokens = () => {
  const { form, isSuccess } = useStyleForm();

  const { fields: tokenFields } = useFieldArray({
    control: form.control,
    name: "theme.colors.tokens",
  });

  return (
    <Skeleton show={!isSuccess}>
      <TableRoot aria-label="Tokens" className="-mr-6 w-full">
        <TableHeader>
          <TableColumn id="name" isRowHeader className="pl-0">
            Variable name
          </TableColumn>
          <TableColumn id="value" className="pr-0">
            Value
          </TableColumn>
        </TableHeader>
        <TableBody>
          {tokenFields.map((token, index) => {
            const tokenId = form.watch(`theme.colors.tokens.${index}.id`);
            const tokenDef = COLOR_TOKENS.find((def) => def.name === tokenId);

            return (
              <TableRow key={token.id} id={index}>
                <TableCell className="pl-0.5">
                  <ColorTokenVariableName
                    index={index}
                    description={tokenDef?.description}
                  />
                </TableCell>
                <TableCell className="pr-0">
                  <ColorTokenValue index={index} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </TableRoot>
    </Skeleton>
  );
};

const ColorTokenVariableName = ({
  index,
  description,
}: {
  index: number;
  description?: string;
}) => {
  const { form } = useStyleForm();
  const [isEditMode, setEditMode] = React.useState(false);
  const [localValue, setLocalValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleEditStart = React.useCallback((initialValue: string) => {
    setLocalValue(initialValue);
    setEditMode(true);
  }, []);

  const handleCancel = React.useCallback(() => {
    setEditMode(false);
  }, []);

  const handleSubmit = React.useCallback(() => {
    form.setValue(`theme.colors.tokens.${index}.name`, localValue);
    setEditMode(false);
  }, [form, index, localValue]);

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

  return (
    <FormControl
      name={`theme.colors.tokens.${index}.name`}
      control={form.control}
      render={(props) => (
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-bg-muted p-1 pl-3">
            {isEditMode ? (
              <div ref={containerRef} className="flex items-center gap-1">
                <AutoResizeTextField
                  inputRef={inputRef}
                  autoFocus
                  className="font-mono text-xs"
                  value={localValue}
                  onChange={setLocalValue}
                />
                <div className="flex items-center gap-0.5">
                  <Button
                    aria-label="Save"
                    size="sm"
                    shape="circle"
                    variant="quiet"
                    onPress={handleSubmit}
                    className="size-6"
                  >
                    <CheckIcon className="text-fg-success" />
                  </Button>
                  <Button
                    aria-label="Cancel"
                    size="sm"
                    shape="circle"
                    variant="quiet"
                    onPress={handleCancel}
                    className="size-6"
                  >
                    <XIcon className="text-fg-danger" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <h1 className="truncate border-b font-mono text-xs whitespace-nowrap">
                  {props.value}
                </h1>
                <Button
                  size="sm"
                  shape="circle"
                  variant="quiet"
                  onPress={() => handleEditStart(props.value)}
                  className="size-6 [&_svg]:size-3"
                >
                  <PencilIcon className="text-fg-muted" />
                </Button>
              </div>
            )}
          </div>
          {description && (
            <DialogRoot>
              <Button
                size="sm"
                shape="circle"
                variant="quiet"
                className="size-6 [&_svg]:size-3"
              >
                <InfoIcon />
              </Button>
              <Dialog
                type="popover"
                popoverProps={{ placement: "top", className: "max-w-64" }}
              >
                <p className="text-sm">{description}</p>
              </Dialog>
            </DialogRoot>
          )}
        </div>
      )}
    />
  );
};

const ColorTokenValue = ({ index }: { index: number }) => {
  const { form } = useStyleForm();

  // const [color] = token.value
  //   .replace("var(--", "")
  //   .replace(")", "")
  //   .split("-") as [string, string];

  // const items = Array.from({ length: 10 }, (_, i) => ({
  //   label: `${color.charAt(0).toUpperCase() + color.slice(1)} ${(i + 1) * 100}`,
  //   value: `var(--${color}-${(i + 1) * 100})`,
  // }));

  return (
    <FormControl
      name={`theme.colors.tokens.${index}.value`}
      control={form.control}
      render={({ value, onChange, ...props }) => {
        const [color] = value
          .replace("var(--", "")
          .replace(")", "")
          .split("-") as [string, string];

        const items = Array.from({ length: 10 }, (_, i) => ({
          label: `${color.charAt(0).toUpperCase() + color.slice(1)} ${(i + 1) * 100}`,
          value: `var(--${color}-${(i + 1) * 100})`,
        }));

        return (
          <SelectRoot
            selectedKey={value}
            onSelectionChange={onChange}
            className="w-full"
            {...props}
          >
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
        );
      }}
    />
  );
};
