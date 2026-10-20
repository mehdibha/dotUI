import { Suspense, use } from "react"

import { demoInstallItems, toDisplaySource } from "@/modules/docs/demo-source"
import { DynamicPre } from "@/modules/docs/dynamic-pre"
import {
  CODE_MODAL_PRE_CLASS,
  CodeModalBody,
} from "@/modules/docs/example-code-modal"

import { demoSource, getDemoComponent } from "./data"

interface ChartCodeModalContentProps {
  /** Demo key, e.g. `chart-bar/demos/multiple`. */
  demoKey: string
  /** Human label, e.g. `multiple`. */
  label: string
}

/**
 * Body of the chart "Show code" modal, lazily mounted. Chart sources are
 * highlighted at runtime; the source is read via `use()` against a cached
 * promise, so the modal suspends until it resolves.
 */
export default function ChartCodeModalContent({
  demoKey,
  label,
}: ChartCodeModalContentProps) {
  const Component = getDemoComponent(demoKey)
  const raw = use(demoSource(demoKey))

  return (
    <CodeModalBody
      title={<span className="capitalize">{label}</span>}
      preview={
        Component ? (
          <Suspense fallback={null}>
            <Component />
          </Suspense>
        ) : null
      }
      install={raw ? demoInstallItems(demoKey, raw) : []}
      file={`${demoKey.split("/").pop()}.tsx`}
      code={
        raw ? (
          <DynamicPre className={CODE_MODAL_PRE_CLASS}>
            {toDisplaySource(raw)}
          </DynamicPre>
        ) : (
          <p className="p-4 text-sm text-fg-muted">Source unavailable.</p>
        )
      }
    />
  )
}
