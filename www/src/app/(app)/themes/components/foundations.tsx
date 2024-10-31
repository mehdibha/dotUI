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
import { dotUIThemes } from "@/lib/themes";
import { useThemes } from "@/hooks/use-themes";
import { Alert } from "@/registry/ui/default/core/alert";
import { Button } from "@/registry/ui/default/core/button";
import {
  ColorEditor,
  ColorPicker,
  ColorPickerRoot,
} from "@/registry/ui/default/core/color-picker";
import { ColorSwatch } from "@/registry/ui/default/core/color-swatch";
import { Dialog, DialogRoot } from "@/registry/ui/default/core/dialog";
import { Label } from "@/registry/ui/default/core/field";
import { Form } from "@/registry/ui/default/core/form";
import { InputProps } from "@/registry/ui/default/core/input";
import { Kbd } from "@/registry/ui/default/core/kbd";
import { Item } from "@/registry/ui/default/core/list-box";
import { Menu, MenuItem, MenuRoot } from "@/registry/ui/default/core/menu";
import { Select } from "@/registry/ui/default/core/select";
import { Skeleton } from "@/registry/ui/default/core/skeleton";
import {
  Slider,
  SliderFiller,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  SliderValueLabel,
} from "@/registry/ui/default/core/slider";
import { Tag, TagGroup } from "@/registry/ui/default/core/tag-group/tag-group";
import { Tooltip } from "@/registry/ui/default/core/tooltip";
import { cn } from "@/registry/ui/default/lib/cn";
import { focusRing } from "@/registry/ui/default/lib/focus-styles";
import { BaseColor } from "@/types/theme";
import { CloneThemeDialog } from "./clone-theme";
import { usePreview } from "./context";
import { CopyThemeDialog } from "./copy-theme";
import { DeleteThemeDialog } from "./delete-theme";

export const Foundations = (
  props: React.HTMLAttributes<HTMLDivElement>
) => {
  const {
    themes: userThemes,
    fonts,
    handleFontChange,
    isLoading,
    currentTheme,
    setThemeName,
    setCurrentThemeId,
    isCurrentThemeEditable,
    mode,
    setMode,
    handleBaseColorChange,
    handleColorConfigChange,
    handleRadiusChange,
    showKeyboardHint,
    setShowKeyboardHint,
  } = useThemes();
  const { setPreview } = usePreview();
  const [isCloneDialogOpen, setIsCloneDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // Themes keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;

      const themes = [...dotUIThemes, ...userThemes];
      const themesCount = themes.length;
      const currentIndex = themes.findIndex(
        (theme) => theme.id === currentTheme.id
      );

      if (e.key === "ArrowRight") {
        const nextIndex = (currentIndex + 1) % themesCount;
        const nextTheme = themes[nextIndex];
        if (nextTheme) {
          setCurrentThemeId(nextTheme.id);
          setShowKeyboardHint(false);
        }
      } else if (e.key === "ArrowLeft") {
        const prevIndex =
          currentIndex === 0 ? themesCount - 1 : currentIndex - 1;
        const prevTheme = themes[prevIndex];
        if (prevTheme) {
          setCurrentThemeId(prevTheme.id);
          setShowKeyboardHint(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTheme.id, userThemes, setCurrentThemeId, setShowKeyboardHint]);

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
            <Button prefix={<CopyIcon />}>Copy code</Button>
          </CopyThemeDialog>
          <MenuRoot>
            <Button shape="square">
              <MoreHorizontalIcon />
            </Button>
            <Menu placement="bottom end">
              <MenuItem
                prefix={<GitBranchIcon />}
                onAction={() => {
                  setIsCloneDialogOpen(true);
                }}
              >
                Clone theme
              </MenuItem>
              {isCurrentThemeEditable && (
                <MenuItem
                  prefix={<Trash2Icon />}
                  variant="danger"
                  onAction={() => {
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  Delete theme
                </MenuItem>
              )}
            </Menu>
          </MenuRoot>
          <CloneThemeDialog
            isOpen={isCloneDialogOpen}
            onOpenChange={setIsCloneDialogOpen}
          />
          <DeleteThemeDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          />
        </div>
      </div>
      {!isLoading && showKeyboardHint && (
        <Alert
          fill
          action={
            <Button
              variant="quiet"
              size="sm"
              shape="square"
              onPress={() => setShowKeyboardHint(false)}
            >
              <XIcon />
            </Button>
          }
          className="[&_kbd]:text-xs"
        >
          Use <Kbd>Ctrl</Kbd> + <Kbd>→</Kbd> or <Kbd>←</Kbd> to navigate between
          themes
        </Alert>
      )}
      {!isLoading && !isCurrentThemeEditable && (
        <Alert
          action={
            <CloneThemeDialog>
              <Button prefix={<GitBranchIcon />}>Clone theme</Button>
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
            size="sm"
          >
            <Tag id="light" className="px-4">
              Light
            </Tag>
            <Tag id="dark" className="px-4">
              Dark
            </Tag>
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
                  size="sm"
                  shape="rectangle"
                  value={colorBase.color}
                  onChange={(value) =>
                    handleBaseColorChange(colorBase.value, value.toString())
                  }
                  aria-label={colorBase.label}
                  onOpenChange={(isOpen) => {
                    setPreview(isOpen ? `color-${colorBase.value}` : null);
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
              valueLabel={(value) => `${value[0]}%`}
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
              valueLabel={(value) => `${value[0]}%`}
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
                setPreview(isOpen ? "typography" : null);
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
                setPreview(isOpen ? "typography" : null);
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
      <div className="grid grid-cols-2 items-center gap-4">
        <Section title="Icons">
          <Skeleton show={isLoading}>
            <Select
              label="Icon library"
              defaultSelectedKey="lucide"
              onOpenChange={(isOpen) => {
                setPreview(isOpen ? "icons" : null);
              }}
              isDisabled={!isCurrentThemeEditable}
              className="[&_button]:w-full"
            >
              <Item id="lucide">Lucide icons</Item>
            </Select>
          </Skeleton>
        </Section>
        <Section title="Borders">
          <Skeleton show={isLoading}>
            <SliderRoot
              minValue={0}
              maxValue={1.2}
              step={0.1}
              value={currentTheme.radius}
              onChange={(value) => {
                handleRadiusChange(value as number);
              }}
              isDisabled={!isCurrentThemeEditable}
              className="!w-full"
            >
              <div className="flex items-center justify-between">
                <Label>Radius (rem)</Label>
                <SliderValueLabel />
              </div>
              <div>
                <SliderTrack>
                  <SliderFiller />
                  <SliderThumb
                    onFocusChange={(isFocused) => {
                      setPreview(isFocused ? "borders" : null);
                    }}
                  />
                </SliderTrack>
              </div>
            </SliderRoot>
          </Skeleton>
        </Section>
      </div>
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
          <li key={index} className="relative col-span-1 h-10 overflow-hidden">
            <Tooltip content={`${value}-${(index + 1) * 100}: ${color}`}>
              <Skeleton show={isLoading} className="h-full w-full">
                <ColorPickerRoot value={color}>
                  <DialogRoot>
                    <AriaButton
                      className={cn(focusRing(), "h-full w-full rounded-md")}
                    >
                      <ColorSwatch className="size-full rounded-[inherit]" />
                    </AriaButton>
                    <Dialog type="popover" mobileType="drawer">
                      <ColorEditor className="mx-auto" />
                    </Dialog>
                  </DialogRoot>
                </ColorPickerRoot>
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
