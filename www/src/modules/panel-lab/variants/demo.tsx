"use client"

/* Card demos — real specimens replacing the value line on component cards:
   the actual button skins, field shells and addon layouts the chapter's axes
   produce, at true size. Inert by design (span-based, pointer-events-none
   wrapper) — the card itself is the pressable, and nesting controls inside it
   would be a lie anyway. Wired for buttons, inputs and input-groups while the
   pattern is judged; the registry below decides which cards trade their
   summary for a demo. */

import { CopyIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { buttonRadiusPx, styleLook } from "../sections/buttons"
import { BARE_INPUT, inputLook, SHELL } from "../sections/inputs"
import { controlRadiusPx } from "../sections/shape"
import type { LabState } from "../state"

const BUTTON_SPECIMEN =
  "flex h-8 items-center px-3.5 text-[0.8125rem] font-medium whitespace-nowrap"

function ButtonsDemo({ state }: { state: LabState }) {
  const look = styleLook(state)
  const radius = buttonRadiusPx(state)
  return (
    <span className="flex items-center gap-2">
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
      <span
        className={cn(BUTTON_SPECIMEN, look.secondary)}
        style={{ borderRadius: radius }}
      >
        Preview
      </span>
    </span>
  )
}

function InputsDemo({ state }: { state: LabState }) {
  const look = inputLook(state.inputStyle, controlRadiusPx(state))
  return (
    <span
      className={cn(SHELL, "gap-2 px-2.5", look.className)}
      style={look.style}
    >
      <span className={cn(BARE_INPUT, "flex items-center text-fg-muted")}>
        you@example.com
      </span>
    </span>
  )
}

function InputGroupsDemo({ state }: { state: LabState }) {
  const look = inputLook(state.inputStyle, controlRadiusPx(state))
  const boxed = state.addonLayout === "boxed"
  const divided = boxed && state.addonDivider === "hairline"
  return (
    <span
      className={cn(
        SHELL,
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
  )
}

/** Which cards trade their summary line for a real demo. */
export const CARD_DEMOS: Record<
  string,
  React.ComponentType<{ state: LabState }>
> = {
  buttons: ButtonsDemo,
  inputs: InputsDemo,
  "input-groups": InputGroupsDemo,
}
