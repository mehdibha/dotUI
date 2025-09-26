"use client";

import { Button as AriaButton } from "react-aria-components";

import { Skeleton } from "@dotui/ui/components/skeleton";
import { Tooltip } from "@dotui/ui/components/tooltip";
import type { ScaleId } from "@dotui/style-engine/types";

import {
  useGeneratedTheme,
  useStyleEditorForm,
} from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { useResolvedModeState } from "@/modules/style-editor/hooks/use-resolved-mode";

export function ColorScale({ scaleId }: { scaleId: ScaleId }) {
  const form = useStyleEditorForm();
  const { isSuccess } = useEditorStyle();
  const { resolvedMode } = useResolvedModeState();

  const generatedTheme = useGeneratedTheme();

  const scale = generatedTheme.find((scale) => scale.name === scaleId);

  if (!scale) {
    return null;
  }

  return (
    <div className="@lg:flex-row @lg:items-center @lg:gap-2 flex flex-col gap-0.5">
      <p className="text-fg-muted w-16 text-sm">
        <form.Subscribe
          selector={(state) =>
            state.values.theme.colors.modes[resolvedMode].scales[scaleId].name
          }
        >
          {(scaleName) =>
            `${scaleName.charAt(0).toUpperCase() + scaleName.slice(1)}`
          }
        </form.Subscribe>
      </p>
      <div className="flex flex-1 items-center gap-1">
        {scale.values.map((color, index) => (
          <Tooltip key={index} content={color.name}>
            <Skeleton show={!isSuccess} className="flex-1 h-8">
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
