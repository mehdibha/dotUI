/* Shared vocabulary for the index illustrations — the React Aria anatomy
   school: flat monochrome schematics drawn on the fg alpha ladder (faint
   tracks, mid structure, one solid subject with a bg-colored knockout),
   real words at specimen size. Illustrations are stateless miniatures —
   the index names each chapter; values live inside it. */

import { cn } from "@/registry/lib/utils"

/** A schematic text line. Pass width and tone via className. */
export function Bar({ className }: { className?: string }) {
  return <span className={cn("h-1 rounded-full bg-fg/25", className)} />
}
