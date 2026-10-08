"use client"

import { useEffect, useRef, useState } from "react"

import {
  BoldIcon,
  CheckIcon,
  CopyIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  ShareIcon,
  TrashIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/ui/card"
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { useStyles as useDialogStyles } from "@/registry/ui/dialog/styles"
import { useStyles as useDrawerStyles } from "@/registry/ui/drawer/styles"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { Kbd, KbdGroup } from "@/registry/ui/kbd"
import { useStyles as useListStyles } from "@/registry/ui/list-box/styles"
import { useStyles as useMenuStyles } from "@/registry/ui/menu/styles"
import { useStyles as useModalStyles } from "@/registry/ui/modal/styles"
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarOutput,
} from "@/registry/ui/progress-bar"
import { Radio, RadioControl, RadioGroup } from "@/registry/ui/radio-group"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Separator } from "@/registry/ui/separator"
import { Slider, SliderControl, SliderOutput } from "@/registry/ui/slider"
import { Switch, SwitchControl } from "@/registry/ui/switch"
import { Tag, TagGroup, TagList } from "@/registry/ui/tag-group"
import { TextField } from "@/registry/ui/text-field"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { useStyles as useTooltipStyles } from "@/registry/ui/tooltip/styles"

import {
  Board,
  BoardSection,
  CAPTION,
  Specimen,
  stateProps,
  useRootTokens,
} from "./board"

const ROLES = [
  {
    key: "roleControl",
    label: "Controls",
    className: "rounded-(--studio-radius-control)",
  },
  {
    key: "roleItem",
    label: "Items",
    className: "rounded-(--studio-radius-item)",
  },
  {
    key: "roleSurface",
    label: "Surfaces",
    className: "rounded-(--studio-radius-surface)",
  },
  {
    key: "rolePanel",
    label: "Panels",
    className: "rounded-(--studio-radius-panel)",
  },
  {
    key: "roleCard",
    label: "Cards",
    className: "rounded-(--studio-radius-card)",
  },
]

function radiusLabel(element: HTMLElement) {
  const px = Number.parseFloat(getComputedStyle(element).borderTopLeftRadius)
  if (!px) return "None"
  if (px > 999) return "Pill"
  return `${Math.round(px * 10) / 10}px`
}

function RoleTile({
  label,
  className,
  version,
}: {
  label: string
  className: string
  version: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [radius, setRadius] = useState("")
  // After the provider's layout effect has written the root's tokens.
  useEffect(() => {
    if (ref.current) setRadius(radiusLabel(ref.current))
  }, [version])
  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <span
        ref={ref}
        className={cn(
          "aspect-square w-full max-w-20 border bg-card shadow-xs",
          className,
        )}
      />
      <span className="flex flex-col items-center text-xs">
        <span>{label}</span>
        <span className={cn(CAPTION, "tabular-nums")}>{radius}</span>
      </span>
    </div>
  )
}

function Ladder() {
  const version = useRootTokens()
  return (
    <div className="grid w-full max-w-xl grid-cols-5 gap-2 sm:gap-6">
      {ROLES.map((role) => (
        <RoleTile
          key={role.key}
          label={role.label}
          className={role.className}
          version={version}
        />
      ))}
    </div>
  )
}

/** A frozen row: menu and list rows only light up under the pointer. */
function FrozenRow({
  className,
  state,
  selected,
  danger,
  children,
}: {
  className: string
  state?: "hover" | "focus"
  selected?: boolean
  danger?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      {...stateProps(...(state ? [state] : []))}
      data-selected={selected || undefined}
      data-variant={danger ? "danger" : undefined}
      className={className}
    >
      {children}
    </div>
  )
}

function MenuSpecimen() {
  const { popover } = usePopoverStyles()()
  const { root, item, itemLabel } = useMenuStyles()()
  return (
    <div inert data-popover="" className={popover({ className: "w-52" })}>
      <div className={root()}>
        <FrozenRow className={item()}>
          <PencilIcon />
          <span className={itemLabel()}>Rename</span>
          <Kbd>⌘R</Kbd>
        </FrozenRow>
        <FrozenRow className={item()} state="focus">
          <CopyIcon />
          <span className={itemLabel()}>Duplicate</span>
          <Kbd>⌘D</Kbd>
        </FrozenRow>
        <FrozenRow className={item()}>
          <ShareIcon />
          <span className={itemLabel()}>Share</span>
        </FrozenRow>
        <Separator />
        <FrozenRow className={item()} danger>
          <TrashIcon />
          <span className={itemLabel()}>Delete</span>
        </FrozenRow>
      </div>
    </div>
  )
}

