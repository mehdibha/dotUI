"use client"

import { useEffect, useRef } from "react"

import { Button } from "@/registry/ui/button"
import { Checkbox } from "@/registry/ui/checkbox"

import { Board, BoardSection, useBoardFocus } from "./board"

// A live selection from mid-sentence over the controls into the next line: their labels light up only when control text selects. A click that clears it puts it back.
function Selection() {
  const { axis } = useBoardFocus()
  const startRef = useRef<HTMLSpanElement>(null)
  const endRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const select = () => {
      const start = startRef.current?.firstChild
      const end = endRef.current
      const selection = window.getSelection()
      if (!start || !end || !selection) return
      const range = document.createRange()
      range.setStart(start, 0)
      range.setEnd(end, end.childNodes.length)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    const restore = () =>
      setTimeout(() => {
        if (window.getSelection()?.isCollapsed) select()
      })
    select()
    document.addEventListener("pointerup", restore)
    return () => document.removeEventListener("pointerup", restore)
  }, [axis])

  return (
    <div className="flex flex-col gap-3 text-sm/relaxed text-fg">
      <p>
        Sync runs hourly. <span ref={startRef}>Failed runs retry.</span>
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button>Export</Button>
        <Checkbox defaultSelected>Notify me</Checkbox>
      </div>
      <p ref={endRef}>Receipts go to billing.</p>
    </div>
  )
}

export default function TextSelectionBoard() {
  return (
    <Board id="text-selection">
      <BoardSection title="Text selection">
        <Selection />
      </BoardSection>
    </Board>
  )
}
