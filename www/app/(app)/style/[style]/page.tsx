"use client";

import {
  ChevronsUpDownIcon,
  ContrastIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { Button as AriaButton } from "react-aria-components";

import { DESIGN_TOKENS } from "@dotui/style-engine/constants";
import { Button } from "@dotui/ui/components/button";
import { ColorPicker } from "@dotui/ui/components/color-picker";
import { ColorSwatch } from "@dotui/ui/components/color-swatch";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Popover } from "@dotui/ui/components/popover";
import { SelectRoot, SelectValue } from "@dotui/ui/components/select";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { Slider } from "@dotui/ui/components/slider";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRoot,
  TableRow,
} from "@dotui/ui/components/table";
import { Tooltip } from "@dotui/ui/components/tooltip";

import { usePreviewContext } from "@/components/preview";
import { ThemeModeSwitch } from "@/components/theme-mode-switch";
import { useMounted } from "@/hooks/use-mounted";

const baseColors = [
  { name: "neutral", label: "Neutral", color: "#000000" },
  { name: "accent", label: "Accent", color: "#0b36a3" },
];

const semanticColors = [
  { name: "success", label: "Success", color: "#008000" },
  { name: "danger", label: "Danger", color: "#ff0000" },
  { name: "warning", label: "Warning", color: "#ffa500" },
  { name: "info", label: "Info", color: "#0000ff" },
];

export default function ColorsPage() {
  const isMounted = useMounted();
  const { isAnimating } = usePreviewContext();

  return (
    <div>
      <p className="text-base font-semibold">Mode</p>
      <div className="mt-2 flex items-start justify-between">
        <SelectRoot defaultSelectedKey="light-dark">
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
        <ThemeModeSwitch />
      </div>
      <p className="mt-6 text-base font-semibold">Color adjustments</p>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <Slider
          label="Lightness"
          getValueLabel={(value) => `${value}%`}
          defaultValue={3}
          minValue={0}
          maxValue={100}
          className="col-span-2 w-full"
        />
        <Slider
          label="Contrast"
          getValueLabel={(value) => `${value}%`}
          minValue={0}
          maxValue={500}
          defaultValue={100}
          className="w-full"
        />
        <Slider
          label="Saturation"
          getValueLabel={(value) => `${value}%`}
          minValue={0}
          maxValue={100}
          defaultValue={100}
          className="w-full"
        />
      </div>
      <p className="mt-6 text-base font-semibold">Base colors</p>
      <div className="mt-2 flex items-center gap-2">
        {baseColors.map((color) => (
          <ColorPicker key={color.name} defaultValue={color.color}>
            <ColorSwatch />
            {color.label}
          </ColorPicker>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {baseColors.map((color) => (
          <div key={color.name} className="flex items-center gap-2">
            <p className="w-16 text-sm text-fg-muted">{color.label}</p>
            <div className="flex flex-1 items-center gap-1">
              {Array.from({ length: 10 }).map((_, index) => (
                <Tooltip
                  key={index}
                  content={`${color.name}-${(index + 1) * 100}`}
                  delay={0}
                >
                  <AriaButton
                    className="h-8 flex-1 rounded-sm border"
                    style={{
                      backgroundColor: `var(--${color.name}-${(index + 1) * 100})`,
                    }}
                  />
                </Tooltip>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-base font-semibold">Semantic colors</p>
      <div className="mt-2 flex items-center gap-2">
        {[
          { name: "success", label: "Success", color: "#008000" },
          { name: "danger", label: "Danger", color: "#ff0000" },
          { name: "warning", label: "Warning", color: "#ffa500" },
          { name: "info", label: "Info", color: "#0000ff" },
        ].map((color) => (
          <ColorPicker key={color.name} defaultValue={color.color}>
            <ColorSwatch />
            {color.label}
          </ColorPicker>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {semanticColors.map((color) => (
          <div key={color.name} className="flex items-center gap-2">
            <p className="w-16 text-sm text-fg-muted">{color.label}</p>
            <div className="flex flex-1 items-center gap-1">
              {Array.from({ length: 10 }).map((_, index) => (
                <Tooltip
                  key={index}
                  content={`${color.name}-${(index + 1) * 100}`}
                  delay={0}
                >
                  <AriaButton
                    className="h-8 flex-1 rounded-sm border"
                    style={{
                      backgroundColor: `var(--${color.name}-${(index + 1) * 100})`,
                    }}
                  />
                </Tooltip>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-base font-semibold">Tokens</p>
      <div className="mt-2 space-y-8">
        {Object.entries(tokensByCategory).map(([category, categoryTokens]) => (
          <div key={category}>
            <h3 className="mb-3 text-sm font-medium text-fg-muted">
              {tokenCategories[category as keyof typeof tokenCategories]}
            </h3>
            <Skeleton show={!isMounted}>
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
        ))}
      </div>
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
