"use client"

import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import { CheckboxGroup } from "@/registry/ui/checkbox-group"
import { Description, FieldError, FieldGroup, Label } from "@/registry/ui/field"

export default function Demo({
  label = "Select frameworks",
  description = "",
  errorMessage = "",
  isDisabled = false,
  isReadOnly = false,
  isInvalid = false,
  isRequired = false,
} = {}) {
  return (
    <CheckboxGroup
      defaultValue={["react"]}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
      isRequired={isRequired}
    >
      {label && <Label>{label}</Label>}
      {description && <Description>{description}</Description>}
      <FieldGroup>
        <Checkbox value="react">
          <CheckboxControl />
          <Label>React</Label>
        </Checkbox>
        <Checkbox value="vue">
          <CheckboxControl />
          <Label>Vue</Label>
        </Checkbox>
        <Checkbox value="angular">
          <CheckboxControl />
          <Label>Angular</Label>
        </Checkbox>
      </FieldGroup>
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </CheckboxGroup>
  )
}
