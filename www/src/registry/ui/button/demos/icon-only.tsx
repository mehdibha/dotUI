import { PlusIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"

export default function Demo() {
  return (
    <Button isIconOnly aria-label="Add item">
      <PlusIcon />
    </Button>
  )
}
