"use client"

import { LayoutGridIcon, ListIcon, TableIcon } from "@/registry/icons"
import {
  SegmentedControl,
  SegmentedControlItem,
  type SegmentedControlProps,
} from "@/registry/ui/segmented-control"

export default function Demo({
  orientation = "horizontal",
  isDisabled = false,
  disallowEmptySelection = true,
  isIconOnly = false,
}: SegmentedControlProps & { isIconOnly?: boolean } = {}) {
  return (
    <SegmentedControl
      aria-label="View"
      defaultSelectedKeys={["grid"]}
      orientation={orientation}
      isDisabled={isDisabled}
      disallowEmptySelection={disallowEmptySelection}
    >
      <SegmentedControlItem
        id="grid"
        aria-label={isIconOnly ? "Grid" : undefined}
      >
        <LayoutGridIcon />
        {!isIconOnly && "Grid"}
      </SegmentedControlItem>
      <SegmentedControlItem
        id="list"
        aria-label={isIconOnly ? "List" : undefined}
      >
        <ListIcon />
        {!isIconOnly && "List"}
      </SegmentedControlItem>
      <SegmentedControlItem
        id="table"
        aria-label={isIconOnly ? "Table" : undefined}
      >
        <TableIcon />
        {!isIconOnly && "Table"}
      </SegmentedControlItem>
    </SegmentedControl>
  )
}
