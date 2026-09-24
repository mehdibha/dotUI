import { createDynamicComponent } from "@/lib/styles"
import { ChevronsUpDownIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"

import { ComboboxTrigger as ChevronTrigger } from "./base"
import type { ComboboxTriggerProps } from "./base"

// Base's ComboboxTrigger with the up-down caret — the shipped file gets the
// swap from `caret.source` (meta.ts).
const DoubleTrigger = (props: ComboboxTriggerProps) => {
  return (
    <Button variant="quiet" isIconOnly {...props}>
      <ChevronsUpDownIcon />
    </Button>
  )
}

const ComboboxTrigger = createDynamicComponent<
  ComboboxTriggerProps,
  "chevron" | "double"
>({
  componentName: "combobox",
  paramName: "caret",
  defaultValue: "chevron",
  components: { chevron: ChevronTrigger, double: DoubleTrigger },
  displayName: "ComboboxTrigger",
})

export * from "./base"
export { ComboboxTrigger }
