"use client"

import { useLayoutEffect, useRef, useState } from "react"

import {
  ArchiveIcon,
  BoldIcon,
  CopyIcon,
  HomeIcon,
  InboxIcon,
  ItalicIcon,
  PencilIcon,
  PlusIcon,
  SettingsIcon,
  ShareIcon,
  StarIcon,
  TrashIcon,
  UnderlineIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Description, Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { MenuContent, MenuItem } from "@/registry/ui/menu"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Separator } from "@/registry/ui/separator"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContainer,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { TextField } from "@/registry/ui/text-field"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group"

import { Board, BoardSection } from "./board"

const SIZES = ["sm", "md", "lg"] as const

type Read = (el: Element) => string

const height: Read = (el) =>
  `${+el.getBoundingClientRect().height.toFixed(1)}px`

const font: Read = (el) => {
  const style = getComputedStyle(el)
  return `${+parseFloat(style.fontSize).toFixed(1)} / ${+parseFloat(style.lineHeight).toFixed(1)}px`
}

/** Reads `target` (else the first child) after layout and again whenever it
 *  resizes, mounts (collections render their items late) or the root's
 *  tokens or theme change. */
function useMeasure(read: Read, target?: string) {
  const ref = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState("")
  useLayoutEffect(() => {
    const host = ref.current
    if (!host) return
    let el: Element | null = null
    const resize = new ResizeObserver(() => update())
    const update = () => {
      const next = target ? host.querySelector(target) : host.firstElementChild
      if (next !== el) {
        if (el) resize.unobserve(el)
        if (next) resize.observe(next)
        el = next
      }
      if (el) setValue(read(el))
    }
    update()
    const tree = new MutationObserver(update)
    tree.observe(host, { childList: true, subtree: true })
    const root = new MutationObserver(update)
    root.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    })
    return () => {
      resize.disconnect()
      tree.disconnect()
      root.disconnect()
    }
  }, [read, target])
  return [ref, value] as const
}

function Reading({ label, value }: { label?: string; value: string }) {
  return (
    <span className="font-mono text-[11px] whitespace-nowrap text-fg-muted tabular-nums">
      {label && <span className="font-sans">{label} </span>}
      {value || " "}
    </span>
  )
}

/** A specimen with its measured height under it. */
function Spec({
  label,
  target,
  className,
  children,
}: {
  label?: string
  target?: string
  className?: string
  children: React.ReactNode
}) {
  const [ref, value] = useMeasure(height, target)
  return (
    <div className={cn("flex min-w-0 flex-col items-center gap-2", className)}>
      <div ref={ref} className="contents">
        {children}
      </div>
      <Reading label={label} value={value} />
    </div>
  )
}

function Line({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-5">
      {children}
    </div>
  )
}

function Controls() {
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <Line>
        {SIZES.map((size) => (
          <Spec key={size} label={size}>
            <Button size={size} variant="primary">
              Publish
            </Button>
          </Spec>
        ))}
      </Line>
      <Line>
        {SIZES.map((size) => (
          <Spec key={size} label={size}>
            <Button size={size} isIconOnly aria-label="Add">
              <PlusIcon />
            </Button>
          </Spec>
        ))}
      </Line>
      <Line>
        {SIZES.map((size) => (
          <Spec key={size} label={size}>
            <ToggleButtonGroup
              size={size}
              aria-label="Text style"
              selectionMode="multiple"
              defaultSelectedKeys={["bold"]}
            >
              <ToggleButton id="bold" isIconOnly aria-label="Bold">
                <BoldIcon />
              </ToggleButton>
              <ToggleButton id="italic" isIconOnly aria-label="Italic">
                <ItalicIcon />
              </ToggleButton>
              <ToggleButton id="underline" isIconOnly aria-label="Underline">
                <UnderlineIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Spec>
        ))}
      </Line>
    </div>
  )
}

function Pair({
  field,
  target,
  children,
}: {
  field: React.ReactNode
  target: string
  children: React.ReactNode
}) {
  return (
    <>
      <Spec label="field" target={target} className="items-start">
        {field}
      </Spec>
      <Spec label="button" className="items-start">
        {children}
      </Spec>
    </>
  )
}

