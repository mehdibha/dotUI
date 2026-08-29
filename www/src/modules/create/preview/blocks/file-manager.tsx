"use client"

import { useMemo, useState } from "react"
import { Pressable } from "react-aria-components/Pressable"

import {
  ArchiveIcon,
  AudioLinesIcon,
  BellIcon,
  CaptionsIcon,
  DownloadIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
  FolderPlusIcon,
  ImageIcon,
  LayoutGridIcon,
  LinkIcon,
  ListIcon,
  MoreVerticalIcon,
  PencilIcon,
  PenToolIcon,
  ServerIcon,
  ShareIcon,
  StarIcon,
  TableIcon,
  Trash2Icon,
  UploadIcon,
  Users2Icon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  Breadcrumbs,
  BreadcrumbSeparator,
} from "@/registry/ui/breadcrumbs"
import { Button } from "@/registry/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/ui/card"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { DropZone, DropZoneLabel } from "@/registry/ui/drop-zone"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import { Label } from "@/registry/ui/field"
import { FileTrigger } from "@/registry/ui/file-trigger"
import { Input } from "@/registry/ui/input"
import { Kbd } from "@/registry/ui/kbd"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Modal } from "@/registry/ui/modal"
import { Popover } from "@/registry/ui/popover"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarOutput,
} from "@/registry/ui/progress-bar"
import { SearchField } from "@/registry/ui/search-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Separator } from "@/registry/ui/separator"
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
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { Tree, TreeItem, TreeItemContent } from "@/registry/ui/tree"

/* ---------------------------------------------------------------------------
 * File Manager — a team drive: folder tree, breadcrumbs, upload drop zone,
 * grid / list views of the same files, per-file menus and storage usage.
 * ------------------------------------------------------------------------- */

type FileKind =
  | "design"
  | "doc"
  | "sheet"
  | "pdf"
  | "image"
  | "video"
  | "audio"
  | "archive"
  | "code"

interface FileEntry {
  id: string
  name: string
  kind: FileKind
  bytes: number
  modified: string
  owner: string
  shared?: boolean
  starred?: boolean
}

interface SubFolder {
  id: string
  name: string
}

interface FolderNode {
  name: string
  trail: { id: string; name: string }[]
  folders: SubFolder[]
  files: FileEntry[]
}

const KINDS: Record<
  FileKind,
  { label: string; icon: typeof FileIcon; tone: string }
> = {
  design: {
    label: "Design",
    icon: PenToolIcon,
    tone: "bg-accent-muted text-fg-accent",
  },
  doc: {
    label: "Document",
    icon: FileTextIcon,
    tone: "bg-info-muted text-fg-info",
  },
  sheet: {
    label: "Spreadsheet",
    icon: TableIcon,
    tone: "bg-success-muted text-fg-success",
  },
  pdf: { label: "PDF", icon: FileIcon, tone: "bg-danger-muted text-fg-danger" },
  image: {
    label: "Image",
    icon: ImageIcon,
    tone: "bg-warning-muted text-fg-warning",
  },
  video: { label: "Video", icon: CaptionsIcon, tone: "bg-muted text-fg" },
  audio: {
    label: "Audio",
    icon: AudioLinesIcon,
    tone: "bg-accent-muted text-fg-accent",
  },
  archive: {
    label: "Archive",
    icon: ArchiveIcon,
    tone: "bg-muted text-fg-muted",
  },
  code: {
    label: "Code",
    icon: FileCodeIcon,
    tone: "bg-info-muted text-fg-info",
  },
}

const ROOT = { id: "workspace", name: "Meridian" }
const DESIGN = { id: "design", name: "Product Design" }

const WORKSPACE: FolderNode = {
  name: "Meridian",
  trail: [],
  folders: [
    { id: "design", name: "Product Design" },
    { id: "marketing", name: "Marketing" },
    { id: "engineering", name: "Engineering" },
    { id: "finance", name: "Finance" },
  ],
  files: [
    {
      id: "w1",
      name: "Company handbook.pdf",
      kind: "pdf",
      bytes: 4_820_000,
      modified: "2026-08-19",
      owner: "Priya Raman",
      shared: true,
    },
    {
      id: "w2",
      name: "All-hands — August.mp4",
      kind: "video",
      bytes: 1_940_000_000,
      modified: "2026-08-14",
      owner: "Tomas Lindqvist",
    },
    {
      id: "w3",
      name: "Headcount plan FY27.xlsx",
      kind: "sheet",
      bytes: 268_000,
      modified: "2026-08-06",
      owner: "Dana Okafor",
      starred: true,
    },
  ],
}

