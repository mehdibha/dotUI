"use client";

import { Button } from "@dotui/registry/ui/button";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogHeading,
} from "@dotui/registry/ui/dialog";
import { Overlay } from "@dotui/registry/ui/overlay";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";
import type { ScaleId } from "@dotui/style-system/types";

import {
  useGeneratedTheme,
  useStyleEditorForm,
} from "@/modules/style-editor/style-editor-provider";
import { useResolvedModeState } from "@/modules/style-editor/use-resolved-mode";

export function ColorScale({ scaleId }: { scaleId: ScaleId }) {
  const form = useStyleEditorForm();
  const { resolvedMode } = useResolvedModeState();

  const generatedTheme = useGeneratedTheme();

  const scale = generatedTheme.find((scale) => scale.name === scaleId);

  if (!scale) {
    return null;
  }

  return (
    <div className="flex @lg:flex-row flex-col @lg:items-center @lg:gap-2 gap-0.5">
      <p className="w-16 text-fg-muted text-sm">
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
          <Dialog key={index}>
            <Tooltip>
              <Button
                aria-label={color.name}
                className="h-8 flex-1 rounded-sm border"
                style={{ backgroundColor: color.value }}
              />
              <TooltipContent>{color.name}</TooltipContent>
            </Tooltip>
            <Overlay type="popover" modalProps={{ className: "w-fit" }}>
              <DialogContent>
                <DialogHeader>
                  <DialogHeading>{color.name}</DialogHeading>
                </DialogHeader>
                <DialogBody>
                  <div className="flex items-center gap-2">
                    <ColorSwatch color={color.value} />
                    <p>{color.value}</p>
                  </div>
                </DialogBody>
              </DialogContent>
            </Overlay>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
