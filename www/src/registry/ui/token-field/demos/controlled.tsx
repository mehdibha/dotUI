"use client"

import * as React from "react"
import { TokenFieldValue } from "react-aria-components/TokenField"

import { Label } from "@/registry/ui/field"
import { TokenField, TokenInput } from "@/registry/ui/token-field"

export default function Demo() {
  const [value, setValue] = React.useState(
    () =>
      new TokenFieldValue([
        { type: "text", text: "Hello " },
        { type: "token", text: "@sarahjones" },
        { type: "text", text: "!" },
      ]),
  )
  return (
    <div className="flex w-[320px] flex-col gap-2">
      <TokenField allowsNewlines value={value} onChange={setValue}>
        <Label>Message</Label>
        <TokenInput />
      </TokenField>
      <p className="text-sm text-fg-muted">Value: {value.toString()}</p>
    </div>
  )
}