const FOLDERS: Record<string, FolderNode> = {
  workspace: WORKSPACE,
  design: {
    name: "Product Design",
    trail: [ROOT],
    folders: [
      { id: "brand", name: "Brand" },
      { id: "webapp", name: "Web App" },
    ],
    files: [
      {
        id: "d1",
        name: "Meridian design system.fig",
        kind: "design",
        bytes: 184_300_000,
        modified: "2026-08-21",
        owner: "Elena Vasquez",
        shared: true,
        starred: true,
      },
      {
        id: "d2",
        name: "Navigation exploration.fig",
        kind: "design",
        bytes: 96_700_000,
        modified: "2026-08-18",
        owner: "Elena Vasquez",
      },
      {
        id: "d3",
        name: "Usability study — round 4.pdf",
        kind: "pdf",
        bytes: 12_400_000,
        modified: "2026-08-12",
        owner: "Marcus Bell",
        shared: true,
      },
      {
        id: "d4",
        name: "Onboarding walkthrough.mp4",
        kind: "video",
        bytes: 742_000_000,
        modified: "2026-08-09",
        owner: "Marcus Bell",
      },
      {
        id: "d5",
        name: "Icon audit.xlsx",
        kind: "sheet",
        bytes: 412_000,
        modified: "2026-07-30",
        owner: "Jae-won Park",
      },
      {
        id: "d6",
        name: "Design critique notes.docx",
        kind: "doc",
        bytes: 88_000,
        modified: "2026-07-24",
        owner: "Elena Vasquez",
      },
    ],
  },
  brand: {
    name: "Brand",
    trail: [ROOT, DESIGN],
    folders: [],
    files: [],
  },
  webapp: {
    name: "Web App",
    trail: [ROOT, DESIGN],
    folders: [],
    files: [
      {
        id: "wa1",
        name: "Dashboard v4.fig",
        kind: "design",
        bytes: 212_900_000,
        modified: "2026-08-20",
        owner: "Jae-won Park",
        starred: true,
      },
      {
        id: "wa2",
        name: "Empty states.fig",
        kind: "design",
        bytes: 41_800_000,
        modified: "2026-08-15",
        owner: "Elena Vasquez",
      },
      {
        id: "wa3",
        name: "Settings redesign spec.docx",
        kind: "doc",
        bytes: 164_000,
        modified: "2026-08-11",
        owner: "Marcus Bell",
        shared: true,
      },
      {
        id: "wa4",
        name: "Dashboard hero export.png",
        kind: "image",
        bytes: 6_180_000,
        modified: "2026-08-08",
        owner: "Jae-won Park",
      },
      {
        id: "wa5",
        name: "motion-tokens.json",
        kind: "code",
        bytes: 22_400,
        modified: "2026-08-04",
        owner: "Rafael Costa",
      },
    ],
  },
  marketing: {
    name: "Marketing",
    trail: [ROOT],
    folders: [{ id: "launch", name: "Q3 Launch" }],
    files: [
      {
        id: "m1",
        name: "Positioning narrative.docx",
        kind: "doc",
        bytes: 214_000,
        modified: "2026-08-17",
        owner: "Dana Okafor",
        shared: true,
      },
      {
        id: "m2",
        name: "Paid channel model.xlsx",
        kind: "sheet",
        bytes: 1_120_000,
        modified: "2026-08-13",
        owner: "Dana Okafor",
        starred: true,
      },
      {
        id: "m3",
        name: "Podcast spot — final mix.wav",
        kind: "audio",
        bytes: 148_600_000,
        modified: "2026-08-05",
        owner: "Tomas Lindqvist",
      },
      {
        id: "m4",
        name: "Press kit.zip",
        kind: "archive",
        bytes: 812_000_000,
        modified: "2026-07-28",
        owner: "Priya Raman",
      },
    ],
  },
  launch: {
    name: "Q3 Launch",
    trail: [ROOT, { id: "marketing", name: "Marketing" }],
    folders: [],
    files: [
      {
        id: "l1",
        name: "Launch run of show.xlsx",
        kind: "sheet",
        bytes: 336_000,
        modified: "2026-08-21",
        owner: "Priya Raman",
        shared: true,
        starred: true,
      },
      {
        id: "l2",
        name: "Announcement film — v7.mp4",
        kind: "video",
        bytes: 3_240_000_000,
        modified: "2026-08-19",
        owner: "Tomas Lindqvist",
      },
      {
        id: "l3",
        name: "Keynote deck.pdf",
        kind: "pdf",
        bytes: 28_900_000,
        modified: "2026-08-16",
        owner: "Dana Okafor",
        shared: true,
      },
      {
        id: "l4",
        name: "Launch hero — 3200px.png",
        kind: "image",
        bytes: 18_400_000,
        modified: "2026-08-10",
        owner: "Jae-won Park",
      },
    ],
  },
  engineering: {
    name: "Engineering",
    trail: [ROOT],
    folders: [{ id: "specs", name: "Specs" }],
    files: [
      {
        id: "e1",
        name: "platform-architecture.md",
        kind: "code",
        bytes: 76_000,
        modified: "2026-08-20",
        owner: "Rafael Costa",
        starred: true,
      },
      {
        id: "e2",
        name: "Load test — August.xlsx",
        kind: "sheet",
        bytes: 2_480_000,
        modified: "2026-08-18",
        owner: "Ines Moreau",
      },
      {
        id: "e3",
        name: "incident-2026-07-31.log.gz",
        kind: "archive",
        bytes: 94_200_000,
        modified: "2026-08-01",
        owner: "Ines Moreau",
      },
      {
        id: "e4",
        name: "Service topology.png",
        kind: "image",
        bytes: 3_940_000,
        modified: "2026-07-27",
        owner: "Rafael Costa",
        shared: true,
      },
    ],
  },
  specs: {
    name: "Specs",
    trail: [ROOT, { id: "engineering", name: "Engineering" }],
    folders: [],
    files: [
      {
        id: "s1",
        name: "Billing migration RFC.docx",
        kind: "doc",
        bytes: 342_000,
        modified: "2026-08-19",
        owner: "Ines Moreau",
        shared: true,
      },
      {
        id: "s2",
        name: "search-index.schema.json",
        kind: "code",
        bytes: 41_000,
        modified: "2026-08-12",
        owner: "Rafael Costa",
      },
      {
        id: "s3",
        name: "API rate limits.pdf",
        kind: "pdf",
        bytes: 1_060_000,
        modified: "2026-08-02",
        owner: "Ines Moreau",
      },
    ],
  },
  finance: {
    name: "Finance",
    trail: [ROOT],
    folders: [],
    files: [
      {
        id: "f1",
        name: "FY27 operating model.xlsx",
        kind: "sheet",
        bytes: 4_720_000,
        modified: "2026-08-21",
        owner: "Dana Okafor",
        starred: true,
      },
      {
        id: "f2",
        name: "Board pack — Q2.pdf",
        kind: "pdf",
        bytes: 9_380_000,
        modified: "2026-08-07",
        owner: "Priya Raman",
        shared: true,
      },
      {
        id: "f3",
        name: "Vendor contracts.zip",
        kind: "archive",
        bytes: 214_000_000,
        modified: "2026-07-22",
        owner: "Priya Raman",
      },
    ],
  },
}

