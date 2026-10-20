import { ChevronDownIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { ColorEditor } from "@/registry/ui/color-editor"

import { OverlayPreview } from "../overlay"

const COLOR = "#7f007f"

export function ColorPickerDemo() {
  return (
    <OverlayPreview
      variant="popover"
      className="px-9 pt-8"
      surfaceClassName="flex w-full justify-center p-2"
      trigger={
        <Button className="w-full justify-start font-normal">
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
      <div className="w-full">
        <ColorEditor
          defaultValue={COLOR}
          showFormatSelector={false}
          className="w-full"
        />
      </div>
    </OverlayPreview>
  )
}
