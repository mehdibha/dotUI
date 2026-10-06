import { createDynamicComponent } from "@/lib/styles"

import * as rightCells from "./base.right-cells"
import type {
  NumberFieldGroupProps,
  NumberFieldProps,
  NumberFieldStepperProps,
} from "./base.right-cells"
import * as split from "./base.split"
import * as stackedCells from "./base.stacked-cells"
import * as stackedInset from "./base.stacked-inset"

type Steppers = "right-cells" | "stacked-cells" | "stacked-inset" | "split"
type Part = keyof typeof rightCells

const dynamic = <Props extends object>(part: Part) =>
  createDynamicComponent<Props, Steppers>({
    componentName: "number-field",
    paramName: "steppers",
    defaultValue: "right-cells",
    components: {
      "right-cells": rightCells[part] as React.ComponentType<Props>,
      "stacked-cells": stackedCells[part] as React.ComponentType<Props>,
      "stacked-inset": stackedInset[part] as React.ComponentType<Props>,
      split: split[part] as React.ComponentType<Props>,
    },
    displayName: part,
  })

const NumberField = dynamic<NumberFieldProps>("NumberField")
const NumberFieldGroup = dynamic<NumberFieldGroupProps>("NumberFieldGroup")
const NumberFieldDecrement = dynamic<NumberFieldStepperProps>(
  "NumberFieldDecrement",
)
const NumberFieldIncrement = dynamic<NumberFieldStepperProps>(
  "NumberFieldIncrement",
)

export type { NumberFieldGroupProps, NumberFieldProps, NumberFieldStepperProps }
export {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
}
