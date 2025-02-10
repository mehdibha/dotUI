"use client";

import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { useComponentsVariants } from "@/lib/create-dynamic-component";
import { useThemes } from "@/hooks/use-themes";
import { Button, ButtonProps } from "@/components/core/button";
import { ListBox, ListBoxItem } from "@/components/core/list-box";
import { Popover } from "@/components/core/popover";
import { SelectRoot, SelectValue } from "@/components/core/select";
import { core } from "@/registry/registry-core";

export function StyleSwitcher({
  componentName,
  ...props
}: {
  componentName: string;
} & ButtonProps) {
  const primitiveInfo = getPrimitiveInfo(componentName);
  const { variants: contextVariants, setVariants } = useComponentsVariants();
  const { currentTheme } = useThemes();

  if (!primitiveInfo) return null;

  const { primitiveName, variants } = primitiveInfo;

  const currentThemeVariant = currentTheme.variants[primitiveName];
  const currentVariant =
    contextVariants[primitiveName] ?? currentTheme.variants[primitiveName];

  return (
    <SelectRoot
      selectedKey={currentVariant}
      onSelectionChange={(key) => {
        // @ts-expect-error TODO fix later
        setVariants((prevVariants) => ({
          ...prevVariants,
          [componentName]: key,
        }));
      }}
      className="w-auto"
    >
      <Button size="sm" suffix={<ChevronDownIcon />} {...props}>
        <span className="font-bold">{primitiveName}:</span> <SelectValue />
      </Button>
      <Popover>
        <ListBox>
          {variants &&
            variants.map((item) => (
              <ListBoxItem key={item} id={item}>
                {item}
                {currentThemeVariant === item && " (current theme)"}
              </ListBoxItem>
            ))}
        </ListBox>
      </Popover>
    </SelectRoot>
  );
}

const getPrimitiveInfo = (name: string) => {
  const item = core.find((item) => item.name === name);

  if (item?.variants) return { primitiveName: name, variants: item.variants };

  if (["text-field", "time-field", "date-field"].includes(name))
    return getPrimitiveInfo("input");

  return null;
};
