"use client";

import React from "react";
import { chain, mergeRefs } from "@react-aria/utils";
import { useControlledState } from "@react-stately/utils";
import {
  CheckIcon,
  CopyIcon,
  Edit2Icon,
  GitBranchIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { Button as AriaButton } from "react-aria-components";
import {
  TextField as UnstyledTextField,
  Input as UnstyledInput,
} from "react-aria-components";
import { googleFonts } from "@/lib/fonts";
import { useThemes } from "@/hooks/use-themes";
import { Alert } from "@/registry/ui/default/core/alert";
import { Button } from "@/registry/ui/default/core/button";
import { ColorPicker } from "@/registry/ui/default/core/color-picker";
import { Label } from "@/registry/ui/default/core/field";
import { Form } from "@/registry/ui/default/core/form";
import { InputProps } from "@/registry/ui/default/core/input";
import { Item } from "@/registry/ui/default/core/list-box";
import { Menu, MenuItem, MenuRoot } from "@/registry/ui/default/core/menu";
import { Select } from "@/registry/ui/default/core/select";
import { Skeleton } from "@/registry/ui/default/core/skeleton";
import { Slider } from "@/registry/ui/default/core/slider";
import { Tag, TagGroup } from "@/registry/ui/default/core/tag-group/tag-group";
import { Tooltip } from "@/registry/ui/default/core/tooltip";
import { cn } from "@/registry/ui/default/lib/cn";
import { BaseColor } from "@/types/theme";
import { CloneThemeDialog } from "./components/clone-theme";
import { usePreview } from "./components/context";
import { CopyThemeDialog } from "./components/copy-theme";

export const ThemeCustomizer = (
  props: React.HTMLAttributes<HTMLDivElement>
) => {
  const {
    fonts,
    handleFontChange,
    isLoading,
    currentTheme,
    setThemeName,
    isCurrentThemeEditable,
    mode,
    setMode,
    handleBaseColorChange,
    handleColorConfigChange,
    handleRadiusChange,
  } = useThemes();
  const { setPreview } = usePreview();

  return (
    <div {...props} className={cn("space-y-6", props.className)}>
      <div className="flex items-center justify-between border-b pb-2">
        <Skeleton show={isLoading}>
          <ThemeName
            currentName={currentTheme.name}
            setCurrentName={setThemeName}
            isEditable={isCurrentThemeEditable}
          />
        </Skeleton>
        <div className="flex items-center gap-2">
          <CopyThemeDialog>
            <Button variant="outline" prefix={<CopyIcon />}>
              Copy code
            </Button>
          </CopyThemeDialog>
          <MenuRoot>
            <Button shape="square" variant="outline">
              <MoreHorizontalIcon />
            </Button>
            <Menu placement="bottom end">
              <CloneThemeDialog>
                <MenuItem prefix={<GitBranchIcon />}>Clone theme</MenuItem>
              </CloneThemeDialog>
              <MenuItem prefix={<Trash2Icon />} variant="danger">
                Delete theme
              </MenuItem>
            </Menu>
          </MenuRoot>
        </div>
      </div>
      {!isLoading && !isCurrentThemeEditable && (
        <Alert
          action={
            <CloneThemeDialog>
              <Button variant="outline" prefix={<GitBranchIcon />}>
                Clone theme
              </Button>
            </CloneThemeDialog>
          }
        >
          To adjust, preview and generate color palette, fonts, radius and more,
          you need to clone the theme.
        </Alert>
      )}
      <Section title="Colors">
        <Skeleton show={isLoading}>
          <TagGroup
            label="Mode"
            selectedKeys={[mode]}
            onSelectionChange={(keys) =>
              setMode([...keys][0] as "light" | "dark")
            }
            selectionMode="single"
            disallowEmptySelection
            className="mt-2"
          >
            <Tag id="light">Light</Tag>
            <Tag id="dark">Dark</Tag>
          </TagGroup>
        </Skeleton>
        <div>
          <Label>Base colors</Label>
          <div className="mt-2 grid grid-cols-3 gap-2 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5">
            {(
              [
                {
                  label: "Neutral",
                  value: "neutral",
                  color: currentTheme.colors[mode].neutral.baseColor,
                },
                {
                  label: "Success",
                  value: "success",
                  color: currentTheme.colors[mode].success.baseColor,
                },
                {
                  label: "Warning",
                  value: "warning",
                  color: currentTheme.colors[mode].warning.baseColor,
                },
                {
                  label: "Danger",
                  value: "danger",
                  color: currentTheme.colors[mode].danger.baseColor,
                },
                {
                  label: "Accent",
                  value: "accent",
                  color: currentTheme.colors[mode].accent.baseColor,
                },
              ] as const
            ).map((colorBase) => (
              <Skeleton key={colorBase.value} show={isLoading}>
                <ColorPicker
                  variant="outline"
                  size="sm"
                  shape="rectangle"
                  value={colorBase.color}
                  onChange={(value) =>
                    handleBaseColorChange(colorBase.value, value.toString())
                  }
                  aria-label={colorBase.label}
                  onOpenChange={() => {
                    setPreview(`color-${colorBase.value}`);
                  }}
                  isDisabled={!isCurrentThemeEditable}
                >
                  <span className="truncate">{colorBase.label}</span>
                </ColorPicker>
              </Skeleton>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <Skeleton show={isLoading}>
            <Slider
              label="Lightness"
              valueLabel
              value={currentTheme.colors[mode].lightness}
              onChange={(value) =>
                handleColorConfigChange("lightness", value as number)
              }
              isDisabled={!isCurrentThemeEditable}
              size="sm"
              className="!w-full"
            />
          </Skeleton>
          <Skeleton show={isLoading}>
            <Slider
              label="Saturation"
              size="sm"
              valueLabel
              value={currentTheme.colors[mode].saturation}
              onChange={(value) =>
                handleColorConfigChange("saturation", value as number)
              }
              isDisabled={!isCurrentThemeEditable}
              className="!w-full"
            />
          </Skeleton>
        </div>
        <div>
          <Label>Scales</Label>
          <div className="mt-3 flex flex-col gap-2">
            {(
              [
                { label: "Neutral", value: "neutral" },
                { label: "Success", value: "success" },
                { label: "Warning", value: "warning" },
                { label: "Danger", value: "danger" },
                { label: "Accent", value: "accent" },
              ] as const
            ).map((colorBase) => (
              <ColorScale key={colorBase.value} {...colorBase} />
            ))}
          </div>
        </div>
      </Section>
      <Section title="Typography">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton show={isLoading}>
            <Select
              label="Heading"
              selectedKey={fonts.heading}
              onSelectionChange={(key) => {
                handleFontChange("heading", key as string);
              }}
              onOpenChange={(isOpen) => {
                if (isOpen) {
                  setPreview("typography");
                }
              }}
              isDisabled={!isCurrentThemeEditable}
              className="[&_button]:w-full"
            >
              {googleFonts.map((font) => (
                <Item key={font.id} id={font.id}>
                  {font.name}
                </Item>
              ))}
            </Select>
          </Skeleton>
          <Skeleton show={isLoading}>
            <Select
              label="Body"
              selectedKey={fonts.body}
              onSelectionChange={(key) => {
                handleFontChange("body", key as string);
              }}
              onOpenChange={(isOpen) => {
                if (isOpen) {
                  setPreview("typography");
                }
              }}
              isDisabled={!isCurrentThemeEditable}
              className="[&_button]:w-full"
            >
              {googleFonts.map((font) => (
                <Item key={font.id} id={font.id}>
                  {font.name}
                </Item>
              ))}
            </Select>
          </Skeleton>
        </div>
      </Section>
      <Section title="Icons">
        <Skeleton show={isLoading} className="w-[calc(50%-theme(spacing.2))]">
          <Select
            label="Icon library"
            className="[&_button]:w-[calc(50%-theme(spacing.2))]"
            defaultSelectedKey="lucide"
            onOpenChange={(isOpen) => {
              if (isOpen) {
                setPreview("icons");
              }
            }}
            isDisabled={!isCurrentThemeEditable}
          >
            <Item id="lucide">Lucide icons</Item>
          </Select>
        </Skeleton>
      </Section>
      <Section title="Borders">
        <Skeleton show={isLoading} className="w-[calc(50%-theme(spacing.2))]">
          <Slider
            label="Radius (rem)"
            valueLabel
            className="!w-[calc(50%-theme(spacing.2))]"
            minValue={0}
            maxValue={1.2}
            step={0.1}
            value={currentTheme.radius}
            onChange={(value) => {
              setPreview("borders");
              handleRadiusChange(value as number);
            }}
            isDisabled={!isCurrentThemeEditable}
          />
        </Skeleton>
      </Section>
    </div>
  );
};

const ThemeName = ({
  currentName,
  setCurrentName,
  isEditable,
}: {
  currentName: string;
  setCurrentName: (value: string) => void;
  isEditable: boolean;
}) => {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>(currentName);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onDismiss = React.useCallback(() => {
    setEditMode(false);
    setInputValue(currentName);
  }, [currentName]);

  const onSave = React.useCallback(() => {
    setCurrentName(inputValue);
    setEditMode(false);
  }, [inputValue, setCurrentName]);

  const onEdit = () => {
    setEditMode(true);
    setInputValue(currentName);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        onDismiss();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onDismiss]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && editMode) {
        onDismiss();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onDismiss, editMode]);

  if (!isEditable) {
    return (
      <h2 className="font-heading pb-px text-2xl font-semibold">
        {currentName}
      </h2>
    );
  }

  return (
    <Form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        onSave();
      }}
      className="flex items-center gap-2"
    >
      {editMode ? (
        <>
          <UnstyledTextField value={inputValue} onChange={setInputValue}>
            <AutoResizeInput
              ref={inputRef}
              className="font-heading w-auto text-2xl font-semibold"
            />
          </UnstyledTextField>
          <div className="flex items-center gap-1">
            <Button
              type="submit"
              variant="quiet"
              size="sm"
              shape="square"
              className="[&_svg]:text-fg-success size-7 [&_svg]:size-3.5"
            >
              <CheckIcon />
            </Button>
            <Button
              variant="quiet"
              size="sm"
              shape="square"
              className="[&_svg]:text-fg-danger size-7 [&_svg]:size-3.5"
              onPress={onDismiss}
            >
              <XIcon />
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2 className="font-heading pb-px text-2xl font-semibold">
            {currentName}
          </h2>
          <Button
            variant="quiet"
            size="sm"
            shape="square"
            className="[&_svg]:text-fg-muted size-7 [&_svg]:size-3.5"
            onPress={onEdit}
          >
            <Edit2Icon />
          </Button>
        </>
      )}
    </Form>
  );
};

