"use client"

import { Description, Label } from "@/registry/ui/field"
import { Switch, SwitchControl, type SwitchProps } from "@/registry/ui/switch"

export default function Demo({
  label = "Airplane mode",
  description = "",
  size = "md",
  isDisabled = false,
  isReadOnly = false,
}: {
  label?: string
  description?: string
  size?: SwitchProps["size"]
  isDisabled?: boolean
  isReadOnly?: boolean
} = {}) {
  return (
    <Switch size={size} isDisabled={isDisabled} isReadOnly={isReadOnly}>
      <SwitchControl />
      <div className="flex flex-col gap-1">
        {label && <Label>{label}</Label>}
        {description && <Description>{description}</Description>}
      </div>
    </Switch>
  )
}
