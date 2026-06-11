import {
  LayoutGridIcon,
  ListIcon,
  TableIcon,
} from '@/registry/__generated__/icons'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'

export default function Demo() {
  return (
    <ToggleButtonGroup orientation="vertical" aria-label="View mode">
      <ToggleButton id="list" isIconOnly aria-label="List view">
        <ListIcon />
      </ToggleButton>
      <ToggleButton id="grid" isIconOnly aria-label="Grid view">
        <LayoutGridIcon />
      </ToggleButton>
      <ToggleButton id="table" isIconOnly aria-label="Table view">
        <TableIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}
