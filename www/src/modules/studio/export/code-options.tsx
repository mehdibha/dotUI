import type { ReactNode } from "react"

import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Switch } from "@/registry/ui/switch"

import { setCodeOption, useCodeOptions } from "./code-options-store"

/**
 * The `codeOptions` axes: how the exported source is written. Only what
 * survives the consumer's formatter is exposed — quotes, semicolons and
 * indentation are Prettier's job, `"use client"` the shadcn CLI's.
 */
export function CodeOptions() {
  const codeOptions = useCodeOptions()

  return (
    <div className="divide-y rounded-md border">
      <Row label="Class lists" description="tv() base and slot classes">
        <SegmentedControl
          aria-label="Class lists"
          selectedKeys={[codeOptions.classArrays ? "arrays" : "string"]}
          onSelectionChange={(keys) =>
            setCodeOption("classArrays", keys.has("arrays"))
          }
        >
          <SegmentedControlItem id="string">String</SegmentedControlItem>
          <SegmentedControlItem id="arrays">Arrays</SegmentedControlItem>
        </SegmentedControl>
      </Row>
      <Row label="Section separators" description="Comment rules between parts">
        <Switch
          size="sm"
          aria-label="Section separators"
          isSelected={codeOptions.sectionComments}
          onChange={(value) => setCodeOption("sectionComments", value)}
        />
      </Row>
    </div>
  )
}

function Row({
  label,
  description,
  children,
}: {
  label: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2">
      <div className="flex min-w-0 flex-col">
        <span className="text-sm">{label}</span>
        <span className="text-xs text-fg-muted">{description}</span>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}
