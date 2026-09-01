import { ChevronDownIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { ColorEditor } from "@/registry/ui/color-editor"

import { OverlayPreview } from "../overlay"

const COLOR = "#7f007f"

export function ColorPickerDemo() {
  return (
    <OverlayPreview
      variant="popover"
      surfaceClassName="w-56 p-2"
      trigger={
        <Button className="w-40 justify-start font-normal">
          <span
            aria-hidden
            className="size-4 rounded-sm border border-black/10"
            style={{ backgroundColor: COLOR }}
          />
          <span className="font-mono text-xs tracking-wide uppercase">
            {COLOR}
          </span>
          <ChevronDownIcon className="ml-auto text-fg-muted" />
        </Button>
      }
    >
      <ColorEditor defaultValue={COLOR} showFormatSelector={false} />
    </OverlayPreview>
  )
}
