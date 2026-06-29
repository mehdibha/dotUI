'use client'

import { Label } from '@/registry/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'

export default function Demo({
  label = 'Country',
  placeholder = 'Select a country',
  isDisabled = false,
  isInvalid = false,
} = {}) {
  return (
    <Select
      className="w-52"
      placeholder={placeholder}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
    >
      {label && <Label>{label}</Label>}
      <SelectTrigger />
      <SelectContent>
        <SelectItem id="us">United States</SelectItem>
        <SelectItem id="uk">United Kingdom</SelectItem>
        <SelectItem id="fr">France</SelectItem>
        <SelectItem id="de">Germany</SelectItem>
        <SelectItem id="jp">Japan</SelectItem>
      </SelectContent>
    </Select>
  )
}
