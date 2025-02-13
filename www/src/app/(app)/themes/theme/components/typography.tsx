"use client";

import React from "react";
import { googleFonts } from "@/lib/fonts";
import { useThemes } from "@/hooks/use-themes";
import { Select, SelectItem } from "@/components/core/select";
import { Skeleton } from "@/components/core/skeleton";
import { usePreview } from "./context";

export function Typography() {
  const { fonts, handleFontChange, isLoading, isCurrentThemeEditable } =
    useThemes();
  const { setPreview } = usePreview();
  return (
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
            <SelectItem key={font.id} id={font.id}>
              {font.name}
            </SelectItem>
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
            <SelectItem key={font.id} id={font.id}>
              {font.name}
            </SelectItem>
          ))}
        </Select>
      </Skeleton>
    </div>
  );
}
