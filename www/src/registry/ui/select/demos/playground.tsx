"use client"

import { Description, Label } from "@/registry/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"

export default function Demo({
  label = "Country",
  placeholder = "Select a country",
  description = "",
  size = "md",
  selectionMode = "single",
  isDisabled = false,
  isInvalid = false,
  isRequired = false,
}: {
  label?: string
  placeholder?: string
  description?: string
  size?: "sm" | "md" | "lg"
  selectionMode?: "single" | "multiple"
  isDisabled?: boolean
  isInvalid?: boolean
  isRequired?: boolean
} = {}) {
  return (
    <Select
      className="w-52"
      placeholder={placeholder}
      selectionMode={selectionMode}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      isRequired={isRequired}
    >
      {label && <Label>{label}</Label>}
      <SelectTrigger data-control-target size={size} />
      <SelectContent>
        <SelectItem id="us">United States</SelectItem>
        <SelectItem id="uk">United Kingdom</SelectItem>
        <SelectItem id="fr">France</SelectItem>
        <SelectItem id="de">Germany</SelectItem>
        <SelectItem id="jp">Japan</SelectItem>
      </SelectContent>
      {description && <Description>{description}</Description>}
    </Select>
  )
}
