"use client";

import React from "react";
import { useThemes } from "@/hooks/use-themes";
import { Select, SelectItem } from "@/components/core/select";
import { Skeleton } from "@/components/core/skeleton";

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
        <SelectItem id="lucide">Lucide icons</SelectItem>
      </Select>
    </Skeleton>
  );
}
