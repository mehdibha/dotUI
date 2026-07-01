import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/registry/ui/segmented-control'

export default function Demo() {
  return (
    <SegmentedControl defaultSelectedKeys={['week']} aria-label="Date range">
      <SegmentedControlItem id="day">Day</SegmentedControlItem>
      <SegmentedControlItem id="week">Week</SegmentedControlItem>
      <SegmentedControlItem id="month">Month</SegmentedControlItem>
    </SegmentedControl>
  )
}
