import { lazy, Suspense, type ReactNode } from "react"
import { Settings2Icon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Dialog, DialogContent } from "@/registry/ui/dialog"
import { Popover } from "@/registry/ui/popover"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Skeleton } from "@/registry/ui/skeleton"
import { Switch } from "@/registry/ui/switch"

import { setCodeOption, useCodeOptions } from "./code-options-store"
import type { ExportUrl } from "./types"

// The highlighter only loads once someone opens the popover.
const ButtonSource = lazy(() => import("./button-source"))

/**
 * The `codeOptions` axes: how the exported source is written, previewed live
 * on the registry's button. Only what survives the consumer's formatter is
 * exposed — quotes, semicolons and indentation are Prettier's job,
 * `"use client"` the shadcn CLI's.
 */
export function CodeStyle({
  url,
  isDisabled,
}: {
  url: ExportUrl
  isDisabled?: boolean
}) {
  const codeOptions = useCodeOptions()

  return (
    <Dialog>
      <Button variant="quiet" size="xs" isDisabled={isDisabled}>
        <Settings2Icon />
        Code style
      </Button>
      <Popover
        placement="bottom end"
        className="flex w-[min(32rem,calc(100vw-2rem))] flex-col"
      >
        <DialogContent
          aria-label="Code style"
          className="min-h-0 gap-3 overflow-hidden p-3"
        >
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
            <Row
              label="Section separators"
              description="Comment rules between parts"
            >
              <Switch
                size="sm"
                aria-label="Section separators"
                isSelected={codeOptions.sectionComments}
                onChange={(value) => setCodeOption("sectionComments", value)}
              />
            </Row>
          </div>
          <Suspense fallback={<Skeleton className="h-80 w-full" />}>
            <ButtonSource url={url("button")} />
          </Suspense>
        </DialogContent>
      </Popover>
    </Dialog>
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
