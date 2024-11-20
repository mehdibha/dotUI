"use client";

import React from "react";
import { Button as AriaButton } from "react-aria-components";
import { useThemes } from "@/hooks/use-themes";
import {
  ColorEditor,
  ColorPicker,
  ColorPickerRoot,
} from "@/registry/ui/default/core/color-picker";
import { ColorSwatch } from "@/registry/ui/default/core/color-swatch";
import { Dialog, DialogRoot } from "@/registry/ui/default/core/dialog";
import { Label } from "@/registry/ui/default/core/field";
import { Skeleton } from "@/registry/ui/default/core/skeleton";
import { Slider } from "@/registry/ui/default/core/slider";
import { Tag, TagGroup } from "@/registry/ui/default/core/tag-group/tag-group";
import { Tooltip } from "@/registry/ui/default/core/tooltip";
import { cn } from "@/registry/ui/default/lib/cn";
import { focusRing } from "@/registry/ui/default/lib/focus-styles";
import { BaseColor } from "@/types/theme";
import { usePreview } from "./context";

export const Colors = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const {
    isLoading,
    currentTheme,
    isCurrentThemeEditable,
    mode,
    setMode,
    handleBaseColorChange,
    handleColorConfigChange,
  } = useThemes();
  const { setPreview } = usePreview();

  return (
    <div {...props} className={cn("space-y-6", props.className)}>
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
        <div className="mt-2 flex flex-wrap gap-2">
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
