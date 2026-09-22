"use client"

import { lazy, Suspense } from "react"

import { DialogContent } from "@/registry/ui/dialog"
import { Modal } from "@/registry/ui/modal"

import type { StudioState } from "../axes"

const AgentDocsViewer = lazy(() => import("./agent-docs-viewer"))

/** The agent docs viewer as a modal; place it inside a `Dialog` beside its trigger. */
export function AgentDocsModal({ state }: { state: StudioState }) {
  return (
    <Modal className="sm:max-w-4xl">
      <DialogContent showCloseButton aria-label="Agent docs">
        <Suspense fallback={<div className="h-96" />}>
          <AgentDocsViewer state={state} />
        </Suspense>
      </DialogContent>
    </Modal>
  )
}
