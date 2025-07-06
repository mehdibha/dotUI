"use client";

import { ChevronsUpDownIcon } from "lucide-react";
import { Button as AriaButton } from "react-aria-components";

import { DEFAULT_THEME } from "@dotui/style-engine/constants";
import { Button } from "@dotui/ui/components/button";
import { ColorPicker } from "@dotui/ui/components/color-picker";
import { ColorSwatch } from "@dotui/ui/components/color-swatch";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Overlay } from "@dotui/ui/components/overlay";
import { Popover } from "@dotui/ui/components/popover";
import { Select, SelectRoot, SelectValue } from "@dotui/ui/components/select";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRoot,
  TableRow,
} from "@dotui/ui/components/table";
import { Tooltip } from "@dotui/ui/components/tooltip";

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
  return (
    <div>
      <p className="text-base font-semibold">Base colors</p>
      <div className="mt-4 flex items-center gap-2">
        {baseColors.map((color) => (
          <ColorPicker key={color.name} defaultValue={color.color}>
            <ColorSwatch />
            {color.label}
          </ColorPicker>
        ))}
      </div>
      <div className="mt-4 space-y-2">
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
      <div className="mt-4 flex items-center gap-2">
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
      <div className="mt-4 space-y-2">
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
      <TableRoot aria-label="Tokens" className="mt-4 w-full -mr-6">
        <TableHeader>
          <TableColumn id="name" isRowHeader>
            Variable name
          </TableColumn>
          <TableColumn id="value">Value</TableColumn>
        </TableHeader>
        <TableBody
          items={tokens.map((token) => ({ id: token.name, ...token }))}
        >
          {(token) => (
            <TableRow>
              <TableCell>{token.name}</TableCell>
              <TableCell>
                <SelectRoot defaultSelectedKey={token.value}>
                  <Button
                    size="sm"
                    suffix={<ChevronsUpDownIcon className="text-fg-muted" />}
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
    </div>
  );
}

interface Token {
  name: string;
  value: string;
  items: {
    name: string;
    label: string;
    value: string;
  }[];
}

const tokens: Token[] = Object.entries(DEFAULT_THEME)
  .filter(([name]) => name.startsWith("color"))
  .map(([key, val]) => {
    const name = key;
    const value = val.slice(6).slice(0, -1)!;

    const [baseColor, shade] = val.slice(6).slice(0, -1).split("-") as [
      string,
      string,
    ];

    const label = `${baseColor.charAt(0).toUpperCase() + baseColor.slice(1)} ${shade}`;

    const items = Array.from({ length: 10 }, (_, index) => {
      return {
        name: `${baseColor}-${(index + 1) * 100}`,
        label: `${baseColor.charAt(0).toUpperCase() + baseColor.slice(1)} ${(index + 1) * 100}`,
        value: `var(--${baseColor}-${(index + 1) * 100})`,
      };
    });

    return {
      name,
      value,
      label,
      items,
    };
  });
