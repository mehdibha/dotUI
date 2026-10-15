"use client"

import { useLayoutEffect, useRef, useState } from "react"
import type { RefObject } from "react"

import { useComponentParams } from "@/lib/styles"
import { CheckIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { useStyles as useDrawerStyles } from "@/registry/ui/drawer/styles"
import { FieldError, Label } from "@/registry/ui/field"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { useStyles as useListStyles } from "@/registry/ui/list-box/styles"
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"

import { Board, BoardSection, useBoardFocus } from "./board"
import { ROW, STAGE, Tip } from "./menus-parts"

const PLANS = [
  { id: "free", name: "Free" },
  { id: "pro", name: "Pro" },
  { id: "team", name: "Team" },
]

function Region({
  error,
  ...props
}: React.ComponentProps<typeof Select> & { error?: string }) {
  return (
    <Select defaultSelectedKey="fra" {...props}>
      <Label>Region</Label>
      <SelectTrigger className="w-full" />
      {error && <FieldError>{error}</FieldError>}
      <SelectContent>
        <SelectItem id="fra">Frankfurt</SelectItem>
        <SelectItem id="iad">Washington</SelectItem>
        <SelectItem id="sin">Singapore</SelectItem>
      </SelectContent>
    </Select>
  )
}

/** An open select, frozen: its trigger over the list it opens. */
function OpenSelect() {
  const { popover } = usePopoverStyles()()
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <Select defaultSelectedKey="pro">
        <Label>Plan</Label>
        <SelectTrigger className="w-full" />
        <SelectContent items={PLANS}>
          {(plan) => <SelectItem>{plan.name}</SelectItem>}
        </SelectContent>
      </Select>
      <div inert className={popover({ className: "w-full" })}>
        <ListBox
          aria-label="Plans"
          items={PLANS}
          selectionMode="single"
          defaultSelectedKeys={["pro"]}
        >
          {(plan) => <ListBoxItem>{plan.name}</ListBoxItem>}
        </ListBox>
      </div>
    </div>
  )
}

function WithButton() {
  return (
    <div className="flex w-full items-end gap-2">
      <Select defaultSelectedKey="main" className="min-w-0 flex-1">
        <Label>Branch</Label>
        <SelectTrigger className="w-full" />
        <SelectContent>
          <SelectItem id="main">main</SelectItem>
          <SelectItem id="dev">develop</SelectItem>
        </SelectContent>
      </Select>
      <Button>Deploy</Button>
    </div>
  )
}

const ORDER_ROW = 45

const SORTS = ["Newest first", "Oldest first", "Price: low to high"]

const ORDERS = [
  { label: "#1042 · Maya Chen", meta: "$248.00" },
  { label: "#1041 · Leo Park", meta: "$96.50" },
  { label: "#1040 · Ana Ruiz", meta: "$1,120.00" },
  { label: "#1039 · Sam Ito", meta: "$64.00" },
  { label: "#1038 · Noor Haddad", meta: "$310.00" },
  { label: "#1037 · Jonas Weber", meta: "$72.40" },
  { label: "#1036 · Iris Moreau", meta: "$185.00" },
  { label: "#1035 · Tomás Silva", meta: "$42.90" },
]

