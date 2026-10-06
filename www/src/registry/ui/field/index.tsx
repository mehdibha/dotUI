import { createDynamicComponent } from "@/lib/styles"

import { FieldError as FieldErrorBase } from "./base"
import { FieldError as FieldErrorWithIcon } from "./base.message"
import meta from "./meta"

export * from "./base"

const FieldError = createDynamicComponent({
  meta,
  paramName: "error",
  components: {
    plain: FieldErrorBase,
    "icon-message": FieldErrorWithIcon,
  },
  displayName: "FieldError",
})

export { FieldError }
