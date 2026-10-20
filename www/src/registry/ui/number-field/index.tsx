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
import meta from "./meta"

type Steppers = (typeof meta.params.steppers.values)[number]
type Part = keyof typeof rightCells

const dynamic = <Props extends object>(part: Part) =>
  createDynamicComponent({
    meta,
    paramName: "steppers",
    components: {
      "right-cells": rightCells[part],
      "stacked-cells": stackedCells[part],
      "stacked-inset": stackedInset[part],
      split: split[part],
    } as Record<Steppers, React.ComponentType<Props>>,
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