function ListSpecimen() {
  const { root, item, indicator, itemLabel } = useListStyles()()
  const rows = [
    { label: "Inbox", selected: true },
    { label: "Drafts", state: "hover" as const },
    { label: "Sent" },
    { label: "Archive" },
  ]
  return (
    <div inert className={root({ className: "w-44 p-1" })}>
      {rows.map((row) => (
        <FrozenRow
          key={row.label}
          className={item()}
          state={row.state}
          selected={row.selected}
        >
          <span data-selection-mode="single" className={indicator()}>
            {row.selected && <CheckIcon />}
          </span>
          <span className={itemLabel()}>{row.label}</span>
        </FrozenRow>
      ))}
    </div>
  )
}

function SelectOpenSpecimen() {
  const { popover } = usePopoverStyles()()
  const { root, item, indicator, itemLabel } = useListStyles()()
  const rows = ["Last 24 hours", "Last 7 days", "Last 30 days"]
  return (
    <div className="flex w-52 flex-col gap-1">
      <Select aria-label="Range" defaultSelectedKey="7d" className="w-full">
        <SelectTrigger />
        <SelectContent>
          <SelectItem id="24h">Last 24 hours</SelectItem>
          <SelectItem id="7d">Last 7 days</SelectItem>
          <SelectItem id="30d">Last 30 days</SelectItem>
        </SelectContent>
      </Select>
      <div inert data-popover="" className={popover()}>
        <div className={root()}>
          {rows.map((label, index) => (
            <FrozenRow
              key={label}
              className={item()}
              state={index === 2 ? "focus" : undefined}
              selected={index === 1}
            >
              <span data-selection-mode="single" className={indicator()}>
                {index === 1 && <CheckIcon />}
              </span>
              <span className={itemLabel()}>{label}</span>
            </FrozenRow>
          ))}
        </div>
      </div>
    </div>
  )
}

function PopoverSpecimen() {
  const { popover } = usePopoverStyles()()
  const { content } = useDialogStyles()()
  return (
    <div inert data-popover="" className={popover({ className: "w-72" })}>
      <div className={content()}>
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>Anyone with the link can view.</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <TextField aria-label="Link" className="min-w-0 flex-1">
            <Input value="dotui.org/s/k2f9" readOnly />
          </TextField>
          <Button>Copy</Button>
        </div>
      </div>
    </div>
  )
}

function TooltipSpecimen() {
  const { content } = useTooltipStyles()()
  return (
    <div inert className="flex flex-col items-center gap-2">
      <div className={content()}>Copy link</div>
      <Button variant="secondary" isIconOnly aria-label="Copy link">
        <CopyIcon />
      </Button>
    </div>
  )
}

function DialogSpecimen() {
  const { modal } = useModalStyles()()
  const { content } = useDialogStyles()()
  return (
    <div inert data-modal="" className={modal({ className: "w-full" })}>
      <div className={content()}>
        <DialogHeader>
          <DialogTitle>Delete project?</DialogTitle>
          <DialogDescription>
            This removes Acme Web and its 14 deployments.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Cancel</Button>
          <Button variant="danger">Delete</Button>
        </DialogFooter>
      </div>
    </div>
  )
}

/** A bottom drawer's top edge; its empty body fades where the screen would end. */
function DrawerSpecimen() {
  const { popup, handle } = useDrawerStyles()({ placement: "bottom" })
  const { content } = useDialogStyles()()
  return (
    <div
      inert
      // Padded so the mask keeps the drawer's shadow.
      className="-mx-5 w-[calc(100%+2.5rem)] mask-[linear-gradient(to_bottom,black_calc(100%-3rem),transparent)] px-5 pt-6"
    >
      <div
        data-drawer=""
        className={popup({ className: "[--drawer-bleed:0px]" })}
      >
        <div data-orientation="horizontal" className={handle()} />
        <div className={content()}>
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
            <DialogDescription>Narrow results by status.</DialogDescription>
          </DialogHeader>
          <div className="h-12" />
        </div>
      </div>
    </div>
  )
}

