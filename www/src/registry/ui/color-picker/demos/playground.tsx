"use client"

import { Button } from "@/registry/ui/button"
import { ColorEditor } from "@/registry/ui/color-editor"
import { ColorPicker } from "@/registry/ui/color-picker"
import { ColorSwatch } from "@/registry/ui/color-swatch"
import { Popover } from "@/registry/ui/popover"

export default function Demo({
  label = "Accent",
  showAlphaChannel = false,
  showFormatSelector = true,
}: {
  label?: string
  showAlphaChannel?: boolean
  showFormatSelector?: boolean
} = {}) {
  return (
    <ColorPicker defaultValue="#5100FF">
      <Button>
        <ColorSwatch />
        {label}
      </Button>
      <Popover className="p-2.5">
        <ColorEditor
          data-control-target
          showAlphaChannel={showAlphaChannel}
          showFormatSelector={showFormatSelector}
        />
      </Popover>
    </ColorPicker>
  )
}
