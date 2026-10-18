import { lazy, Suspense } from "react"
import { LoaderCircleIcon } from "lucide-react"

import { CodeModal } from "@/modules/docs/example-code-modal"

// Code-split the body: it pulls in the syntax highlighter, which shouldn't ship
// in the charts route until someone actually opens a modal.
const ChartCodeModalContent = lazy(() => import("./chart-code-modal-content"))

interface ChartCodeModalProps {
  /** Demo key, e.g. `chart-bar/demos/multiple`. */
  demoKey: string
  /** Human label, e.g. `multiple` — the modal title. */
  label: string
}

export function ChartCodeModal({ demoKey, label }: ChartCodeModalProps) {
  return (
    <CodeModal label={`${label} chart code`}>
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <LoaderCircleIcon className="size-5 animate-spin text-fg-muted" />
          </div>
        }
      >
        <ChartCodeModalContent demoKey={demoKey} label={label} />
      </Suspense>
    </CodeModal>
  )
}
