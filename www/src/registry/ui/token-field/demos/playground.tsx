"use client"

import { TokenFieldValue } from "react-aria-components/TokenField"

import { Description, Label } from "@/registry/ui/field"
import { TokenField, TokenInput } from "@/registry/ui/token-field"

const defaultValue = new TokenFieldValue([
  { type: "text", text: "Ping " },
  { type: "token", text: "@alexmiller" },
  { type: "text", text: " about the " },
  { type: "token", text: "#launch" },
  { type: "text", text: " checklist " },
])

export default function Demo({
  label = "Message",
  placeholder = "Write something...",
  description = "",
  isDisabled = false,
  isReadOnly = false,
} = {}) {
  return (
    <TokenField
      allowsNewlines
      defaultValue={defaultValue}
      className="w-[320px]"
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
    >
      {label && <Label>{label}</Label>}
      <TokenInput data-control-target placeholder={placeholder} />
      {description && <Description>{description}</Description>}
    </TokenField>
  )
}