// Folder tiles summarise their whole subtree. Derived rather than authored so a
// tile can never claim contents that opening the folder contradicts.
function folderTotals(id: string): { count: number; bytes: number } {
  const node = FOLDERS[id]
  if (!node) return { count: 0, bytes: 0 }
  let count = node.files.length
  let bytes = node.files.reduce((total, file) => total + file.bytes, 0)
  for (const sub of node.folders) {
    const totals = folderTotals(sub.id)
    count += 1 + totals.count
    bytes += totals.bytes
  }
  return { count, bytes }
}

const STORAGE_BREAKDOWN = [
  { label: "Video", size: "112 GB", fill: "bg-primary" },
  { label: "Design files", size: "78 GB", fill: "bg-accent" },
  { label: "Images", size: "41 GB", fill: "bg-success" },
  { label: "Documents", size: "17 GB", fill: "bg-warning" },
]

/* ------------------------------- Formatting -------------------------------- */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

function formatDate(iso: string) {
  const [year = "", month = "1", day = ""] = iso.split("-")
  return `${MONTHS[Number(month) - 1] ?? ""} ${Number(day)}, ${year}`
}

function formatSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB"]
  let value = bytes
  let unit = 0
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000
    unit += 1
  }
  const rounded =
    value < 10 && unit > 0 ? value.toFixed(1) : String(Math.round(value))
  return `${rounded} ${units[unit] ?? "B"}`
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
}

