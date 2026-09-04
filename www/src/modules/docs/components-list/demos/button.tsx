import { PlusIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"

export function ButtonDemo() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="primary">Button</Button>
      <Button isIconOnly aria-label="Add">
        <PlusIcon />
      </Button>
    </div>
  )
}
