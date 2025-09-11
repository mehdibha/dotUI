"use client";

import React from "react";
import { Button as AriaButton } from "react-aria-components";
import { useWatch } from "react-hook-form";

import { createColorScales } from "@dotui/style-engine/core";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { Tooltip } from "@dotui/ui/components/tooltip";

import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "../hooks/use-editor-style";
import { useColorEditorContext } from "./colors-editor";

interface ColorScaleProps {
  scaleId: string;
}

// TODO: Optimisation: instead of generating all the theme, we should only generate the scale we need
export function ColorScale({ scaleId }: ColorScaleProps) {
  const form = useStyleEditorForm();
  const { isSuccess } = useEditorStyle();
  const { resolvedMode } = useColorEditorContext("ColorScale");

  const scaleName = useWatch({
    control: form.control,
    name: `theme.colors.modes.${resolvedMode}.scales.${scaleId}.name`,
  });

  const currentModeDefinition = useWatch({
    name: `theme.colors.modes.${resolvedMode}`,
    control: form.control,
  });

  const generatedTheme = React.useMemo(() => {
    const theme = createColorScales(currentModeDefinition);
    return theme;
  }, [currentModeDefinition]);

  const scale = generatedTheme.find((scale) => scale.name === scaleId);

  if (!scale) {
    return null;
  }

  return (
    <div className="@lg:flex-row @lg:items-center @lg:gap-2 flex flex-col gap-0.5">
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
