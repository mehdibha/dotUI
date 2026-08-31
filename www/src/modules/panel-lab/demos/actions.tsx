"use client"

/* Selection-control and kbd illustrations — monochrome anatomy schematics
   (see ink.tsx): one solid subject, a bg-colored knockout, a real word. */

import { CheckIcon, MinusIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { Bar } from "./ink"

/** One on switch. */
export function SwitchDemo() {
  return (
    <span className="flex h-4.5 w-8 shrink-0 items-center justify-end rounded-full bg-(--neutral-500) p-0.5">
      <span className="size-3.5 rounded-full bg-(--neutral-800)" />
    </span>
  )
}

/** The three states: checked, indeterminate, unchecked. */
export function CheckboxDemo() {
  const box =
    "flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-(--neutral-800) text-(--neutral-25)"
  return (
    <span className="flex shrink-0 items-center gap-2">
      <span className="size-4 shrink-0 rounded-[4px] bg-(--neutral-500)" />
      <span className={box}>
        <MinusIcon className="size-3" strokeWidth={3} />
      </span>
      <span className={box}>
        <CheckIcon className="size-3" strokeWidth={3} />
      </span>
    </span>
  )
}

function RadioDot({
  selected,
  small,
}: {
  selected?: boolean
  small?: boolean
}) {
  return selected ? (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-(--neutral-800)",
        small ? "size-3" : "size-4",
      )}
    >
      <span
        className={cn(
          "rounded-full bg-(--neutral-25)",
          small ? "size-1" : "size-1.5",
        )}
      />
    </span>
  ) : (
    <span
      className={cn(
        "shrink-0 rounded-full bg-(--neutral-500)",
        small ? "size-3" : "size-4",
      )}
    />
  )
}

/** The pair of states: unselected, selected. */
export function RadioDemo() {
  return (
    <span className="flex shrink-0 items-center gap-2">
      <RadioDot />
      <RadioDot selected />
    </span>
  )
}

/** Two cards, the selected one carrying the strong border and its dot. */
export function ChoiceCardsDemo() {
  const card = (selected: boolean) => (
    <span
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-lg p-2",
        selected
          ? "border-[1.5px] border-(--neutral-800)"
          : "border border-(--neutral-400) p-[8.5px]",
      )}
    >
      <RadioDot selected={selected} small />
      <Bar
        className={cn(
          "w-6",
          selected ? "bg-(--neutral-700)" : "bg-(--neutral-500)",
        )}
      />
    </span>
  )
  return (
    <>
      {card(true)}
      {card(false)}
    </>
  )
}

/** The ⌘K pair as bare keycaps. */
export function KbdDemo() {
  const cap =
    "flex size-5 items-center justify-center rounded-[4px] border border-fg/30 text-[10px] font-medium text-fg/70"
  return (
    <span className="flex shrink-0 items-center gap-1">
      <span className={cap}>⌘</span>
      <span className={cap}>K</span>
    </span>
  )
}
