import { SquarePenIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { Kbd } from "@/registry/ui/kbd"

import { Surface } from "../overlay"

export function TooltipDemo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Surface
        variant="tooltip"
        className="inline-flex items-center gap-1.5 whitespace-nowrap"
      >
        Create new issue <Kbd>C</Kbd>
      </Surface>
      <Button aria-label="Create new issue" isIconOnly>
        <SquarePenIcon />
      </Button>
    </div>
  )
}
