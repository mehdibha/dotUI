"use client";

import React from "react";
import {
  BackgroundColor as LeonardoBgColor,
  Color as LeonardoColor,
  Theme as LeonardoTheme,
} from "@adobe/leonardo-contrast-colors";
import { Button as AriaButton } from "react-aria-components";
import type {
  ContrastColor,
  ContrastColorBackground,
  CssColor,
} from "@adobe/leonardo-contrast-colors";

import { Skeleton } from "@dotui/ui/components/skeleton";
import { Tooltip } from "@dotui/ui/components/tooltip";

import { useStyleForm } from "@/modules/styles/providers/style-editor-provider";
import { usePreferences } from "../atoms/preferences-atom";

interface ColorScaleProps {
  scaleId: string;
}

export function ColorScale({ scaleId }: ColorScaleProps) {
  const { form, isSuccess, resolvedMode, generatedTheme } = useStyleForm();

  const scaleName = form.watch(
    `theme.colors.modes.${resolvedMode}.scales.${scaleId}.name`,
  );

  const scale = generatedTheme.find((scale) => scale.name === scaleId);

  if (!scale) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <p className="text-fg-muted w-16 text-sm">{`${scaleName.charAt(0).toUpperCase() + scaleName.slice(1)}`}</p>
      <div className="flex flex-1 items-center gap-1">
        {scale.values.map((color, index) => (
          <Tooltip key={index} content={color.name} delay={0}>
            <Skeleton show={!isSuccess} className="flex-1">
              <AriaButton
                className="h-8 flex-1 rounded-sm border"
                style={{ backgroundColor: color.value }}
              />
            </Skeleton>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
