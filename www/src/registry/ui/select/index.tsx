import { composeRenderProps } from "react-aria-components/composeRenderProps"

import { createDynamicComponent } from "@/lib/styles"
import { ChevronsUpDownIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import type { ButtonProps } from "@/registry/ui/button"

import { SelectTrigger as ChevronTrigger, SelectValue } from "./base"

// Base's SelectTrigger with the up-down caret — the shipped file gets the
// swap from `caret.source` (meta.ts).
const DoubleTrigger = (props: ButtonProps) => {
  return (
    <Button {...props}>
      {composeRenderProps(props.children, (children) => {
        return (
          <>
            {children ?? <SelectValue />}
            <ChevronsUpDownIcon className="ml-auto" />
          </>
        )
      })}
    </Button>
  )
}

const SelectTrigger = createDynamicComponent<ButtonProps, "chevron" | "double">(
  {
    componentName: "select",
    paramName: "caret",
    defaultValue: "chevron",
    components: { chevron: ChevronTrigger, double: DoubleTrigger },
    displayName: "SelectTrigger",
  },
)

export * from "./base"
export { SelectTrigger }
