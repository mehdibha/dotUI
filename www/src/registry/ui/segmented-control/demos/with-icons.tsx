import {
  LayoutGridIcon,
  ListIcon,
  TableIcon,
} from '@/registry/__generated__/icons'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/registry/ui/segmented-control'

export default function Demo() {
  return (
    <SegmentedControl defaultSelectedKeys={['grid']} aria-label="View">
      <SegmentedControlItem id="grid">
        <LayoutGridIcon />
        Grid
      </SegmentedControlItem>
      <SegmentedControlItem id="list">
        <ListIcon />
        List
      </SegmentedControlItem>
      <SegmentedControlItem id="table">
        <TableIcon />
        Table
      </SegmentedControlItem>
    </SegmentedControl>
  )
}
