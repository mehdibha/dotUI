"use client"

/* Card demos — real specimens beside a component card's label, as a strip
   that CROPS off the card's right edge: the strip may be wider than the card,
   the leftmost (identity) specimen stays fully visible and the rest fades out
   at the right, so even big demos give a quick look. Inert by design
   (span-based, pointer-events-none wrapper) — the card itself is the
   pressable. Wired for buttons and inputs (which absorbed input-groups) while
   the pattern is judged; the registry below decides which cards trade their
   summary for a demo strip. */

import { CopyIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { buttonRadiusPx, styleLook } from "../sections/buttons"
import { inputLook, SHELL } from "../sections/inputs"
import { controlRadiusPx } from "../sections/shape"
import type { LabState } from "../state"

const BUTTON_SPECIMEN =
  "flex h-8 shrink-0 items-center px-3.5 text-[0.8125rem] font-medium whitespace-nowrap"

/** The hero's two-row variant ladder, scaled down a notch and top-aligned to
 *  the card's padding — the second row may crop at the card's bottom edge.
 *  Each specimen names its own variant, so the strip reads as the ladder. */
function ButtonsDemo({ state }: { state: LabState }) {
  const look = styleLook(state)
  const radius = buttonRadiusPx(state)
  const specimen = (skin: string, label: string) => (
    <span
      className={cn(BUTTON_SPECIMEN, skin)}
      style={{ borderRadius: radius }}
    >
      {label}
    </span>
  )
  return (
    <span className="flex self-start pt-3.5">
      <span className="flex origin-top-left scale-[0.8] flex-col items-start gap-2">
        <span className="flex items-center gap-2">
          {specimen(cn("bg-primary text-fg-on-primary", look.fill), "Primary")}
          {specimen(look.secondary, "Secondary")}
          {specimen("text-fg", "Quiet")}
        </span>
        <span className="flex items-center gap-2">
          {specimen(cn("bg-warning text-fg-on-warning", look.fill), "Warning")}
          {specimen(cn("bg-danger text-fg-on-danger", look.fill), "Danger")}
          {specimen("text-fg", "Link")}
        </span>
      </span>
    </span>
  )
}

/** The field family: the plain field fully visible, addon group fading right. */
function InputsDemo({ state }: { state: LabState }) {
  const look = inputLook(state.inputStyle, controlRadiusPx(state))
  const boxed = state.addonLayout === "boxed"
  const divided = boxed && state.addonDivider === "hairline"
  return (
    <>
      <span
        className={cn(SHELL, "w-44 shrink-0 gap-2 px-2.5", look.className)}
        style={look.style}
      >
        <span className="flex items-center text-fg-muted">you@example.com</span>
      </span>
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