export default function ShapeBoard() {
  return (
    <Board id="shape">
      <BoardSection member="radius" title="Radius" axes={["radiusPx"]}>
        <Ladder />
      </BoardSection>

      <BoardSection
        member="controls"
        title="Controls"
        axes={["roleControl"]}
        className="flex-col gap-6"
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <Button variant="primary">Publish</Button>
            <Button variant="secondary">Preview</Button>
          </div>
          <div className="flex items-center gap-2">
            <ToggleButton defaultSelected>
              <BoldIcon data-icon="inline-start" />
              Bold
            </ToggleButton>
            <Button variant="secondary" isIconOnly aria-label="Add">
              <PlusIcon />
            </Button>
            <Button variant="secondary" size="xs">
              Edit
            </Button>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-3">
          <TextField aria-label="Search" className="w-full max-w-60">
            <Input placeholder="Search projects" />
          </TextField>
          <Select
            aria-label="Status"
            defaultSelectedKey="active"
            className="w-full max-w-40"
          >
            <SelectTrigger />
            <SelectContent>
              <SelectItem id="active">Active</SelectItem>
              <SelectItem id="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Checkbox defaultSelected>
            <CheckboxControl />
            <Label>Remember me</Label>
          </Checkbox>
          <TagGroup aria-label="Labels">
            <TagList>
              <Tag>Design</Tag>
              <Tag>Bug</Tag>
              <Tag>v2.1</Tag>
            </TagList>
          </TagGroup>
        </div>
      </BoardSection>

      <BoardSection
        member="items"
        title="Items"
        axes={["roleItem"]}
        className="items-start gap-x-12 gap-y-8"
      >
        <Specimen label="Menu">
          <MenuSpecimen />
        </Specimen>
        <Specimen label="List box">
          <ListSpecimen />
        </Specimen>
      </BoardSection>

      <BoardSection
        member="surfaces"
        title="Surfaces"
        axes={["roleSurface"]}
        className="@container"
      >
        {/* Two columns keep the tooltip under the select, not alone on a row. */}
        <div className="grid w-full grid-cols-1 items-start justify-items-center gap-x-12 gap-y-8 @xl:grid-cols-2 @3xl:grid-cols-3">
          <Specimen label="Popover" className="@xl:row-span-2 @3xl:row-span-1">
            <PopoverSpecimen />
          </Specimen>
          <Specimen label="Select">
            <SelectOpenSpecimen />
          </Specimen>
          <Specimen label="Tooltip">
            <TooltipSpecimen />
          </Specimen>
        </div>
      </BoardSection>

      <BoardSection
        member="panels"
        title="Panels"
        axes={["rolePanel"]}
        className="items-center gap-x-10 gap-y-8"
      >
        <Specimen label="Dialog" className="w-full max-w-sm">
          <DialogSpecimen />
        </Specimen>
        <Specimen label="Drawer" className="w-full max-w-sm">
          <DrawerSpecimen />
        </Specimen>
      </BoardSection>

      <BoardSection
        member="cards"
        title="Cards"
        axes={["roleCard"]}
        className="grid grid-cols-1 items-stretch sm:grid-cols-2"
      >
        <Card>
          <CardHeader>
            <CardDescription>Revenue</CardDescription>
            <CardTitle className="text-2xl tabular-nums">$12,480</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="success">+8.2% this month</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Acme Web</CardTitle>
            <CardDescription>Deployed 2h ago from main</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="secondary">Open project</Button>
          </CardFooter>
        </Card>
      </BoardSection>

      <BoardSection
        member="tracks"
        title="Tracks"
        axes={["tracks"]}
        className="grid grid-cols-1 gap-8 sm:grid-cols-[auto_1fr_1fr] sm:items-end"
      >
        <div className="flex flex-col gap-3">
          <Switch defaultSelected>
            <SwitchControl />
            <Label>Wi-Fi</Label>
          </Switch>
          <Switch>
            <SwitchControl />
            <Label>Bluetooth</Label>
          </Switch>
        </div>
        <Slider defaultValue={60} className="w-full">
          <div className="flex items-center justify-between gap-2">
            <Label>Volume</Label>
            <SliderOutput />
          </div>
          <SliderControl />
        </Slider>
        <ProgressBar value={72} className="w-full">
          <div className="flex items-center justify-between gap-2">
            <Label>Uploading</Label>
            <ProgressBarOutput />
          </div>
          <ProgressBarControl />
        </ProgressBar>
      </BoardSection>

      <BoardSection
        member="stroke"
        title="Stroke"
        axes={["controlStroke"]}
        className="flex-col gap-6"
      >
        <div className="flex w-full flex-wrap items-center justify-center gap-3">
          <TextField aria-label="Email" className="w-full max-w-60">
            <Input placeholder="you@company.com" />
          </TextField>
          <Button variant="secondary">
            <SearchIcon data-icon="inline-start" />
            Search
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Checkbox>
            <CheckboxControl />
            <Label>Email me</Label>
          </Checkbox>
          <RadioGroup
            aria-label="Plan"
            defaultValue="monthly"
            orientation="horizontal"
            className="flex-row gap-6"
          >
            <Radio value="monthly">
              <RadioControl />
              <Label>Monthly</Label>
            </Radio>
            <Radio value="yearly">
              <RadioControl />
              <Label>Yearly</Label>
            </Radio>
          </RadioGroup>
          <SegmentedControl defaultSelectedKeys={["week"]} aria-label="Range">
            <SegmentedControlItem id="day">Day</SegmentedControlItem>
            <SegmentedControlItem id="week">Week</SegmentedControlItem>
            <SegmentedControlItem id="month">Month</SegmentedControlItem>
          </SegmentedControl>
        </div>
      </BoardSection>
    </Board>
  )
}
