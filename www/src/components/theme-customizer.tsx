"use client";

import { googleFonts } from "@/lib/fonts";
import { dotUIThemes } from "@/lib/themes";
import { useThemes } from "@/hooks/use-themes";
import { Button } from "@/registry/ui/default/core/button";
import { ColorPicker } from "@/registry/ui/default/core/color-picker";
import {
  DialogRootProps,
  DialogRoot,
  Dialog,
} from "@/registry/ui/default/core/dialog";
import { Label } from "@/registry/ui/default/core/field";
import { Heading } from "@/registry/ui/default/core/heading";
import { Item } from "@/registry/ui/default/core/list-box";
import { Select, SelectRoot } from "@/registry/ui/default/core/select";
import { Skeleton } from "@/registry/ui/default/core/skeleton";
import { Slider } from "@/registry/ui/default/core/slider";
import { Tag, TagGroup } from "@/registry/ui/default/core/tag-group/tag-group";

export const ThemeCustomizerDialog = ({
  children,
  ...props
}: DialogRootProps) => {
  const {
    themes: userThemes,
    fonts,
    handleFontChange,
    isLoading,
    currentTheme,
    isCurrentThemeEditable,
    mode,
    setMode,
    setCurrentThemeId,
    handleBaseColorChange,
    handleRadiusChange,
  } = useThemes();
  const themes = [...userThemes, ...dotUIThemes];
  return (
    <DialogRoot {...props}>
      {children}
      <Dialog
        title="Customize theme"
        description="Pick a style and color for your components."
        type="popover"
        placement="bottom start"
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <Skeleton show={isLoading}>
            <Select
              label="Theme"
              selectedKey={currentTheme.id}
              onSelectionChange={(key) => {
                setCurrentThemeId(key as string);
              }}
              size="sm"
              className="w-36 [&_button]:w-full"
            >
              {themes.map((theme) => (
                <Item key={theme.id} id={theme.id}>
                  {theme.name}
                </Item>
              ))}
            </Select>
            {!isLoading && isCurrentThemeEditable && <></>}
          </Skeleton>
          <Skeleton show={isLoading}>
            <TagGroup
              label="Mode"
              selectedKeys={[mode]}
              onSelectionChange={(keys) =>
                setMode([...keys][0] as "light" | "dark")
              }
              selectionMode="single"
              disallowEmptySelection
              className="w-32"
            >
              <Tag id="light" size="sm" className="flex-1">
                Light
              </Tag>
              <Tag id="dark" size="sm" className="flex-1">
                Dark
              </Tag>
            </TagGroup>
          </Skeleton>
        </div>
        <div className="space-y-2">
          <Label>Colors</Label>
          <div className="grid grid-cols-3 gap-2">
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
                  shape="rectangle"
                  size="sm"
                  value={colorBase.color}
                  onChange={(value) =>
                    handleBaseColorChange(colorBase.value, value.toString())
                  }
                  aria-label={colorBase.label}
                  className="px-0 text-xs font-semibold"
                  isDisabled={!isCurrentThemeEditable}
                >
                  <span className="truncate">{colorBase.label}</span>
                </ColorPicker>
              </Skeleton>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <Skeleton show={isLoading}>
            <Select
              label="Heading"
              selectedKey={fonts.heading}
              onSelectionChange={(key) => {
                handleFontChange("heading", key as string);
              }}
              size="sm"
              className="w-36 [&_button]:w-full"
              isDisabled={!isCurrentThemeEditable}
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
              size="sm"
              className="w-36 [&_button]:w-full"
              isDisabled={!isCurrentThemeEditable}
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
              label="Icon library"
              defaultSelectedKey="lucide"
              className="w-36 [&_button]:w-full"
              isDisabled={!isCurrentThemeEditable}
            >
              <Item id="lucide">Lucide icons</Item>
            </Select>
          </Skeleton>
          <Skeleton show={isLoading}>
            <Slider
              label="Radius (rem)"
              valueLabel
              minValue={0}
              maxValue={1.2}
              step={0.1}
              value={currentTheme.radius}
              onChange={(value) => {
                handleRadiusChange(value as number);
              }}
              isDisabled={!isCurrentThemeEditable}
              className="!w-36"
            />
          </Skeleton>
        </div>
      </Dialog>
    </DialogRoot>
  );
};