const Section = ({
  children,
  className,
  wrapperClassName,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
}) => {
  return (
    <div className={cn("", wrapperClassName)}>
      <div className={cn("mt-0 space-y-4", className)}>{children}</div>
    </div>
  );
};

const ColorScale = ({ label, value }: { label: string; value: BaseColor }) => {
  const { currentTheme, mode, isLoading } = useThemes();
  const shades = currentTheme.colors[mode][value].shades;
  return (
    <div className="flex flex-row gap-2 xl:flex-row xl:items-center">
      <div className="w-[60px]">
        <p className="text-xs font-semibold">{label}</p>
      </div>
      <ul className="grid w-full grid-cols-10 gap-2">
        {shades.map((color, index) => (
          <li key={index} className="col-span-1 h-10">
            <Tooltip content={`${value}-${(index + 1) * 100}`}>
              <Skeleton show={isLoading} className="h-full w-full">
                <AriaButton
                  className="h-full w-full rounded-md border"
                  style={{
                    backgroundColor: color,
                  }}
                />
              </Skeleton>
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AutoResizeInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ onChange, className, ...props }, forwardedRef) => {
    const [inputValue, setInputValue] = useControlledState(
      props.value,
      props.defaultValue ?? "",
      () => {}
    );
    const inputRef = React.useRef<HTMLInputElement>(null);

    const onWidthChange = React.useCallback(() => {
      if (inputRef.current) {
        const input = inputRef.current;
        input.style.width = "0";
        input.style.width = `${input.scrollWidth}px`;
      }
    }, [inputRef]);

    React.useLayoutEffect(() => {
      if (inputRef.current) {
        onWidthChange();
      }
    }, [onWidthChange, inputValue, inputRef]);

    return (
      <UnstyledInput
        ref={mergeRefs(inputRef, forwardedRef)}
        onChange={chain(onChange, setInputValue)}
        className={cn(
          "border-fg min-w-[10px] focus:border-b focus:outline-none",
          className
        )}
        {...props}
      />
    );
  }
);
AutoResizeInput.displayName = "AutoResizeInput";
