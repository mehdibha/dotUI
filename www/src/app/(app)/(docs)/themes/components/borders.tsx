"use client";

import React from "react";
import { useThemes } from "@/hooks/use-themes";
import { Label } from "@/components/core/field";
import { Skeleton } from "@/components/core/skeleton";
import {
  SliderFiller,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  SliderValueLabel,
} from "@/components/core/slider";
import { usePreview } from "./context";

export function Borders() {
  const {
    isLoading,
    currentTheme,
    isCurrentThemeEditable,
    handleRadiusChange,
  } = useThemes();
  const { setPreview } = usePreview();

  return (
    <Skeleton show={isLoading}>
      <SliderRoot
        minValue={0}
        maxValue={1.2}
        step={0.1}
        value={currentTheme.radius}
        onChange={(value) => {
          handleRadiusChange(value as number);
        }}
        isDisabled={!isCurrentThemeEditable}
        className="w-full!"
      >
        <div className="flex items-center justify-between">
          <Label>Radius (rem)</Label>
          <SliderValueLabel />
        </div>
        <div>
          <SliderTrack>
            <SliderFiller />
            <SliderThumb
              onFocusChange={(isFocused) => {
                setPreview(isFocused ? "borders" : null);
              }}
            />
          </SliderTrack>
        </div>
      </SliderRoot>
    </Skeleton>
  );
}
