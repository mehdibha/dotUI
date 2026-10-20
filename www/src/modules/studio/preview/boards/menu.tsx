"use client"

import { useRef } from "react"

import {
  CheckIcon,
  ChevronRightIcon,
  CopyIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  ImageIcon,
  LayoutGridIcon,
  ListIcon,
  MoreHorizontalIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
  TypeIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Kbd } from "@/registry/ui/kbd"
import { useStyles as useListStyles } from "@/registry/ui/list-box/styles"
import {
  MenuContent,
  MenuItem,
  MenuItemLabel,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import { useStyles as useMenuStyles } from "@/registry/ui/menu/styles"
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Separator } from "@/registry/ui/separator"

import { Board, BoardSection, RAC_STATE, usePresence, useReplay } from "./board"
import {
  POINTED,
  REPLAY,
  ROW,
  Split,
  STAGE,
  Tip,
  useAnchor,
} from "./menus-parts"

const FILES = [
  {
    icon: <FileTextIcon />,
    label: "Guidelines.pdf",
    meta: "2.4 MB",
    tint: "bg-accent-muted text-fg-accent",
  },
  {
    icon: <ImageIcon />,
    label: "Logo.svg",
    meta: "24 KB",
    tint: "bg-warning-muted text-fg-warning",
  },
  {
    icon: <ImageIcon />,
    label: "Hero photo.jpg",
    meta: "3.1 MB",
    tint: "bg-success-muted text-fg-success",
  },
  {
    icon: <FileCodeIcon />,
    label: "tokens.json",
    meta: "8 KB",
    tint: "bg-info-muted text-fg-info",
  },
  {
    icon: <FileIcon />,
    label: "Launch deck.key",
    meta: "18 MB",
    tint: "bg-danger-muted text-fg-danger",
  },
  {
    icon: <TypeIcon />,
    label: "Inter.woff2",
    meta: "312 KB",
    tint: "bg-muted text-fg-muted",
  },
]