function Fields() {
  return (
    <div className="grid grid-cols-[minmax(0,13rem)_auto] items-start gap-x-2 gap-y-6">
      <Pair
        target="input"
        field={
          <TextField aria-label="Email" className="w-full">
            <Input placeholder="you@company.com" />
          </TextField>
        }
      >
        <Button variant="primary">Invite</Button>
      </Pair>
      <Pair
        target="button"
        field={
          <Select
            aria-label="Region"
            defaultSelectedKey="fra"
            className="w-full"
          >
            <SelectTrigger />
            <SelectContent>
              <SelectItem id="fra">Frankfurt</SelectItem>
              <SelectItem id="iad">Washington</SelectItem>
              <SelectItem id="sin">Singapore</SelectItem>
            </SelectContent>
          </Select>
        }
      >
        <Button>Deploy</Button>
      </Pair>
      <Pair
        target="[role=group]"
        field={
          <NumberField aria-label="Seats" defaultValue={12} className="w-full">
            <NumberFieldGroup>
              <NumberFieldDecrement />
              <Input />
              <NumberFieldIncrement />
            </NumberFieldGroup>
          </NumberField>
        }
      >
        <Button>Update</Button>
      </Pair>
    </div>
  )
}

const INVOICES = [
  { id: "INV-2041", customer: "Northwind", amount: "$1,240.00" },
  { id: "INV-2040", customer: "Globex", amount: "$860.00" },
  { id: "INV-2039", customer: "Initech", amount: "$2,115.50" },
]

const NAV = [
  { title: "Home", icon: HomeIcon, isActive: true },
  { title: "Inbox", icon: InboxIcon },
  { title: "Archive", icon: ArchiveIcon },
  { title: "Settings", icon: SettingsIcon },
]

function Rows() {
  const { popover } = usePopoverStyles()()
  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-8">
        <Spec label="menu row" target="[role=menuitem]">
          <div className={popover({ className: "w-fit" })}>
            <MenuContent aria-label="Actions" className="min-w-44">
              <MenuItem>
                <PencilIcon />
                Rename
              </MenuItem>
              <MenuItem>
                <CopyIcon />
                Duplicate
              </MenuItem>
              <MenuItem>
                <ShareIcon />
                Share
              </MenuItem>
              <Separator />
              <MenuItem variant="danger">
                <TrashIcon />
                Delete
              </MenuItem>
            </MenuContent>
          </div>
        </Spec>
        <Spec label="list row" target="[role=option]">
          <div className="w-48 rounded-md border bg-card">
            <ListBox
              aria-label="Status"
              selectionMode="single"
              defaultSelectedKeys={["progress"]}
            >
              <ListBoxItem id="backlog">Backlog</ListBoxItem>
              <ListBoxItem id="progress">In progress</ListBoxItem>
              <ListBoxItem id="review">In review</ListBoxItem>
              <ListBoxItem id="done">
                <StarIcon />
                Done
              </ListBoxItem>
            </ListBox>
          </div>
        </Spec>
        <Spec label="sidebar item" target="[data-slot=sidebar-menu-button]">
          <SidebarProvider className="min-h-0 w-48 rounded-(--studio-sidebar-radius,var(--radius-lg)) border bg-sidebar p-2 [--surface-bg:var(--color-sidebar)]">
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={item.isActive}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarProvider>
        </Spec>
      </div>
      <Spec label="table row" target="tbody tr" className="w-full max-w-md">
        <TableContainer className="w-full">
          <Table aria-label="Invoices">
            <TableHeader>
              <TableColumn isRowHeader>Invoice</TableColumn>
              <TableColumn>Customer</TableColumn>
              <TableColumn className="text-right">Amount</TableColumn>
            </TableHeader>
            <TableBody>
              {INVOICES.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {invoice.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Spec>
    </div>
  )
}

/** A specimen with its measured font size / line height beside it. */
function TextSpec({
  target,
  children,
}: {
  target?: string
  children: React.ReactNode
}) {
  const [ref, value] = useMeasure(font, target)
  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <div ref={ref} className="min-w-0">
        {children}
      </div>
      <Reading value={value} />
    </div>
  )
}

function Text() {
  return (
    <div className="flex w-full max-w-md flex-col divide-y">
      <TextSpec target="label">
        <TextField aria-label="Workspace name">
          <Label>Workspace name</Label>
        </TextField>
      </TextSpec>
      <TextSpec target="[slot=description]">
        <TextField>
          <Description>Visible to everyone on your team.</Description>
        </TextField>
      </TextSpec>
      <TextSpec>
        <Button>Save changes</Button>
      </TextSpec>
      <TextSpec target="input">
        <TextField aria-label="Workspace URL" defaultValue="acme.dotui.org">
          <Input />
        </TextField>
      </TextSpec>
    </div>
  )
}

export default function SpaceBoard() {
  return (
    <Board id="space">
      <BoardSection member="controls" title="Controls" axes={["density"]}>
        <Controls />
      </BoardSection>
      <BoardSection
        member="fields"
        title="Fields"
        axes={["density", "inputHeight"]}
      >
        <Fields />
      </BoardSection>
      <BoardSection member="rows" title="Rows" axes={["density", "menuRows"]}>
        <Rows />
      </BoardSection>
      <BoardSection member="text" title="Text" axes={["density", "uiTextSize"]}>
        <Text />
      </BoardSection>
    </Board>
  )
}