/* --------------------------------- Pieces ---------------------------------- */

function FileActions({ file }: { file: FileEntry }) {
  return (
    <MenuContent>
      <MenuItem textValue="Open">
        <FolderOpenIcon />
        Open
        <Kbd className="ml-auto">⏎</Kbd>
      </MenuItem>
      <MenuItem textValue="Download">
        <DownloadIcon />
        Download
        <Kbd className="ml-auto">⌘S</Kbd>
      </MenuItem>
      <MenuItem textValue="Copy link">
        <LinkIcon />
        Copy link
      </MenuItem>
      <MenuItem textValue="Share">
        <ShareIcon />
        Share
      </MenuItem>
      <Separator />
      <MenuItem textValue="Rename">
        <PencilIcon />
        Rename
      </MenuItem>
      <MenuItem textValue={file.starred ? "Remove star" : "Add star"}>
        <StarIcon />
        {file.starred ? "Remove star" : "Add star"}
      </MenuItem>
      <Separator />
      <MenuItem variant="danger" textValue="Move to trash">
        <Trash2Icon />
        Move to trash
        <Kbd className="ml-auto">⌫</Kbd>
      </MenuItem>
    </MenuContent>
  )
}

function FileTile({ file }: { file: FileEntry }) {
  const kind = KINDS[file.kind]
  const Icon = kind.icon
  return (
    <Menu trigger="contextMenu">
      <Pressable>
        <div
          role="button"
          tabIndex={0}
          aria-label={`Actions for ${file.name}`}
          className="h-full"
        >
          <Card className="h-full gap-0 overflow-hidden p-0 transition-colors hover:border-border-hover">
            <div
              className={cn(
                "flex aspect-[16/9] items-center justify-center border-b border-border-muted",
                kind.tone,
              )}
            >
              <Icon className="size-8" />
            </div>
            <CardContent className="flex items-start gap-2 p-3">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span
                  className="truncate text-sm font-medium"
                  title={file.name}
                >
                  {file.name}
                </span>
                <span className="text-xs text-fg-muted tabular-nums">
                  {formatSize(file.bytes)} · {formatDate(file.modified)}
                </span>
                <div className="flex flex-wrap items-center gap-1 pt-0.5">
                  <Badge appearance="subtle" size="sm">
                    {kind.label}
                  </Badge>
                  {file.shared && (
                    <Badge appearance="subtle" size="sm" variant="info">
                      Shared
                    </Badge>
                  )}
                  {file.starred && (
                    <StarIcon
                      role="img"
                      aria-label="Starred"
                      className="size-3 text-fg-warning"
                    />
                  )}
                </div>
              </div>
              <Menu>
                <Button
                  variant="quiet"
                  size="sm"
                  isIconOnly
                  aria-label={`Actions for ${file.name}`}
                  className="-mt-1 -mr-1"
                >
                  <MoreVerticalIcon />
                </Button>
                <Popover placement="bottom end">
                  <FileActions file={file} />
                </Popover>
              </Menu>
            </CardContent>
          </Card>
        </div>
      </Pressable>
      <Popover>
        <FileActions file={file} />
      </Popover>
    </Menu>
  )
}

function FolderTile({
  folder,
  onOpen,
}: {
  folder: SubFolder
  onOpen: () => void
}) {
  const { count, bytes } = folderTotals(folder.id)
  return (
    <Button
      variant="quiet"
      onPress={onOpen}
      className="h-auto w-full flex-col items-start gap-1 rounded-lg border bg-card p-3 text-left hover:bg-muted"
    >
      <span className="flex w-full items-center gap-2">
        <FolderIcon className="text-fg-muted" />
        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {folder.name}
        </span>
      </span>
      <span className="text-xs font-normal text-fg-muted tabular-nums">
        {count === 0 ? "Empty" : `${count} items · ${formatSize(bytes)}`}
      </span>
    </Button>
  )
}

function StorageCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ServerIcon className="size-4 text-fg-muted" />
          Storage
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ProgressBar
          aria-label="Storage used"
          value={248}
          maxValue={512}
          formatOptions={{ style: "percent" }}
          className="w-full"
        >
          <div className="flex items-baseline justify-between gap-2">
            <Label className="text-sm">248 GB of 512 GB</Label>
            <ProgressBarOutput className="text-xs text-fg-muted tabular-nums" />
          </div>
          <ProgressBarControl />
        </ProgressBar>
        <ul className="flex flex-col gap-2">
          {STORAGE_BREAKDOWN.map((row) => (
            <li key={row.label} className="flex items-center gap-2 text-sm">
              <span
                aria-hidden="true"
                className={cn("size-2 shrink-0 rounded-full", row.fill)}
              />
              <span className="min-w-0 flex-1 truncate text-fg-muted">
                {row.label}
              </span>
              <span className="shrink-0 tabular-nums">{row.size}</span>
            </li>
          ))}
        </ul>
        <Button variant="secondary" className="w-full">
          Manage plan
        </Button>
      </CardContent>
    </Card>
  )
}

function NewFolderDialog() {
  return (
    <Dialog>
      <Button variant="primary" className="w-full">
        <FolderPlusIcon />
        New folder
      </Button>
      <Modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
            <DialogDescription>
              Folders inherit the sharing settings of their parent.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <TextField
              autoFocus
              defaultValue="Untitled folder"
              className="w-full"
            >
              <Label>Name</Label>
              <Input className="w-full" />
            </TextField>
          </DialogBody>
          <DialogFooter>
            <Button slot="close">Cancel</Button>
            <Button slot="close" variant="primary">
              Create folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Modal>
    </Dialog>
  )
}

