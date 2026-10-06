import { createDynamicComponent } from "@/lib/styles"

import { FieldError as FieldErrorBase } from "./base"
import type { FieldErrorProps } from "./base"
import { FieldError as FieldErrorWithIcon } from "./base.message"

export * from "./base"

const FieldError = createDynamicComponent<
  FieldErrorProps,
  "plain" | "icon-message"
>({
  componentName: "field",
  paramName: "error",
  defaultValue: "plain",
  components: {
    plain: FieldErrorBase,
    "icon-message": FieldErrorWithIcon,
  },
  displayName: "FieldError",
})

export { FieldError }
