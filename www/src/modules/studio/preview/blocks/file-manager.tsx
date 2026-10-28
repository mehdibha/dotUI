import { useState } from "react"

import {
  ArchiveIcon,
  ClockIcon,
  CopyIcon,
  DownloadIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  FolderPlusIcon,
  ImageIcon,
  LayoutGridIcon,
  LinkIcon,
  ListIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlayIcon,
  PlusIcon,
  ShareIcon,
  StarIcon,
  TableIcon,
  Trash2Icon,
  UploadIcon,
  Users2Icon,
  XIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback, AvatarGroup } from "@/registry/ui/avatar"
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/registry/ui/breadcrumbs"
import { Button } from "@/registry/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { ProgressBar, ProgressBarControl } from "@/registry/ui/progress-bar"
import { SearchField } from "@/registry/ui/search-field"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
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
import { BrandMark, BrandName } from "@/modules/studio/assets/brand"

import { initials } from "./shared"

// A Dropbox-style file browser: folders you open into with breadcrumbs
// back out, list and grid views, multi-select with a bulk action bar,
// stars, and a preview panel with sharing for the file you open.

type Kind =
  | "folder"
  | "image"
  | "pdf"
  | "doc"
  | "sheet"
  | "video"
  | "zip"
  | "code"

interface Entry {
  id: string
  name: string
  kind: Kind
  parent: string | null
  modified: string
  size?: string
  sharedWith?: string[]
}

const ENTRIES: Entry[] = [
  {
    id: "brand",
    name: "Brand",
    kind: "folder",
    parent: null,
    modified: "Oct 27, 2026",
    sharedWith: ["Hana Sato", "Marcus Lee", "Priya Raman"],
  },
  {
    id: "finance",
    name: "Finance",
    kind: "folder",
    parent: null,
    modified: "Oct 21, 2026",
  },
  {
    id: "product",
    name: "Product",
    kind: "folder",
    parent: null,
    modified: "Oct 26, 2026",
    sharedWith: ["Priya Raman"],
  },
  {
    id: "q4",
    name: "Q4 planning.pdf",
    kind: "pdf",
    parent: null,
    modified: "Oct 28, 2026",
    size: "2.4 MB",
    sharedWith: ["Marcus Lee", "Hana Sato"],
  },
  {
    id: "offsite",
    name: "Team offsite.mov",
    kind: "video",
    parent: null,
    modified: "Oct 18, 2026",
    size: "1.2 GB",
  },
  {
    id: "pitch",
    name: "Northwind pitch.key",
    kind: "doc",
    parent: null,
    modified: "Oct 12, 2026",
    size: "48.1 MB",
  },
  {
    id: "export",
    name: "Customer export.csv",
    kind: "sheet",
    parent: null,
    modified: "Oct 9, 2026",
    size: "812 KB",
  },
  {
    id: "logos",
    name: "Logos",
    kind: "folder",
    parent: "brand",
    modified: "Oct 27, 2026",
  },
  {
    id: "guidelines",
    name: "Brand guidelines.pdf",
    kind: "pdf",
    parent: "brand",
    modified: "Oct 25, 2026",
    size: "18.6 MB",
    sharedWith: ["Hana Sato"],
  },
  {
    id: "hero",
    name: "Homepage hero.png",
    kind: "image",
    parent: "brand",
    modified: "Oct 24, 2026",
    size: "4.1 MB",
  },
  {
    id: "palette",
    name: "Palette tokens.json",
    kind: "code",
    parent: "brand",
    modified: "Oct 20, 2026",
    size: "6 KB",
  },
  {
    id: "logo-dark",
    name: "logo-dark.svg",
    kind: "image",
    parent: "logos",
    modified: "Oct 27, 2026",
    size: "3 KB",
  },
  {
    id: "logo-light",
    name: "logo-light.svg",
    kind: "image",
    parent: "logos",
    modified: "Oct 27, 2026",
    size: "3 KB",
  },
  {
    id: "logo-pack",
    name: "Logo pack.zip",
    kind: "zip",
    parent: "logos",
    modified: "Oct 27, 2026",
    size: "12.8 MB",
  },
  {
    id: "budget",
    name: "Budget 2027.xlsx",
    kind: "sheet",
    parent: "finance",
    modified: "Oct 21, 2026",
    size: "240 KB",
  },
  {
    id: "invoices",
    name: "Invoices",
    kind: "folder",
    parent: "finance",
    modified: "Oct 2, 2026",
  },
  {
    id: "roadmap",
    name: "Roadmap H1.pdf",
    kind: "pdf",
    parent: "product",
    modified: "Oct 26, 2026",
    size: "1.1 MB",
    sharedWith: ["Priya Raman"],
  },
  {
    id: "research",
    name: "Interview notes.docx",
    kind: "doc",
    parent: "product",
    modified: "Oct 19, 2026",
    size: "88 KB",
  },
]

