"use client"

/* Card demos — real specimens on the right of a component card, as a
   right-anchored strip that CROPS: the strip may be wider than the card, the
   rightmost specimen stays fully visible and the rest fades out at the left
   edge, so even big demos give a quick look. Inert by design (span-based,
   pointer-events-none wrapper) — the card itself is the pressable. Wired for
   buttons and inputs (which absorbed input-groups) while the pattern is
   judged; the registry below decides which cards trade their summary for a
   demo strip. */

import { CopyIcon, PlusIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { buttonRadiusPx, styleLook } from "../sections/buttons"
import { inputLook, SHELL } from "../sections/inputs"
import { controlRadiusPx } from "../sections/shape"
import type { LabState } from "../state"

const BUTTON_SPECIMEN =
  "flex h-8 shrink-0 items-center px-3.5 text-[0.8125rem] font-medium whitespace-nowrap"

/** Rightmost = the identity specimen (fully visible); extras fade out left. */
function ButtonsDemo({ state }: { state: LabState }) {
  const look = styleLook(state)
  const radius = buttonRadiusPx(state)
  return (
    <>
      <span
        className={cn(BUTTON_SPECIMEN, look.secondary)}
        style={{ borderRadius: radius }}
      >
        Preview
      </span>
      <span
        className={cn(
          BUTTON_SPECIMEN,
          "w-8 justify-center px-0",
          look.secondary,
        )}
        style={{ borderRadius: radius }}
      >
        <PlusIcon className="size-4" />
      </span>
      <span
        className={cn(
          BUTTON_SPECIMEN,
          "bg-primary text-fg-on-primary",
          look.fill,
        )}
        style={{ borderRadius: radius }}
      >
        Get started
      </span>
    </>
  )
}

/** The field family: addon group fading left, the plain field fully visible. */
function InputsDemo({ state }: { state: LabState }) {
  const look = inputLook(state.inputStyle, controlRadiusPx(state))
  const boxed = state.addonLayout === "boxed"
  const divided = boxed && state.addonDivider === "hairline"
  return (
    <>
      <span
        className={cn(
          SHELL,
          "w-56 shrink-0",
          look.className,
          boxed ? "overflow-hidden" : "gap-2 px-2.5",
        )}
        style={look.style}
      >
        <span
          className={cn(
            "flex shrink-0 items-center text-fg-muted",
            boxed && "h-full bg-neutral px-2.5",
            divided && "border-r border-border-field",
          )}
        >
          https://
        </span>
        <span
          className={cn("flex flex-1 items-center text-fg", boxed && "px-2.5")}
        >
          dotui.org
        </span>
        <span
          className={cn(
            "flex shrink-0 items-center text-fg-muted",
            boxed && "h-full bg-neutral px-2.5",
            divided && "border-l border-border-field",
          )}
        >
          <CopyIcon className="size-3.5" />
        </span>
      </span>
      <span
        className={cn(SHELL, "w-44 shrink-0 gap-2 px-2.5", look.className)}
        style={look.style}
      >
        <span className="flex items-center text-fg-muted">you@example.com</span>
      </span>
    </>
  )
}

/** Which cards trade their summary line for a demo strip. */
export const CARD_DEMOS: Record<
  string,
  React.ComponentType<{ state: LabState }>
> = {
  buttons: ButtonsDemo,
  inputs: InputsDemo,
}
