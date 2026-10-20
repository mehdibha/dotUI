import { InfoIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

export default function Demo() {
  return (
    <Tooltip>
      <Button variant="quiet" isIconOnly aria-label="Info">
        <InfoIcon />
      </Button>
      <TooltipContent>Additional information</TooltipContent>
    </Tooltip>
  )
}
