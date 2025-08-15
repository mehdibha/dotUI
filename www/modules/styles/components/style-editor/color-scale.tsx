"use client";

import { Button as AriaButton } from "react-aria-components";

import { Skeleton } from "@dotui/ui/components/skeleton";
import { Tooltip } from "@dotui/ui/components/tooltip";

import { useStyleForm } from "@/modules/styles/providers/style-editor-provider";

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
    <div className="@md:flex-row @md:items-center @md:gap-2 flex flex-col gap-0.5">
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
