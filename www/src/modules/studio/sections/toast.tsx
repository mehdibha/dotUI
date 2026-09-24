"use client"

/* Toast — how the notice enters, restacks and leaves, and how one swiped
   away finishes the throw. */

import { ToastMotion } from "../motion-controls"
import type { Studio } from "../state"

export function ToastSection({ studio }: { studio: Studio }) {
  return <ToastMotion label="Motion" studio={studio} />
}
