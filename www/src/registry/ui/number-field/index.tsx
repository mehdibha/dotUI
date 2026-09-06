import { createDynamicComponent } from "@/lib/styles"
import type { ButtonProps } from "@/registry/ui/button"

import * as right from "./base.right"
import type { NumberFieldGroupProps, NumberFieldProps } from "./base.right"
import * as split from "./base.split"
import * as stacked from "./base.stacked"

type Steppers = "right" | "split" | "stacked"

const dynamic = <Props extends object>(
  displayName: keyof typeof right,
  components: Record<Steppers, React.ComponentType<Props>>,
) =>
  createDynamicComponent<Props, Steppers>({
    componentName: "number-field",
    paramName: "steppers",
    defaultValue: "right",
    components,
    displayName,
  })

const NumberField = dynamic<NumberFieldProps>("NumberField", {
  right: right.NumberField,
  split: split.NumberField,
  stacked: stacked.NumberField,
})

const NumberFieldGroup = dynamic<NumberFieldGroupProps>("NumberFieldGroup", {
  right: right.NumberFieldGroup,
  split: split.NumberFieldGroup,
  stacked: stacked.NumberFieldGroup,
})

const NumberFieldDecrement = dynamic<ButtonProps>("NumberFieldDecrement", {
  right: right.NumberFieldDecrement,
  split: split.NumberFieldDecrement,
  stacked: stacked.NumberFieldDecrement,
})

const NumberFieldIncrement = dynamic<ButtonProps>("NumberFieldIncrement", {
  right: right.NumberFieldIncrement,
  split: split.NumberFieldIncrement,
  stacked: stacked.NumberFieldIncrement,
})

export type { NumberFieldGroupProps, NumberFieldProps }
export {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
}
