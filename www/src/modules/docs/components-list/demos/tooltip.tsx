import { SquarePenIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { Kbd } from "@/registry/ui/kbd"
import { useStyles as useTooltipStyles } from "@/registry/ui/tooltip/styles"

import { Surface } from "../overlay"

export function TooltipDemo() {
  const { arrow } = useTooltipStyles()()
  return (
    <div className="flex flex-col items-center gap-3">
      <Surface
        variant="tooltip"
        className="relative inline-flex items-center gap-1.5 whitespace-nowrap"
      >
        Create new issue <Kbd>C</Kbd>
        <span
          className={arrow({
            className: "absolute top-full left-1/2 -translate-x-1/2",
          })}
        >
          <svg aria-hidden="true" width={8} height={8} viewBox="0 0 8 8">
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </span>
      </Surface>
      <Button aria-label="Create new issue" isIconOnly>
        <SquarePenIcon />
      </Button>
    </div>
  )
}