function FolderTree({
  folderId,
  onOpen,
}: {
  folderId: string
  onOpen: (id: string) => void
}) {
  return (
    <Tree
      aria-label="Folders"
      selectionMode="single"
      selectionBehavior="replace"
      selectedKeys={new Set([folderId])}
      onSelectionChange={(keys) => {
        if (keys === "all") return
        const [first] = keys
        if (first != null) onOpen(String(first))
      }}
      defaultExpandedKeys={["workspace", "design", "marketing", "engineering"]}
    >
      <TreeItem id="workspace" textValue="Meridian">
        <TreeItemContent>
          {({ isExpanded }) => (
            <>
              {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
              Meridian
            </>
          )}
        </TreeItemContent>
        <TreeItem id="design" textValue="Product Design">
          <TreeItemContent>
            {({ isExpanded }) => (
              <>
                {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
                Product Design
              </>
            )}
          </TreeItemContent>
          <TreeItem id="brand" textValue="Brand">
            <TreeItemContent>
              <FolderIcon />
              Brand
            </TreeItemContent>
          </TreeItem>
          <TreeItem id="webapp" textValue="Web App">
            <TreeItemContent>
              <FolderIcon />
              Web App
            </TreeItemContent>
          </TreeItem>
        </TreeItem>
        <TreeItem id="marketing" textValue="Marketing">
          <TreeItemContent>
            {({ isExpanded }) => (
              <>
                {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
                Marketing
              </>
            )}
          </TreeItemContent>
          <TreeItem id="launch" textValue="Q3 Launch">
            <TreeItemContent>
              <FolderIcon />
              Q3 Launch
            </TreeItemContent>
          </TreeItem>
        </TreeItem>
        <TreeItem id="engineering" textValue="Engineering">
          <TreeItemContent>
            {({ isExpanded }) => (
              <>
                {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
                Engineering
              </>
            )}
          </TreeItemContent>
          <TreeItem id="specs" textValue="Specs">
            <TreeItemContent>
              <FolderIcon />
              Specs
            </TreeItemContent>
          </TreeItem>
        </TreeItem>
        <TreeItem id="finance" textValue="Finance">
          <TreeItemContent>
            <FolderIcon />
            Finance
          </TreeItemContent>
        </TreeItem>
      </TreeItem>
    </Tree>
  )
}

/* ---------------------------------- Page ----------------------------------- */

type SortKey = "name" | "modified" | "size"

export default function FileManager() {
  const [folderId, setFolderId] = useState("design")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [sort, setSort] = useState<SortKey>("modified")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const folder = FOLDERS[folderId] ?? WORKSPACE

  const files = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matched = q
      ? folder.files.filter(
          (file) =>
            file.name.toLowerCase().includes(q) ||
            file.owner.toLowerCase().includes(q),
        )
      : folder.files
    return [...matched].sort((a, b) => {
      if (sort === "size") return b.bytes - a.bytes
      if (sort === "name") return a.name.localeCompare(b.name)
      return b.modified.localeCompare(a.modified)
    })
  }, [folder, query, sort])

  const subFolders = query.trim() ? [] : folder.folders

  const openFolder = (id: string) => {
    setFolderId(id)
    setQuery("")
    setSelected(new Set())
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-[100rem] items-center gap-3 px-4 sm:px-6">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-fg-on-primary">
            <FolderIcon className="size-4" />
          </div>
          <span className="truncate font-semibold">Meridian Drive</span>
          <Badge
            appearance="subtle"
            variant="accent"
            className="hidden sm:inline-flex"
          >
            Team
          </Badge>
          <div className="ml-auto flex items-center gap-2">
            <Tooltip>
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label="Notifications"
              >
                <BellIcon />
              </Button>
              <TooltipContent>3 new file requests</TooltipContent>
            </Tooltip>
            <Avatar size="sm">
              <AvatarFallback>EV</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[100rem] gap-6 px-4 py-5 sm:px-6">
        <aside className="hidden w-60 shrink-0 flex-col gap-4 lg:flex">
          <NewFolderDialog />
          <FolderTree folderId={folderId} onOpen={openFolder} />
          <StorageCard />
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-4">
          <Breadcrumbs>
            {folder.trail.map((crumb) => (
              <BreadcrumbItem key={crumb.id}>
                <BreadcrumbLink onPress={() => openFolder(crumb.id)}>
                  {crumb.name}
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
            ))}
            <BreadcrumbItem>
              <BreadcrumbLink>{folder.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumbs>

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {folder.name}
            </h1>
            <span className="text-sm text-fg-muted tabular-nums">
              {folder.folders.length} folders · {folder.files.length} files
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SearchField
              aria-label="Search this folder"
              value={query}
              onChange={(next) => {
                setQuery(next)
                setSelected(new Set())
              }}
              placeholder="Search files and people…"
              className="min-w-40 flex-1 sm:max-w-xs"
            />
            <Select
              aria-label="Sort by"
              value={sort}
              onChange={(key) => {
                if (key != null) setSort(String(key) as SortKey)
              }}
              className="w-40"
            >
              <SelectTrigger />
              <SelectContent>
                <SelectItem id="name">Name</SelectItem>
                <SelectItem id="modified">Last modified</SelectItem>
                <SelectItem id="size">Size</SelectItem>
              </SelectContent>
            </Select>
            <ToggleButtonGroup
              aria-label="View"
              disallowEmptySelection
              selectedKeys={new Set([view])}
              onSelectionChange={(keys) => {
                const [first] = keys
                if (first == null) return
                // Only the list view can show a row as selected — carrying a
                // selection into the grid would leave the action bar orphaned.
                setSelected(new Set())
                setView(first === "list" ? "list" : "grid")
              }}
            >
              <ToggleButton id="grid" isIconOnly aria-label="Grid view">
                <LayoutGridIcon />
              </ToggleButton>
              <ToggleButton id="list" isIconOnly aria-label="List view">
                <ListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
            <FileTrigger allowsMultiple>
              <Button variant="primary">
                <UploadIcon />
                Upload
              </Button>
            </FileTrigger>
          </div>

          <DropZone className="w-full flex-row flex-wrap items-center justify-center gap-3 p-4">
            <UploadIcon className="size-5 text-fg-muted" />
            <DropZoneLabel className="text-sm text-fg-muted">
              Drop files here to upload to {folder.name}
            </DropZoneLabel>
            <FileTrigger allowsMultiple>
              <Button size="sm">Browse files</Button>
            </FileTrigger>
          </DropZone>

          {selected.size > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card px-3 py-2">
              <Badge variant="accent">{selected.size}</Badge>
              <span className="text-sm text-fg-muted">selected</span>
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <Button size="sm">
                  <DownloadIcon />
                  Download
                </Button>
                <Button size="sm">
                  <ShareIcon />
                  Share
                </Button>
                <Button size="sm" variant="danger">
                  <Trash2Icon />
                  Delete
                </Button>
                <Button
                  size="sm"
                  variant="quiet"
                  onPress={() => setSelected(new Set())}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {subFolders.length > 0 && (
            <section className="flex flex-col gap-2">
              <h2 className="text-xs font-medium tracking-widest text-fg-muted uppercase">
                Folders
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {subFolders.map((sub) => (
                  <FolderTile
                    key={sub.id}
                    folder={sub}
                    onOpen={() => openFolder(sub.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {files.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FolderOpenIcon />
                </EmptyMedia>
                <EmptyTitle>
                  {query.trim() ? "No matching files" : "This folder is empty"}
                </EmptyTitle>
                <EmptyDescription>
                  {query.trim()
                    ? `Nothing in ${folder.name} matches “${query.trim()}”. Try another name or owner.`
                    : `Upload files or drag them in to start filling ${folder.name}.`}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <FileTrigger allowsMultiple>
                  <Button variant="primary">
                    <UploadIcon />
                    Upload files
                  </Button>
                </FileTrigger>
              </EmptyContent>
            </Empty>
          ) : (
            <section className="flex flex-col gap-2">
              <h2 className="text-xs font-medium tracking-widest text-fg-muted uppercase">
                Files
              </h2>
              {view === "grid" ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {files.map((file) => (
                    <FileTile key={file.id} file={file} />
                  ))}
                </div>
              ) : (
                <TableContainer>
                  <Table
                    aria-label={`Files in ${folder.name}`}
                    selectionMode="multiple"
                    selectedKeys={selected}
                    onSelectionChange={(keys) =>
                      setSelected(
                        keys === "all"
                          ? new Set(files.map((file) => file.id))
                          : new Set([...keys].map(String)),
                      )
                    }
                  >
                    <TableHeader>
                      <TableColumn isRowHeader>Name</TableColumn>
                      <TableColumn className="hidden sm:table-cell">
                        Owner
                      </TableColumn>
                      <TableColumn className="hidden md:table-cell">
                        Last modified
                      </TableColumn>
                      <TableColumn className="text-right">Size</TableColumn>
                      <TableColumn textValue="Actions" className="w-10">
                        <span className="sr-only">Actions</span>
                      </TableColumn>
                    </TableHeader>
                    <TableBody>
                      {files.map((file) => {
                        const kind = KINDS[file.kind]
                        const Icon = kind.icon
                        return (
                          <TableRow key={file.id} id={file.id}>
                            <TableCell>
                              <span className="flex min-w-0 items-center gap-2">
                                <span
                                  className={cn(
                                    "flex size-6 shrink-0 items-center justify-center rounded-sm",
                                    kind.tone,
                                  )}
                                >
                                  <Icon className="size-3.5" />
                                </span>
                                <span className="min-w-0 truncate font-medium">
                                  {file.name}
                                </span>
                                {file.shared && (
                                  <Users2Icon
                                    role="img"
                                    aria-label="Shared"
                                    className="size-3.5 shrink-0 text-fg-muted"
                                  />
                                )}
                                {file.starred && (
                                  <StarIcon
                                    role="img"
                                    aria-label="Starred"
                                    className="size-3.5 shrink-0 text-fg-warning"
                                  />
                                )}
                              </span>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <span className="flex items-center gap-2">
                                <Avatar size="sm">
                                  <AvatarFallback className="text-[0.625rem]">
                                    {initials(file.owner)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate text-fg-muted">
                                  {file.owner}
                                </span>
                              </span>
                            </TableCell>
                            <TableCell className="hidden text-fg-muted tabular-nums md:table-cell">
                              {formatDate(file.modified)}
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {formatSize(file.bytes)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Menu>
                                <Button
                                  variant="quiet"
                                  size="sm"
                                  isIconOnly
                                  aria-label={`Actions for ${file.name}`}
                                >
                                  <MoreVerticalIcon />
                                </Button>
                                <Popover placement="bottom end">
                                  <FileActions file={file} />
                                </Popover>
                              </Menu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </section>
          )}

          <div className="flex items-center gap-2 pt-1 text-xs text-fg-muted">
            <Users2Icon className="size-3.5 shrink-0" />
            <span>
              Shared with 12 teammates · Last synced today at 09:41 by Elena
              Vasquez
            </span>
          </div>

          <StorageCard className="lg:hidden" />
        </main>
      </div>
    </div>
  )
}
