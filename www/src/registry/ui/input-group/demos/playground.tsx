"use client"

import { Label } from "@/registry/ui/field"
import {
  Input,
  InputGroup,
  InputGroupAddon,
  type InputGroupAddonProps,
  type InputGroupProps,
} from "@/registry/ui/input"
import { TextField } from "@/registry/ui/text-field"

export default function Demo({
  size = "md",
  variant = "inline",
  isDisabled = false,
  isInvalid = false,
}: {
  size?: InputGroupProps["size"]
  variant?: InputGroupAddonProps["variant"]
  isDisabled?: boolean
  isInvalid?: boolean
} = {}) {
  return (
    <TextField
      className="w-full max-w-xs"
      isDisabled={isDisabled}
      isInvalid={isInvalid}
    >
      <Label>Website</Label>
      <InputGroup data-control-target size={size}>
        <InputGroupAddon data-control-target variant={variant}>
          https://
        </InputGroupAddon>
        <Input placeholder="example" />
        <InputGroupAddon data-control-target variant={variant}>
          .com
        </InputGroupAddon>
      </InputGroup>
    </TextField>
  )
}
