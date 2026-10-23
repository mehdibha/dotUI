"use client"

import { useMemo } from "react"

import { isDragPreview, useLive } from "@/modules/studio/live"
import type { DesignSystem } from "@/modules/studio/preset/types"
import { designSystemOf } from "@/modules/studio/resolve"
import { useCurrent } from "@/modules/studio/selection"

const withJson = (data: DesignSystem) => ({ data, json: JSON.stringify(data) })

/** The `design-system` message for the live preview, else the committed
 *  design, and a key that changes with it. */
export function useDesignSystemMessage() {
  const { state } = useCurrent()
  const live = useLive()
  const committed = useMemo(() => withJson(designSystemOf(state)), [state])
  const preview = useMemo(() => live && withJson(designSystemOf(live)), [live])
  return useMemo(() => {
    // A preview that resolves to the committed design isn't one.
    const shown =
      preview && preview.json !== committed.json ? preview : committed
    const { data, json } = shown
    const isLive = shown !== committed
    const drag = isDragPreview()
    return {
      message: { type: "design-system", data, live: isLive, drag } as const,
      key: `${isLive}|${drag}|${json}`,
    }
  }, [preview, committed])
}
