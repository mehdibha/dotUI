import type { ReactNode } from "react"
import type { Key } from "react-aria-components"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"

import { CHART_SLOTS, slotVar, type ChartSlot } from "./data"

export function PanelSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="space-y-3">
      <h3 className="font-mono text-[11px] tracking-widest text-fg-muted uppercase">
        {title}
      </h3>
      <div className="space-y-2.5">{children}</div>
    </section>
  )
}

export function PanelRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex min-h-8 items-center justify-between gap-4">
      <span className="text-sm text-fg-muted">{label}</span>
      {children}
    </div>
  )
}

export function SlotSelect({
  label,
  value,
  onChange,
}: {
  label: string
  value: ChartSlot
  onChange: (slot: ChartSlot) => void
}) {
  return (
    <PanelRow label={label}>
      <Select
        aria-label={label}
        selectedKey={value}
        onSelectionChange={(key: Key | null) => {
          if (typeof key === "number") onChange(key as ChartSlot)
        }}
        className="w-36"
      >
        <SelectTrigger size="sm" />
        <SelectContent>
          {CHART_SLOTS.map((slot) => (
            <SelectItem key={slot} id={slot} textValue={`Chart ${slot}`}>
              <span
                aria-hidden
                className="size-3 shrink-0 rounded-full"
                style={{ background: slotVar(slot) }}
              />
              Chart {slot}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </PanelRow>
  )
}
