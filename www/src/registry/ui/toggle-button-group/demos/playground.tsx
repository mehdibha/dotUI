"use client"

import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "@/registry/__generated__/icons"
import { ToggleButton } from "@/registry/ui/toggle-button"
import {
  ToggleButtonGroup,
  type ToggleButtonGroupProps,
} from "@/registry/ui/toggle-button-group"

export default function Demo({
  variant = "secondary",
  size = "md",
  isIconOnly = false,
  orientation = "horizontal",
  selectionMode = "single",
  isDisabled = false,
}: ToggleButtonGroupProps = {}) {
  return (
    <ToggleButtonGroup
      variant={variant}
      size={size}
      isIconOnly={isIconOnly}
      orientation={orientation}
      selectionMode={selectionMode}
      isDisabled={isDisabled}
      defaultSelectedKeys={["bold"]}
      aria-label="Text formatting"
    >
      <ToggleButton id="bold" aria-label="Bold">
        <BoldIcon />
      </ToggleButton>
      <ToggleButton id="italic" aria-label="Italic">
        <ItalicIcon />
      </ToggleButton>
      <ToggleButton id="underline" aria-label="Underline">
        <UnderlineIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
