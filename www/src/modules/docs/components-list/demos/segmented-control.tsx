import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"

export function SegmentedControlDemo() {
  return (
    <SegmentedControl defaultSelectedKeys={["week"]} aria-label="Range">
      <SegmentedControlItem id="day">Day</SegmentedControlItem>
      <SegmentedControlItem id="week">Week</SegmentedControlItem>
      <SegmentedControlItem id="month">Month</SegmentedControlItem>
    </SegmentedControl>
  )
}
