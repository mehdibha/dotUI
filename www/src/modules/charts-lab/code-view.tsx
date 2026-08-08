import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { CodeBlock } from "@/modules/docs/code-block"
import { DynamicPre } from "@/modules/docs/dynamic-pre"

export type SeatView = "preview" | "primitive" | "example"

export function SeatViewBar({
  view,
  onChange,
}: {
  view: SeatView
  onChange: (view: SeatView) => void
}) {
  return (
    <div className="border-b border-border px-4 py-2">
      <SegmentedControl
        aria-label="Seat view"
        selectedKeys={[view]}
        onSelectionChange={(keys) => {
          const next = [...keys][0]
          if (typeof next === "string") onChange(next as SeatView)
        }}
        className="w-full"
      >
        <SegmentedControlItem id="preview" className="flex-1">
          Preview
        </SegmentedControlItem>
        <SegmentedControlItem id="primitive" className="flex-1">
          Primitive
        </SegmentedControlItem>
        <SegmentedControlItem id="example" className="flex-1">
          Example
        </SegmentedControlItem>
      </SegmentedControl>
    </div>
  )
}

export function CodePane({ title, code }: { title: string; code: string }) {
  return (
    <CodeBlock
      title={`${title} · ${code.trimEnd().split("\n").length} lines`}
      className="flex min-h-0 flex-1 flex-col rounded-none border-0 bg-transparent"
      contentClassName="no-scrollbar min-h-0 max-h-[560px] flex-1 scroll-fade-y overflow-y-auto"
    >
      <DynamicPre
        lang="tsx"
        className="no-scrollbar w-full scroll-fade-x overflow-x-auto *:[code]:w-max *:[code]:min-w-full"
      >
        {code}
      </DynamicPre>
    </CodeBlock>
  )
}
