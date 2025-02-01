"use client";

import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { useComponentsVariants } from "@/lib/create-dynamic-component";
import { useThemes } from "@/hooks/use-themes";
import { Button } from "@/components/core/button";
import { ListBox, Item } from "@/components/core/list-box";
import { Popover } from "@/components/core/popover";
import { SelectRoot, SelectValue } from "@/components/core/select";
import { core } from "@/registry/registry-core";
import { RegistryItem } from "@/registry/types";

export function StyleSwitcher({ componentName }: { componentName: string }) {
  const variants = getAllComponentVariants(componentName);
  const { variants: contextVariants, setVariants } = useComponentsVariants();
  const { currentTheme } = useThemes();
  const currentThemeVariant = currentTheme.variants[componentName];
  const currentVariant =
    contextVariants[componentName] ?? currentTheme.variants[componentName];

  return (
    <SelectRoot
      selectedKey={currentVariant}
      onSelectionChange={(key) => {
        // @ts-ignore
        setVariants((prevVariants) => ({
          ...prevVariants,
          [componentName]: key,
        }));
      }}
      className="w-auto"
    >
      <Button
        size="sm"
        suffix={<ChevronDownIcon />}
        className="border-border absolute left-2 top-2 z-50 text-xs font-normal"
      >
        <span className="font-bold">variant:</span> <SelectValue />
      </Button>
      <Popover>
        <ListBox>
          {variants &&
            variants.map((item) => (
              <Item
                key={item}
                id={item}
                // description={item.description}
              >
                {item}
                {currentThemeVariant === item.name && "(current theme)"}
              </Item>
            ))}
        </ListBox>
      </Popover>
    </SelectRoot>
  );
}

const getPrimitiveInfo = (name: string) => {
  const item = core.find((item) => item.name === name);

  if (hasVariants(item)) {
    return item.variants;
  } else {
    return false;
  }
};

function hasVariants(
  item?: RegistryItem
): item is Extract<RegistryItem, { variants: unknown }> {
  return item !== undefined && "variants" in item;
}