/** Tinted thumbnails, so glass has colour to blur; the menu overlaps the last column. */
function Gallery() {
  return (
    <ul className="col-start-1 row-start-1 grid grid-cols-2 gap-x-4 gap-y-5 p-6 max-sm:p-4 @lg/section:grid-cols-3 @max-lg/section:[&>li:nth-child(n+5)]:hidden">
      {FILES.map((file) => (
        <li key={file.label} className="flex min-w-0 flex-col gap-2">
          <span
            className={cn(
              "flex h-28 items-center justify-center rounded-(--studio-radius-surface) @lg/section:h-32 [&_svg]:size-6",
              file.tint,
            )}
          >
            {file.icon}
          </span>
          <span className="flex flex-col text-sm">
            <span className="truncate">{file.label}</span>
            <span className="text-xs text-fg-muted tabular-nums">
              {file.meta}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}

/** The menu's first section; the replay opens the same rows. */
function FileSection({ pointed }: { pointed?: boolean }) {
  const { item, submenuIndicator, itemLabel, section, sectionTitle } =
    useMenuStyles()()
  return (
    <section className={section()}>
      <header className={sectionTitle()}>File</header>
      <div {...ROW} className={item()}>
        <PencilIcon />
        <span className={itemLabel()}>Rename</span>
        <Kbd>⌘R</Kbd>
      </div>
      <div {...(pointed ? POINTED : ROW)} className={item()}>
        <CopyIcon />
        <span className={itemLabel()}>Duplicate</span>
        <Kbd>⌘D</Kbd>
      </div>
      <div {...ROW} data-has-submenu="true" className={item()}>
        <ShareIcon />
        <span className={itemLabel()}>Share</span>
        <span className={submenuIndicator()}>
          <ChevronRightIcon className="size-4" />
        </span>
      </div>
    </section>
  )
}

/** The same rows, live. */
function LiveFileSection() {
  const { submenuIndicator } = useMenuStyles()()
  return (
    <MenuSection>
      <MenuSectionHeader>File</MenuSectionHeader>
      <MenuItem textValue="Rename">
        <PencilIcon />
        <MenuItemLabel>Rename</MenuItemLabel>
        <Kbd>⌘R</Kbd>
      </MenuItem>
      <MenuItem textValue="Duplicate">
        <CopyIcon />
        <MenuItemLabel>Duplicate</MenuItemLabel>
        <Kbd>⌘D</Kbd>
      </MenuItem>
      <MenuItem textValue="Share">
        <ShareIcon />
        <MenuItemLabel>Share</MenuItemLabel>
        <span className={submenuIndicator()}>
          <ChevronRightIcon className="size-4" />
        </span>
      </MenuItem>
    </MenuSection>
  )
}

function MenuSpecimen() {
  const { popover, arrow } = usePopoverStyles()()
  const { root, item, indicator, itemLabel, section, sectionTitle } =
    useMenuStyles()()
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const anchor = useAnchor(trigger, panel)

  const check = (selected: boolean) => (
    <span className={indicator()}>{selected && <CheckIcon />}</span>
  )

  return (
    <div inert className="flex flex-col">
      <div className="flex items-center gap-3 border-b px-6 py-3 max-sm:px-4">
        <FolderIcon className="size-4 text-fg-muted" />
        <span className="text-sm font-medium">Brand assets</span>
        <Button
          ref={trigger}
          variant="quiet"
          isIconOnly
          aria-label="More"
          className="ml-auto"
        >
          <MoreHorizontalIcon />
        </Button>
      </div>
      <div className="grid">
        <Gallery />
        <div
          ref={panel}
          data-popover=""
          data-trigger="MenuTrigger"
          data-placement="bottom"
          className={popover({
            className:
              "relative col-start-1 row-start-1 -mt-1 mr-6 mb-6 w-56 self-start justify-self-end max-sm:mr-4",
          })}
        >
          <div role="menu" className={root()}>
            <FileSection pointed />
            <Separator />
            <section className={section()}>
              <header className={sectionTitle()}>View as</header>
              <div
                {...ROW}
                data-selection-mode="single"
                data-selected="true"
                className={item()}
              >
                {check(true)}
                <LayoutGridIcon />
                <span className={itemLabel()}>Grid</span>
              </div>
              <div {...ROW} data-selection-mode="single" className={item()}>
                {check(false)}
                <ListIcon />
                <span className={itemLabel()}>List</span>
              </div>
            </section>
            <Separator />
            <div {...ROW} data-variant="danger" className={item()}>
              <TrashIcon />
              <span className={itemLabel()}>Delete</span>
              <Kbd>⌘⌫</Kbd>
            </div>
          </div>
          {anchor && (
            <Tip
              className={arrow()}
              placement="bottom"
              size={12}
              left={anchor.x}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const LABELS = [
  { label: "Bug", dot: "bg-danger", selected: true },
  { label: "Design", dot: "bg-accent", selected: true, pointed: true },
  { label: "Docs", dot: "bg-success" },
  { label: "Performance", dot: "bg-warning" },
]

/** A multiple-selection picker: the same rows, two selected, one under the pointer. */
function PickerSpecimen() {
  const { popover } = usePopoverStyles()()
  const { root, item, indicator, itemLabel } = useListStyles()()
  return (
    <div inert className="flex w-full flex-col gap-1">
      <Select
        aria-label="Labels"
        selectionMode="multiple"
        defaultValue={["Bug", "Design"]}
      >
        <SelectTrigger className="w-full" />
        <SelectContent items={LABELS}>
          {(row) => <SelectItem id={row.label}>{row.label}</SelectItem>}
        </SelectContent>
      </Select>
      <div
        data-popover=""
        data-trigger="Select"
        className={popover({ className: "w-full" })}
      >
        <div data-listbox="" className={root()}>
          {LABELS.map((row) => (
            <div
              key={row.label}
              data-listbox-item=""
              {...(row.pointed ? POINTED : ROW)}
              data-selection-mode="multiple"
              data-selected={row.selected || undefined}
              className={item()}
            >
              <span className={indicator()}>
                {row.selected && <CheckIcon />}
              </span>
              <span className={cn("size-2 shrink-0 rounded-full", row.dot)} />
              <span className={itemLabel()}>{row.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const MOTION_KEYS = ["popoverMotion", "popoverEntrance"]

function MenuReplay() {
  const ref = useRef<HTMLDivElement>(null)
  const motion = useReplay(...MOTION_KEYS)
  const phase = usePresence(ref, motion, { closed: 600 })
  const { popover, arrow } = usePopoverStyles()()
  const { root } = useMenuStyles()()
  return (
    <div ref={ref} inert={motion.running} className="relative h-fit">
      <Button variant="secondary" isIconOnly aria-label="More">
        <MoreHorizontalIcon />
      </Button>
      {phase !== "closed" && (
        <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2">
          <div
            data-rac=""
            data-popover=""
            data-trigger="MenuTrigger"
            data-placement="bottom"
            {...RAC_STATE[phase]}
            className={popover({ className: "w-48" })}
            style={
              {
                "--trigger-anchor-point": "50% 0",
                "--trigger-width": "0px",
              } as React.CSSProperties
            }
          >
            {motion.running ? (
              <div role="menu" className={root()}>
                <FileSection />
              </div>
            ) : (
              <MenuContent aria-label="File">
                <LiveFileSection />
              </MenuContent>
            )}
            <Tip className={arrow()} placement="bottom" size={12} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function MenuBoard() {
  return (
    <Board id="menu">
      <Split>
        <BoardSection title="In context" className={STAGE}>
          <MenuSpecimen />
        </BoardSection>
        <BoardSection title="Picker" className="p-6 max-sm:p-4">
          <PickerSpecimen />
        </BoardSection>
        <BoardSection title="Motion" className={cn(REPLAY, "h-52")}>
          <MenuReplay />
        </BoardSection>
      </Split>
    </Board>
  )
}
