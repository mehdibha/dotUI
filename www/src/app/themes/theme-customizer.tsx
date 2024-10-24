"use client";

import React from "react";
import { chain, mergeRefs } from "@react-aria/utils";
import { useControlledState } from "@react-stately/utils";
import {
  CheckIcon,
  CopyIcon,
  Edit2Icon,
  GitBranchIcon,
  XIcon,
} from "lucide-react";
import { Button as AriaButton } from "react-aria-components";
import {
  TextField as UnstyledTextField,
  Input as UnstyledInput,
} from "react-aria-components";
import { useThemes } from "@/hooks/use-themes";
import { Button } from "@/registry/ui/default/core/button";
import { ColorPicker } from "@/registry/ui/default/core/color-picker";
import { Label } from "@/registry/ui/default/core/field";
import { Form } from "@/registry/ui/default/core/form";
import { InputProps } from "@/registry/ui/default/core/input";
import { Link } from "@/registry/ui/default/core/link";
import { Item } from "@/registry/ui/default/core/list-box";
import { Progress } from "@/registry/ui/default/core/progress";
import { Select } from "@/registry/ui/default/core/select";
import { Skeleton } from "@/registry/ui/default/core/skeleton";
import { Slider } from "@/registry/ui/default/core/slider";
import { Tag, TagGroup } from "@/registry/ui/default/core/tag-group/tag-group";
import { Tooltip } from "@/registry/ui/default/core/tooltip";
import { cn } from "@/registry/ui/default/lib/cn";
import { BaseColor } from "@/types/theme";
import { CloneThemeDialog } from "./clone-theme";
import { usePreview } from "./context";
import { CopyThemeDialog } from "./copy-theme";

export const ThemeCustomizer = (
  props: React.HTMLAttributes<HTMLDivElement>
) => {
  const {
    isLoading,
    currentTheme,
    setThemeName,
    isCurrentThemeEditable,
    mode,
    setMode,
    handleBaseColorChange,
    handleColorConfigChange,
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
          <CloneThemeDialog>
            <Button variant="outline" prefix={<GitBranchIcon />}>
              Clone theme
            </Button>
          </CloneThemeDialog>
        </div>
      </div>
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
          <p className="text-fg-muted text-sm">
            You can generate color scales using these base colors.
          </p>
          <div className="mt-2 flex items-center gap-2">
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
              <Skeleton
                key={colorBase.value}
                show={isLoading}
                className="flex-1"
              >
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
                  onHoverStart={() => {
                    setPreview(`color-${colorBase.value}`);
                  }}
                  className="flex-1"
                >
                  {colorBase.label}
                </ColorPicker>
              </Skeleton>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-10">
          <Slider
            label="Lightness"
            value={currentTheme.colors[mode].lightness}
            onChange={(value) =>
              handleColorConfigChange("lightness", value as number)
            }
            className="!w-full"
          />
          <Slider
            label="Saturation"
            value={currentTheme.colors[mode].saturation}
            onChange={(value) =>
              handleColorConfigChange("saturation", value as number)
            }
            className="!w-full"
          />
        </div>
        <div>
          <Label>Scales</Label>
          <p className="text-fg-muted text-sm">
            There are 5 color scales in the color system. You can learn more
            about it{" "}
            <Link variant="quiet" href="/docs/getting-started/color-system">
              here
            </Link>
            .
          </p>
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
      <Section title="Typography" onHoverStart={() => setPreview("typography")}>
        <div className="grid grid-cols-2 gap-4">
          <Select
            className="[&_button]:w-full"
            defaultSelectedKey="Arial"
            label="Heading"
          >
            <Item id="Arial">Geist sans</Item>
          </Select>
          <Select
            label="Body"
            className="[&_button]:w-full"
            defaultSelectedKey="Arial"
          >
            <Item id="Arial">Inter</Item>
          </Select>
        </div>
      </Section>
      <div className="grid grid-cols-2 gap-4">
        <Section title="Icons" onHoverStart={() => setPreview("icons")}>
          <Select
            label="Icon library"
            className="[&_button]:w-full"
            defaultSelectedKey="lucide"
          >
            <Item id="lucide">Lucide icons</Item>
          </Select>
        </Section>
        <Section title="Borders" onHoverStart={() => setPreview("borders")}>
          <TagGroup
            label="Radius"
            selectionMode="single"
            defaultSelectedKeys={["0.5"]}
            disallowEmptySelection
            className="w-full"
          >
            {[0, 0.5, 0.75, 1].map((value) => (
              <Tag key={value} id={value.toString()} className="w-14">
                {value}
              </Tag>
            ))}
          </TagGroup>
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

  // Dismiss when edit mode when esc is pressed
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
  title,
  children,
  className,
  wrapperClassName,
  onHoverStart,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
  onHoverStart?: () => void;
}) => {
  return (
    <div className={cn("", wrapperClassName)} onMouseEnter={onHoverStart}>
      {/* <h3 className="font-heading text-pretty text-xl font-semibold">
        {title}
      </h3> */}
      <div className={cn("mt-3 space-y-4", className)}>{children}</div>
    </div>
  );
};

const ColorScale = ({ label, value }: { label: string; value: BaseColor }) => {
  const { currentTheme, mode } = useThemes();
  const shades = currentTheme.colors[mode][value].shades;
  return (
    <div className="flex flex-row gap-2 xl:flex-row xl:items-center">
      <div className="w-[60px]">
        <p className="text-xs font-semibold">{label}</p>
      </div>
      <ul className="grid w-full grid-cols-10 gap-2">
        {shades.map((color, index) => (
          <li key={index} className="col-span-1 h-10">
            <Tooltip content={`${value}-${index * 100}`}>
              <AriaButton
                className="h-full w-full rounded-md border"
                style={{
                  backgroundColor: color,
                }}
              />
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
      () => {
        // Do nothing
      }
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
