import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

const SLOT_ID = 'header-actions'

/** Portal target in the global header's right cluster. */
export function HeaderActionsSlot() {
  return <span id={SLOT_ID} className="contents" />
}

/**
 * Portals children into the header's actions slot. Client-only (the slot is
 * looked up after mount) and keeps the caller's React context, so route-scoped
 * hooks keep working — a page contributes header actions without the header
 * importing page code.
 */
export function HeaderActions({ children }: { children: ReactNode }) {
  const [slot, setSlot] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setSlot(document.getElementById(SLOT_ID))
  }, [])
  return slot ? createPortal(children, slot) : null
}
