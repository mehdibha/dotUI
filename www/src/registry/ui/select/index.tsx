import { composeRenderProps } from "react-aria-components/composeRenderProps"

import { createDynamicComponent } from "@/lib/styles"
import { ChevronsUpDownIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import type { ButtonProps } from "@/registry/ui/button"

import { SelectTrigger as ChevronTrigger, SelectValue } from "./base"
import meta from "./meta"

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

const SelectTrigger = createDynamicComponent({
  meta,
  paramName: "caret",
  components: { chevron: ChevronTrigger, double: DoubleTrigger },
  displayName: "SelectTrigger",
})

export * from "./base"
export { SelectTrigger }
