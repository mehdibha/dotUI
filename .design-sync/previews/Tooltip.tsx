import { Button, Kbd, Tooltip, TooltipContent } from 'www'

export const Open = () => (
  <Tooltip defaultOpen>
    <Button variant="default">Hover me</Button>
    <TooltipContent>Add to library</TooltipContent>
  </Tooltip>
)

export const WithShortcut = () => (
  <Tooltip defaultOpen>
    <Button variant="default">Save</Button>
    <TooltipContent>
      Save changes <Kbd>⌘S</Kbd>
    </TooltipContent>
  </Tooltip>
)