const KIND_ICON: Record<Kind, typeof FileIcon> = {
  folder: FolderIcon,
  image: ImageIcon,
  pdf: FileTextIcon,
  doc: FileTextIcon,
  sheet: TableIcon,
  video: PlayIcon,
  zip: ArchiveIcon,
  code: FileCodeIcon,
}

const KIND_LABEL: Record<Kind, string> = {
  folder: "Folder",
  image: "Image",
  pdf: "PDF document",
  doc: "Document",
  sheet: "Spreadsheet",
  video: "Video",
  zip: "Archive",
  code: "Code",
}

const NAV = [
  { id: "all", label: "All files", icon: FolderIcon },
  { id: "recents", label: "Recents", icon: ClockIcon },
  { id: "starred", label: "Starred", icon: StarIcon },
  { id: "shared", label: "Shared", icon: Users2Icon },
  { id: "deleted", label: "Deleted files", icon: Trash2Icon },
]

function KindIcon({ kind, className }: { kind: Kind; className?: string }) {
  const Icon = KIND_ICON[kind]
  return (
    <Icon
      className={cn(
        "shrink-0",
        kind === "folder"
          ? "fill-primary/15 text-primary"
          : "text-fg-muted",
        className,
      )}
    />
  )
}

function Access({ people }: { people?: string[] }) {
  if (!people?.length) return <span className="text-fg-muted">Only you</span>
  return (
    <AvatarGroup size="sm">
      {people.map((person) => (
        <Avatar key={person}>
          <AvatarFallback>{initials(person)}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  )
}

function Preview({
  entry,
  starred,
  onStar,
  onClose,
}: {
  entry: Entry
  starred: boolean
  onStar: () => void
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)
  return (
    <aside
      aria-label="File preview"
      className="flex min-h-0 w-full shrink-0 flex-col border-l bg-bg max-xl:absolute max-xl:inset-y-0 max-xl:right-0 max-xl:z-10 max-xl:max-w-sm xl:w-80"
    >
      <div className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <KindIcon kind={entry.kind} className="size-4" />
        <span className="min-w-0 flex-1 truncate text-sm font-medium compact:text-xs">
          {entry.name}
        </span>
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          aria-label="Close preview"
          onPress={onClose}
        >
          <XIcon />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="flex aspect-[4/3] items-center justify-center rounded-(--studio-radius-card) border bg-muted">
          <KindIcon kind={entry.kind} className="size-12" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="primary" size="sm">
            <ShareIcon />
            Share
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onPress={() => {
              void navigator.clipboard?.writeText(
                `https://files.northwind.co/s/${entry.id}`,
              )
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            }}
          >
            {copied ? <CopyIcon /> : <LinkIcon />}
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
        <dl className="mt-5 flex flex-col text-sm compact:text-xs">
          {[
            ["Type", KIND_LABEL[entry.kind]],
            ["Size", entry.size ?? "—"],
            ["Modified", entry.modified],
            [
              "Location",
              entry.parent
                ? ENTRIES.find((e) => e.id === entry.parent)?.name
                : "All files",
            ],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 py-1.5">
              <dt className="text-fg-muted">{label}</dt>
              <dd className="truncate">{value}</dd>
            </div>
          ))}
        </dl>
        <Separator className="my-4" />
        <p className="pb-2 text-xs font-medium text-fg-muted">Who has access</p>
        <ul className="flex flex-col gap-2.5 text-sm compact:text-xs">
          {["You", ...(entry.sharedWith ?? [])].map((person) => (
            <li key={person} className="flex items-center gap-2.5">
              <Avatar size="sm">
                <AvatarFallback>
                  {initials(person === "You" ? "Erin Calloway" : person)}
                </AvatarFallback>
              </Avatar>
              <span className="flex-1">{person}</span>
              <span className="text-xs text-fg-muted">
                {person === "You" ? "Owner" : "Can edit"}
              </span>
            </li>
          ))}
        </ul>
        <Separator className="my-4" />
        <Button variant="quiet" size="sm" onPress={onStar}>
          <StarIcon className={cn(starred && "fill-current text-fg-warning")} />
          {starred ? "Starred" : "Star"}
        </Button>
      </div>
    </aside>
  )
}

export default function FileManagerBlock() {
  const [section, setSection] = useState("all")
  const [folder, setFolder] = useState<string | null>(null)
  const [view, setView] = useState<"list" | "grid">("list")
  const [query, setQuery] = useState("")
  const [entries, setEntries] = useState(ENTRIES)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [starred, setStarred] = useState<Set<string>>(new Set(["brand", "q4"]))
  const [openId, setOpenId] = useState<string | null>(null)
  const [deleted, setDeleted] = useState<Entry[]>([])

  const toggleStar = (id: string) =>
    setStarred((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const path: Entry[] = []
  for (let id = folder; id; ) {
    const entry = entries.find((e) => e.id === id)
    if (!entry) break
    path.unshift(entry)
    id = entry.parent
  }

  const q = query.trim().toLowerCase()
  const rows: Entry[] = [
    ...(q
      ? entries.filter((e) => e.name.toLowerCase().includes(q))
      : section === "starred"
        ? entries.filter((e) => starred.has(e.id))
        : section === "shared"
          ? entries.filter((e) => e.sharedWith?.length)
          : section === "recents"
            ? entries.filter((e) => e.kind !== "folder").slice(0, 6)
            : section === "deleted"
              ? deleted
              : entries.filter((e) => e.parent === folder)),
  ].sort((a, b) =>
    a.kind === "folder" && b.kind !== "folder"
      ? -1
      : b.kind === "folder" && a.kind !== "folder"
        ? 1
        : a.name.localeCompare(b.name),
  )

  const open = (entry: Entry) => {
    if (section === "deleted") return
    if (entry.kind === "folder") {
      setSection("all")
      setFolder(entry.id)
      setQuery("")
      setSelected(new Set())
      setOpenId(null)
    } else {
      setOpenId(entry.id)
    }
  }

  const removeSelected = () => {
    setDeleted((d) => [...d, ...entries.filter((e) => selected.has(e.id))])
    setEntries((current) => current.filter((e) => !selected.has(e.id)))
    if (openId && selected.has(openId)) setOpenId(null)
    setSelected(new Set())
  }

  const addFolder = () => {
    const id = `new-${entries.length}`
    setEntries((current) => [
      ...current,
      {
        id,
        name: "Untitled folder",
        kind: "folder",
        parent: folder,
        modified: "Just now",
      },
    ])
    setSection("all")
  }

  const preview = entries.find((e) => e.id === openId)
  const title = q
    ? `Results for “${query.trim()}”`
    : section === "all"
      ? (path.at(-1)?.name ?? "All files")
      : NAV.find((n) => n.id === section)?.label

  return (
    <div className="flex h-svh min-h-svh bg-bg text-fg">
      <aside
        aria-label="Files navigation"
        className="hidden w-60 shrink-0 flex-col border-r md:flex"
      >
        <div className="flex h-14 items-center gap-2.5 px-4">
          <BrandMark className="size-7">
            <span className="flex size-7 items-center justify-center rounded-(--studio-radius-item) bg-primary text-xs font-semibold text-fg-on-primary">
              N
            </span>
          </BrandMark>
          <span className="text-sm font-medium compact:text-xs">
            <BrandName>Northwind</BrandName>
          </span>
        </div>
        <div className="px-3 pt-2">
          <Menu>
            <Button variant="primary" className="w-full">
              <PlusIcon />
              Create
            </Button>
            <Popover placement="bottom start" className="w-(--trigger-width)">
              <MenuContent
                onAction={(key) => {
                  if (key === "folder") addFolder()
                }}
              >
                <MenuItem id="folder">
                  <FolderPlusIcon />
                  Folder
                </MenuItem>
                <MenuItem id="upload">
                  <UploadIcon />
                  Upload files
                </MenuItem>
                <MenuItem id="doc">
                  <FileTextIcon />
                  Document
                </MenuItem>
                <MenuItem id="sheet">
                  <TableIcon />
                  Spreadsheet
                </MenuItem>
              </MenuContent>
            </Popover>
          </Menu>
        </div>
        <nav className="flex flex-col gap-0.5 px-3 pt-4">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={section === item.id && !q ? "page" : undefined}
              onClick={() => {
                setSection(item.id)
                setFolder(null)
                setQuery("")
                setSelected(new Set())
              }}
              className={cn(
                "flex cursor-interactive items-center gap-2.5 rounded-(--studio-radius-item) px-2.5 py-1.5 text-left text-sm compact:text-xs [&_svg]:size-4 [&_svg]:text-fg-muted",
                section === item.id && !q
                  ? "bg-muted font-medium"
                  : "hover:bg-muted",
              )}
            >
              <item.icon />
              {item.label}
              {item.id === "deleted" && deleted.length > 0 && (
                <span className="ml-auto text-xs text-fg-muted">
                  {deleted.length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto px-4 pb-4">
          <ProgressBar value={41} aria-label="Storage used" className="gap-1.5">
            <ProgressBarControl />
            <span className="text-xs text-fg-muted">822 GB of 2 TB used</span>
          </ProgressBar>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4 sm:px-6">
          <SearchField
            aria-label="Search files"
            placeholder="Search"
            value={query}
            onChange={setQuery}
            className="w-full max-w-md"
          />
          <Avatar size="sm" className="ml-auto">
            <AvatarFallback>EC</AvatarFallback>
          </Avatar>
        </header>

        <div className="relative flex min-h-0 flex-1">
          <main className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="flex shrink-0 flex-wrap items-center gap-3 px-4 pt-5 pb-3 sm:px-6">
              <div className="min-w-0 flex-1">
                {section === "all" && !q && path.length > 0 && (
                  <Breadcrumbs className="mb-1 text-xs">
                    <BreadcrumbItem>
                      <BreadcrumbLink onPress={() => setFolder(null)}>
                        All files
                      </BreadcrumbLink>
                      <BreadcrumbSeparator />
                    </BreadcrumbItem>
                    {path.slice(0, -1).map((entry) => (
                      <BreadcrumbItem key={entry.id}>
                        <BreadcrumbLink onPress={() => setFolder(entry.id)}>
                          {entry.name}
                        </BreadcrumbLink>
                        <BreadcrumbSeparator />
                      </BreadcrumbItem>
                    ))}
                  </Breadcrumbs>
                )}
                <h1 className="truncate font-heading text-xl font-semibold">
                  {title}
                </h1>
              </div>
              <Button variant="secondary" size="sm">
                <UploadIcon />
                Upload
              </Button>
              <Button variant="secondary" size="sm" onPress={addFolder}>
                <FolderPlusIcon />
                <span className="max-sm:sr-only">New folder</span>
              </Button>
              <SegmentedControl
                aria-label="View"
                selectedKeys={[view]}
                onSelectionChange={(keys) => {
                  const [key] = [...keys]
                  if (key) setView(key as "list" | "grid")
                }}
              >
                <SegmentedControlItem id="list" aria-label="List view">
                  <ListIcon />
                </SegmentedControlItem>
                <SegmentedControlItem id="grid" aria-label="Grid view">
                  <LayoutGridIcon />
                </SegmentedControlItem>
              </SegmentedControl>
            </div>

            {selected.size > 0 && (
              <div className="mx-4 mb-3 flex flex-wrap items-center gap-1 rounded-(--studio-radius-card) border bg-muted px-2 py-1.5 sm:mx-6">
                <Button
                  variant="quiet"
                  size="sm"
                  isIconOnly
                  aria-label="Clear selection"
                  onPress={() => setSelected(new Set())}
                >
                  <XIcon />
                </Button>
                <span className="pr-2 text-sm font-medium compact:text-xs">
                  {selected.size} selected
                </span>
                <Button variant="quiet" size="sm">
                  <ShareIcon />
                  Share
                </Button>
                <Button variant="quiet" size="sm">
                  <DownloadIcon />
                  Download
                </Button>
                <Button
                  variant="quiet"
                  size="sm"
                  isDisabled={selected.size > 1}
                >
                  <PencilIcon />
                  Rename
                </Button>
                <Button
                  variant="quiet"
                  size="sm"
                  className="text-fg-danger"
                  onPress={removeSelected}
                >
                  <Trash2Icon />
                  Delete
                </Button>
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6">
              {rows.length === 0 ? (
                <Empty className="mt-10 rounded-(--studio-radius-card) border border-dashed py-16">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      {section === "deleted" ? <Trash2Icon /> : <UploadIcon />}
                    </EmptyMedia>
                    <EmptyTitle>
                      {q
                        ? "No files match your search"
                        : section === "deleted"
                          ? "Nothing in deleted files"
                          : "Drop files here to upload"}
                    </EmptyTitle>
                    <EmptyDescription>
                      {q
                        ? "Try another name, or search in All files."
                        : section === "deleted"
                          ? "Files you delete stay here for 30 days."
                          : "Or use the Upload button to choose them."}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : view === "list" ? (
                <TableContainer>
                  <Table
                    aria-label={title}
                    selectionMode="multiple"
                    selectedKeys={selected}
                    onSelectionChange={(keys) =>
                      setSelected(
                        keys === "all"
                          ? new Set(rows.map((r) => r.id))
                          : new Set(Array.from(keys, String)),
                      )
                    }
                    onRowAction={(key) => {
                      const entry = rows.find((r) => r.id === key)
                      if (entry) open(entry)
                    }}
                  >
                    <TableHeader>
                      <TableColumn isRowHeader>Name</TableColumn>
                      <TableColumn className="w-40 max-md:hidden">
                        Who can access
                      </TableColumn>
                      <TableColumn className="w-36 max-lg:hidden">
                        Modified
                      </TableColumn>
                      <TableColumn className="w-24 text-right max-sm:hidden">
                        Size
                      </TableColumn>
                      <TableColumn className="w-12">
                        <span className="sr-only">Actions</span>
                      </TableColumn>
                    </TableHeader>
                    <TableBody items={rows} dependencies={[starred, openId]}>
                      {(entry) => (
                        <TableRow
                          id={entry.id}
                          textValue={entry.name}
                          className={cn(
                            "group/row",
                            entry.id === openId && "bg-muted",
                          )}
                        >
                          <TableCell>
                            <span className="flex min-w-0 items-center gap-3">
                              <KindIcon kind={entry.kind} className="size-5" />
                              <span className="truncate">{entry.name}</span>
                              <button
                                type="button"
                                aria-label={
                                  starred.has(entry.id) ? "Unstar" : "Star"
                                }
                                onClick={(event) => {
                                  event.stopPropagation()
                                  toggleStar(entry.id)
                                }}
                                className={cn(
                                  "flex cursor-interactive text-fg-muted hover:text-fg",
                                  !starred.has(entry.id) &&
                                    "opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100",
                                )}
                              >
                                <StarIcon
                                  className={cn(
                                    "size-3.5",
                                    starred.has(entry.id) &&
                                      "fill-current text-fg-warning",
                                  )}
                                />
                              </button>
                            </span>
                          </TableCell>
                          <TableCell className="max-md:hidden">
                            <Access people={entry.sharedWith} />
                          </TableCell>
                          <TableCell className="text-fg-muted max-lg:hidden">
                            {entry.modified}
                          </TableCell>
                          <TableCell className="text-right text-fg-muted tabular-nums max-sm:hidden">
                            {entry.size ?? "—"}
                          </TableCell>
                          <TableCell>
                            <Menu>
                              <Button
                                variant="quiet"
                                size="xs"
                                isIconOnly
                                aria-label={`More actions for ${entry.name}`}
                              >
                                <MoreHorizontalIcon />
                              </Button>
                              <Popover placement="bottom end">
                                <MenuContent
                                  className="min-w-44"
                                  onAction={(key) => {
                                    if (key === "open") open(entry)
                                    if (key === "star") toggleStar(entry.id)
                                    if (key === "delete") {
                                      setDeleted((d) => [...d, entry])
                                      setEntries((c) =>
                                        c.filter((e) => e.id !== entry.id),
                                      )
                                    }
                                  }}
                                >
                                  <MenuItem id="open">Open</MenuItem>
                                  <MenuItem id="share">Share</MenuItem>
                                  <MenuItem id="star">
                                    {starred.has(entry.id) ? "Unstar" : "Star"}
                                  </MenuItem>
                                  <MenuItem id="download">Download</MenuItem>
                                  <MenuItem id="delete" variant="danger">
                                    Delete
                                  </MenuItem>
                                </MenuContent>
                              </Popover>
                            </Menu>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                  {rows.map((entry) => (
                    <li key={entry.id}>
                      <button
                        type="button"
                        onClick={() => open(entry)}
                        className={cn(
                          "group/tile flex w-full cursor-interactive flex-col overflow-hidden rounded-(--studio-radius-card) border text-left",
                          entry.id === openId
                            ? "border-border-focus"
                            : "hover:bg-muted",
                        )}
                      >
                        <span className="flex aspect-[4/3] items-center justify-center bg-muted">
                          <KindIcon kind={entry.kind} className="size-10" />
                        </span>
                        <span className="flex items-center gap-2 px-3 py-2.5">
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm compact:text-xs">
                              {entry.name}
                            </span>
                            <span className="text-xs text-fg-muted">
                              {entry.kind === "folder"
                                ? `${entries.filter((e) => e.parent === entry.id).length} items`
                                : entry.size}
                            </span>
                          </span>
                          {starred.has(entry.id) && (
                            <StarIcon className="size-3.5 fill-current text-fg-warning" />
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </main>

          {preview && (
            <Preview
              key={preview.id}
              entry={preview}
              starred={starred.has(preview.id)}
              onStar={() => toggleStar(preview.id)}
              onClose={() => setOpenId(null)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
