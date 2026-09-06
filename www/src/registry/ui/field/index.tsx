import { createDynamicComponent } from "@/lib/styles"

import { FieldError as FieldErrorBase } from "./base"
import type { FieldErrorProps } from "./base"
import { FieldError as FieldErrorWithIcon } from "./base.message"

export * from "./base"

const FieldError = createDynamicComponent<
  FieldErrorProps,
  "border" | "message" | "bar"
>({
  componentName: "field",
  paramName: "error",
  defaultValue: "border",
  components: {
    border: FieldErrorBase,
    message: FieldErrorWithIcon,
    bar: FieldErrorBase,
  },
  displayName: "FieldError",
})

export { FieldError }
