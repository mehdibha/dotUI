"use client";

import React from "react";
import { useThemes } from "@/hooks/use-themes";
import { Item } from "@/registry/ui/default/core/list-box";
import { Select } from "@/registry/ui/default/core/select";
import { Skeleton } from "@/registry/ui/default/core/skeleton";

export function Iconography() {
  const { isLoading, isCurrentThemeEditable } = useThemes();
  return (
    <Skeleton show={isLoading}>
      <Select
        label="Icon library"
        defaultSelectedKey="lucide"
        isDisabled={!isCurrentThemeEditable}
        className="[&_button]:w-full"
      >
        <Item id="lucide">Lucide icons</Item>
      </Select>
    </Skeleton>
  );
}