/** A row height near `row` that ends a whole row at the picker's bottom, so none peeks out half-covered. */
function useRowHeight(
  list: RefObject<HTMLElement | null>,
  picker: RefObject<HTMLElement | null>,
  row: number,
  open: boolean,
) {
  const [height, setHeight] = useState<number>()
  useLayoutEffect(() => {
    const l = list.current
    const p = picker.current
    if (!open || !l || !p) return
    const measure = () => {
      const room =
        p.getBoundingClientRect().bottom - l.getBoundingClientRect().top
      setHeight(room / Math.max(1, Math.round(room / row)))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(p)
    return () => observer.disconnect()
  }, [list, picker, row, open])
  return open ? height : undefined
}

function SortRows() {
  const { root, item, indicator, itemLabel } = useListStyles()()
  return (
    <div data-listbox="" className={root()}>
      {SORTS.map((label, i) => (
        <div
          key={label}
          data-listbox-item=""
          {...ROW}
          data-selection-mode="single"
          data-selected={i === 0 || undefined}
          className={item()}
        >
          <span className={indicator()}>{i === 0 && <CheckIcon />}</span>
          <span className={itemLabel()}>{label}</span>
        </div>
      ))}
    </div>
  )
}

/** A phone-wide page with its picker open, as a drawer or anchored. */
function Phone() {
  const mobile = useComponentParams("popover").mobile ?? "drawer"
  const { popover, arrow } = usePopoverStyles()()
  const list = useRef<HTMLUListElement>(null)
  const picker = useRef<HTMLDivElement>(null)
  const height =
    useRowHeight(list, picker, ORDER_ROW, mobile === "anchored") ?? ORDER_ROW
  const { overlay, backdrop, popup, handle } = useDrawerStyles()({
    placement: "bottom",
  })
  return (
    <div
      inert
      className="relative isolate flex min-h-0 grow basis-96 flex-col overflow-hidden"
    >
      <div className="flex flex-col gap-4 px-4 pt-6">
        <span className="text-lg font-medium">Orders</span>
        <Select aria-label="Sort" defaultSelectedKey="newest">
          <SelectTrigger className="w-full" />
          <SelectContent>
            <SelectItem id="newest">Newest first</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-2 grid">
        <ul ref={list} className="col-start-1 row-start-1 flex flex-col px-5">
          {ORDERS.map((order) => (
            <li
              key={order.label}
              style={{ height }}
              className="flex shrink-0 items-center gap-3 border-b text-sm last:border-b-0"
            >
              <span className="truncate">{order.label}</span>
              <span className="ml-auto text-fg-muted tabular-nums">
                {order.meta}
              </span>
            </li>
          ))}
        </ul>
        {mobile === "anchored" && (
          <div
            ref={picker}
            data-popover=""
            data-trigger="Select"
            data-placement="bottom"
            className={popover({
              className:
                "relative col-start-1 row-start-1 mx-4 self-start overflow-visible",
            })}
          >
            <SortRows />
            <Tip className={arrow()} placement="bottom" size={12} />
          </div>
        )}
      </div>
      {mobile === "drawer" && (
        <div className={overlay({ className: "absolute z-10" })}>
          {/* Its blur escapes the box's clip unless it carries the box's radius. */}
          <div
            className={backdrop({
              className: "rounded-[calc(var(--studio-radius-panel)-1px)]",
            })}
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col">
            <div data-drawer="" className={popup()}>
              <div data-orientation="horizontal" className={handle()} />
              <SortRows />
              <div className="h-3 shrink-0" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const GRID =
  "grid w-full grid-cols-1 items-start gap-x-5 gap-y-6 @lg/section:grid-cols-2"

export default function SelectBoard() {
  const { axis } = useBoardFocus()
  return (
    <Board id="select">
      <div className="@container/split">
        <div className="grid grid-cols-1 gap-8 @3xl/split:grid-cols-[minmax(0,1fr)_21.25rem]">
          <div
            className={cn(
              "flex min-w-0 flex-col gap-8 transition-opacity duration-300",
              axis === "mobilePickers" && "opacity-35",
            )}
          >
            <BoardSection title="Variants">
              <div className={GRID}>
                <div className="flex min-w-0 flex-col gap-6">
                  <Region />
                  <WithButton />
                </div>
                <OpenSelect />
              </div>
            </BoardSection>
            <BoardSection title="States">
              <div className={GRID}>
                <Region isDisabled />
                <Region
                  isInvalid
                  defaultSelectedKey={null}
                  placeholder="Choose a region"
                  error="Pick a region to deploy to."
                />
              </div>
            </BoardSection>
          </div>
          <BoardSection title="Mobile" className={STAGE}>
            <Phone />
          </BoardSection>
        </div>
      </div>
    </Board>
  )
}
