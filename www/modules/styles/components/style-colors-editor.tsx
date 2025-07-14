"use client";

import React from "react";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  InfoIcon,
  PencilIcon,
  XIcon,
} from "lucide-react";
import { useFieldArray } from "react-hook-form";

import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";
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
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const onDismiss = React.useCallback(() => {
    // form.resetField("name");
    setEditMode(false);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        inputRef.current
      ) {
        onDismiss();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onDismiss]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isEditMode) {
        onDismiss();
      }
    };
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isEditMode) {
        setEditMode(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleEnter);
    };
  }, [onDismiss, isEditMode]);

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
                  {...props}
                />
                <div className="flex items-center gap-0.5">
                  <Button
                    size="sm"
                    shape="circle"
                    variant="quiet"
                    onPress={() => setEditMode(false)}
                    className="size-6"
                  >
                    <CheckIcon className="text-fg-success" />
                  </Button>
                  <Button
                    size="sm"
                    shape="circle"
                    variant="quiet"
                    onPress={() => {
                      form.resetField(`theme.colors.tokens.${index}.name`);
                      setEditMode(false);
                    }}
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
                  onPress={() => setEditMode(true)}
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
