"use client"

import { useMemo, useState } from "react"

import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
  FolderSearchIcon,
  GitBranchIcon,
  MaximizeIcon,
  MoreHorizontalIcon,
  PanelLeftIcon,
  SearchIcon,
  XIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
import { Kbd } from "@/registry/ui/kbd"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Separator } from "@/registry/ui/separator"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { Tree, TreeItem, TreeItemContent } from "@/registry/ui/tree"

/* ---------------------------------------------------------------------------
 * Code Editor — an IDE surface: open-file tabs, a filterable file tree and a
 * syntax-highlighted source pane with line numbers and a status bar.
 * ------------------------------------------------------------------------- */

/** Syntax tones map to semantic tokens so highlighting follows the theme. */
type Tone = "kw" | "str" | "num" | "cm" | "pn" | "fn" | "at" | "pl"

type Token = [Tone, string]

const TONE_CLASS: Record<Tone, string> = {
  kw: "text-fg-accent",
  str: "text-fg-success",
  num: "text-fg-warning",
  cm: "text-fg-muted",
  pn: "text-fg-muted",
  fn: "text-fg-info",
  at: "text-fg-warning",
  pl: "",
}

interface SourceFile {
  id: string
  name: string
  dir: string
  language: string
  lines: Token[][]
}

const FILES: Record<string, SourceFile> = {
  button: {
    id: "button",
    name: "button.tsx",
    dir: "src/components",
    language: "TypeScript JSX",
    lines: [
      [
        ["kw", "import"],
        ["pl", " { tv } "],
        ["kw", "from"],
        ["str", ' "tailwind-variants"'],
      ],
      [],
      [
        ["kw", "const"],
        ["pl", " button "],
        ["pn", "= "],
        ["fn", "tv"],
        ["pn", "({"],
      ],
      [
        ["at", "  base"],
        ["pn", ": "],
        ["str", '"inline-flex items-center justify-center gap-2 rounded-md"'],
        ["pn", ","],
      ],
      [
        ["at", "  variants"],
        ["pn", ": {"],
      ],
      [
        ["at", "    variant"],
        ["pn", ": {"],
      ],
      [
        ["at", "      primary"],
        ["pn", ": "],
        ["str", '"bg-primary text-fg-on-primary"'],
        ["pn", ","],
      ],
      [
        ["at", "      secondary"],
        ["pn", ": "],
        ["str", '"border bg-secondary text-fg"'],
        ["pn", ","],
      ],
      [["pn", "    },"]],
      [
        ["at", "    size"],
        ["pn", ": { "],
        ["at", "sm"],
        ["pn", ": "],
        ["str", '"h-8 px-3 text-sm"'],
        ["pn", ", "],
        ["at", "md"],
        ["pn", ": "],
        ["str", '"h-9 px-4"'],
        ["pn", " },"],
      ],
      [["pn", "  },"]],
      [
        ["at", "  defaultVariants"],
        ["pn", ": { "],
        ["at", "variant"],
        ["pn", ": "],
        ["str", '"primary"'],
        ["pn", ", "],
        ["at", "size"],
        ["pn", ": "],
        ["str", '"md"'],
        ["pn", " },"],
      ],
      [["pn", "})"]],
      [],
      [
        ["kw", "export function "],
        ["fn", "Button"],
        ["pn", "({ variant, size, ...props }: "],
        ["fn", "ButtonProps"],
        ["pn", ") {"],
      ],
      [
        ["kw", "  return"],
        ["pn", " <"],
        ["fn", "button"],
        ["pl", " "],
        ["at", "className"],
        ["pn", "={"],
        ["fn", "button"],
        ["pn", "({ variant, size })} {...props} />"],
      ],
      [["pn", "}"]],
    ],
  },
  card: {
    id: "card",
    name: "card.tsx",
    dir: "src/components",
    language: "TypeScript JSX",
    lines: [
      [
        ["kw", "import type"],
        ["pl", " { ComponentProps } "],
        ["kw", "from"],
        ["str", ' "react"'],
      ],
      [],
      [
        ["kw", "export function "],
        ["fn", "Card"],
        ["pn", "(props: "],
        ["fn", "ComponentProps"],
        ["pn", "<"],
        ["str", '"div"'],
        ["pn", ">) {"],
      ],
      [
        ["kw", "  return"],
        ["pl", " ("],
      ],
      [
        ["pn", "    <"],
        ["fn", "div"],
      ],
      [
        ["at", "      className"],
        ["pn", "="],
        ["str", '"rounded-xl border bg-card p-4 shadow-sm"'],
      ],
      [["pn", "      {...props}"]],
      [["pn", "    />"]],
      [["pl", "  )"]],
      [["pn", "}"]],
    ],
  },
  "use-theme": {
    id: "use-theme",
    name: "use-theme.ts",
    dir: "src/hooks",
    language: "TypeScript",
    lines: [
      [
        ["kw", "import"],
        ["pl", " { useEffect, useState } "],
        ["kw", "from"],
        ["str", ' "react"'],
      ],
      [],
      [
        ["kw", "const"],
        ["pl", " STORAGE_KEY "],
        ["pn", "= "],
        ["str", '"meridian-theme"'],
      ],
      [],
      [
        [
          "cm",
          "/** Reads the persisted theme once, then follows user toggles. */",
        ],
      ],
      [
        ["kw", "export function "],
        ["fn", "useTheme"],
        ["pn", "() {"],
      ],
      [
        ["kw", "  const"],
        ["pl", " [theme, setTheme] "],
        ["pn", "= "],
        ["fn", "useState"],
        ["pn", "<"],
        ["str", '"light"'],
        ["pn", " | "],
        ["str", '"dark"'],
        ["pn", ">("],
        ["str", '"light"'],
        ["pn", ")"],
      ],
      [],
      [
        ["pl", "  "],
        ["fn", "useEffect"],
        ["pn", "(() => {"],
      ],
      [
        ["kw", "    const"],
        ["pl", " stored "],
        ["pn", "= "],
        ["pl", "localStorage"],
        ["pn", "."],
        ["fn", "getItem"],
        ["pn", "(STORAGE_KEY)"],
      ],
      [
        ["kw", "    if"],
        ["pn", " (stored === "],
        ["str", '"dark"'],
        ["pn", ") "],
        ["fn", "setTheme"],
        ["pn", "("],
        ["str", '"dark"'],
        ["pn", ")"],
      ],
      [["pn", "  }, [])"]],
      [],
      [
        ["kw", "  return"],
        ["pn", " { theme, setTheme }"],
      ],
      [["pn", "}"]],
    ],
  },
  tokens: {
    id: "tokens",
    name: "tokens.css",
    dir: "src/styles",
    language: "CSS",
    lines: [
      [
        ["fn", ":root"],
        ["pn", " {"],
      ],
      [
        ["at", "  --radius"],
        ["pn", ": "],
        ["num", "0.625rem"],
        ["pn", ";"],
      ],
      [
        ["at", "  --color-bg"],
        ["pn", ": "],
        ["fn", "oklch"],
        ["pn", "("],
        ["num", "0.99 0 0"],
        ["pn", ");"],
      ],
      [
        ["at", "  --color-fg"],
        ["pn", ": "],
        ["fn", "oklch"],
        ["pn", "("],
        ["num", "0.2 0.01 260"],
        ["pn", ");"],
      ],
      [
        ["at", "  --color-primary"],
        ["pn", ": "],
        ["fn", "oklch"],
        ["pn", "("],
        ["num", "0.55 0.2 265"],
        ["pn", ");"],
      ],
      [["pn", "}"]],
      [],
      [
        ["fn", ".dark"],
        ["pn", " {"],
      ],
      [
        ["at", "  --color-bg"],
        ["pn", ": "],
        ["fn", "oklch"],
        ["pn", "("],
        ["num", "0.15 0.01 260"],
        ["pn", ");"],
      ],
      [
        ["at", "  --color-fg"],
        ["pn", ": "],
        ["fn", "oklch"],
        ["pn", "("],
        ["num", "0.95 0 0"],
        ["pn", ");"],
      ],
      [["pn", "}"]],
    ],
  },
  index: {
    id: "index",
    name: "index.ts",
    dir: "src",
    language: "TypeScript",
    lines: [
      [
        ["kw", "export"],
        ["pl", " { Button } "],
        ["kw", "from"],
        ["str", ' "./components/button"'],
      ],
      [
        ["kw", "export"],
        ["pl", " { Card } "],
        ["kw", "from"],
        ["str", ' "./components/card"'],
      ],
      [
        ["kw", "export"],
        ["pl", " { useTheme } "],
        ["kw", "from"],
        ["str", ' "./hooks/use-theme"'],
      ],
    ],
  },
  pkg: {
    id: "pkg",
    name: "package.json",
    dir: "",
    language: "JSON",
    lines: [
      [["pn", "{"]],
      [
        ["at", '  "name"'],
        ["pn", ": "],
        ["str", '"@meridian/ui"'],
        ["pn", ","],
      ],
      [
        ["at", '  "version"'],
        ["pn", ": "],
        ["str", '"0.4.2"'],
        ["pn", ","],
      ],
      [
        ["at", '  "type"'],
        ["pn", ": "],
        ["str", '"module"'],
        ["pn", ","],
      ],
      [
        ["at", '  "exports"'],
        ["pn", ": { "],
        ["at", '"."'],
        ["pn", ": "],
        ["str", '"./src/index.ts"'],
        ["pn", " },"],
      ],
      [
        ["at", '  "dependencies"'],
        ["pn", ": {"],
      ],
      [
        ["at", '    "react"'],
        ["pn", ": "],
        ["str", '"^19.1.0"'],
        ["pn", ","],
      ],
      [
        ["at", '    "tailwind-variants"'],
        ["pn", ": "],
        ["str", '"^3.1.1"'],
      ],
      [["pn", "  }"]],
      [["pn", "}"]],
    ],
  },
  readme: {
    id: "readme",
    name: "README.md",
    dir: "",
    language: "Markdown",
    lines: [
      [["fn", "# Meridian UI"]],
      [],
      [
        [
          "pl",
          "A small component kit built on tailwind-variants. Every visual",
        ],
      ],
      [["pl", "decision routes through tokens, so themes swap at runtime."]],
      [],
      [["fn", "## Install"]],
      [],
      [
        ["pn", "```"],
        ["pl", "sh"],
      ],
      [["pl", "pnpm add @meridian/ui"]],
      [["pn", "```"]],
    ],
  },
}

/** Files whose extension has no dedicated icon fall back to FileIcon. */
function fileIcon(name: string) {
  if (/\.(tsx|ts|css|json)$/.test(name)) return FileCodeIcon
  if (/\.mdx?$/.test(name)) return FileTextIcon
  return FileIcon
}

interface FolderSpec {
  id: string
  name: string
  folders?: FolderSpec[]
  files: string[]
}

const TREE: FolderSpec = {
  id: "root",
  name: "meridian-ui",
  folders: [
    {
      id: "src",
      name: "src",
      folders: [
        { id: "components", name: "components", files: ["button", "card"] },
        { id: "hooks", name: "hooks", files: ["use-theme"] },
        { id: "styles", name: "styles", files: ["tokens"] },
      ],
      files: ["index"],
    },
  ],
  files: ["pkg", "readme"],
}

/* --------------------------------- Pieces ---------------------------------- */

function FolderItems({ folder }: { folder: FolderSpec }) {
  return (
    <>
      {folder.folders?.map((sub) => (
        <TreeItem key={sub.id} id={sub.id} textValue={sub.name}>
          <TreeItemContent>
            {({ isExpanded }) => (
              <>
                {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
                {sub.name}
              </>
            )}
          </TreeItemContent>
          <FolderItems folder={sub} />
        </TreeItem>
      ))}
      {folder.files.map((fileId) => {
        const file = FILES[fileId]
        if (!file) return null
        const Icon = fileIcon(file.name)
        return (
          <TreeItem key={file.id} id={file.id} textValue={file.name}>
            <TreeItemContent>
              <Icon />
              {file.name}
            </TreeItemContent>
          </TreeItem>
        )
      })}
    </>
  )
}

function FileTree({
  activeId,
  onOpen,
}: {
  activeId: string | null
  onOpen: (id: string) => void
}) {
  return (
    <Tree
      aria-label="Project files"
      selectionMode="single"
      selectionBehavior="replace"
      selectedKeys={activeId ? new Set([activeId]) : new Set()}
      onSelectionChange={(keys) => {
        if (keys === "all") return
        const [first] = keys
        // Folders toggle via their chevron; only file ids live in FILES.
        if (first != null && String(first) in FILES) onOpen(String(first))
      }}
      defaultExpandedKeys={["root", "src", "components"]}
    >
      <TreeItem id="root" textValue="meridian-ui">
        <TreeItemContent>
          {({ isExpanded }) => (
            <>
              {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
              meridian-ui
            </>
          )}
        </TreeItemContent>
        <FolderItems folder={TREE} />
      </TreeItem>
    </Tree>
  )
}

function QuickOpen({
  query,
  onOpen,
}: {
  query: string
  onOpen: (id: string) => void
}) {
  const matches = Object.values(FILES).filter((file) =>
    file.name.toLowerCase().includes(query.toLowerCase()),
  )

  if (matches.length === 0)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderSearchIcon />
          </EmptyMedia>
          <EmptyTitle>No matching files</EmptyTitle>
          <EmptyDescription>
            Nothing in this project is named “{query.trim()}”.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )

  return (
    <ListBox
      aria-label="Matching files"
      selectionMode="none"
      onAction={(key) => onOpen(String(key))}
    >
      {matches.map((file) => {
        const Icon = fileIcon(file.name)
        return (
          <ListBoxItem key={file.id} id={file.id} textValue={file.name}>
            <Icon className="size-4 shrink-0 text-fg-muted" />
            <span className="flex min-w-0 flex-1 items-baseline gap-2">
              <span className="shrink-0 text-sm">{file.name}</span>
              <span className="truncate text-xs text-fg-muted">{file.dir}</span>
            </span>
          </ListBoxItem>
        )
      })}
    </ListBox>
  )
}

function EditorTab({
  file,
  isActive,
  onSelect,
  onClose,
}: {
  file: SourceFile
  isActive: boolean
  onSelect: () => void
  onClose: () => void
}) {
  const Icon = fileIcon(file.name)
  return (
    <div
      className={cn(
        "group flex shrink-0 items-center border-r",
        isActive ? "bg-bg" : "bg-transparent hover:bg-muted/50",
      )}
    >
      <Button
        variant="quiet"
        size="sm"
        onPress={onSelect}
        aria-current={isActive || undefined}
        className={cn(
          "h-9 gap-2 rounded-none pr-1 pl-3 font-normal hover:bg-transparent",
          !isActive && "text-fg-muted",
        )}
      >
        <Icon className="size-4" />
        {file.name}
      </Button>
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label={`Close ${file.name}`}
        onPress={onClose}
        className={cn(
          "mr-1 size-5 rounded-sm",
          !isActive && "opacity-0 group-hover:opacity-100",
        )}
      >
        <XIcon className="size-3.5" />
      </Button>
    </div>
  )
}

function CodePane({ file }: { file: SourceFile }) {
  const [copied, setCopied] = useState(false)
  const path = file.dir ? `${file.dir}/${file.name}` : file.name

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <span className="flex min-w-0 flex-1 items-baseline gap-2">
          <span className="shrink-0 text-sm font-medium">{file.name}</span>
          <span className="truncate text-xs text-fg-muted">{file.dir}</span>
        </span>
        <Tooltip>
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            aria-label="Search in file"
          >
            <SearchIcon />
          </Button>
          <TooltipContent>
            Search in file <Kbd>⌘F</Kbd>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            aria-label="Copy file path"
            onPress={() => setCopied(true)}
          >
            {copied ? <CheckIcon className="text-fg-success" /> : <CopyIcon />}
          </Button>
          <TooltipContent>{copied ? "Copied" : `Copy ${path}`}</TooltipContent>
        </Tooltip>
      </div>

      <div className="min-w-0 flex-1 overflow-x-auto py-3 font-mono text-xs leading-relaxed">
        <div className="w-max min-w-full">
          {file.lines.map((line, index) => (
            <div
              key={`${file.id}-${index}`}
              className="grid grid-cols-[3rem_1fr] hover:bg-muted/50"
            >
              <span className="pr-4 text-right text-fg-muted/70 tabular-nums select-none">
                {index + 1}
              </span>
              <span className="pr-6 whitespace-pre">
                {line.length === 0
                  ? " "
                  : line.map((token, tokenIndex) => (
                      <span key={tokenIndex} className={TONE_CLASS[token[0]]}>
                        {token[1]}
                      </span>
                    ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      <footer className="flex items-center gap-4 border-t px-4 py-1.5 text-xs text-fg-muted">
        <span className="flex items-center gap-1.5">
          <GitBranchIcon className="size-3.5" />
          main
        </span>
        <span className="hidden sm:inline">{file.language}</span>
        <span className="ml-auto tabular-nums">{file.lines.length} lines</span>
        <span className="hidden tabular-nums sm:inline">Ln 1, Col 1</span>
        <span className="hidden sm:inline">Spaces: 2</span>
        <span className="hidden md:inline">UTF-8</span>
      </footer>
    </div>
  )
}

/* ---------------------------------- Page ----------------------------------- */

export default function CodeEditorBlock() {
  const [openIds, setOpenIds] = useState<string[]>([
    "button",
    "use-theme",
    "tokens",
  ])
  const [activeId, setActiveId] = useState<string | null>("button")
  const [query, setQuery] = useState("")

  const active = activeId ? FILES[activeId] : undefined

  const openFile = (id: string) => {
    setOpenIds((current) => (current.includes(id) ? current : [...current, id]))
    setActiveId(id)
    setQuery("")
  }

  const closeFile = (id: string) => {
    setOpenIds((current) => {
      const next = current.filter((openId) => openId !== id)
      // Closing the active tab moves focus to its left neighbour, like an IDE.
      if (id === activeId) {
        const index = current.indexOf(id)
        setActiveId(next[Math.max(0, index - 1)] ?? null)
      }
      return next
    })
  }

  const openFiles = useMemo(
    () =>
      openIds
        .map((id) => FILES[id])
        .filter((file): file is SourceFile => file != null),
    [openIds],
  )

  return (
    <div className="flex min-h-screen flex-col bg-bg text-fg">
      <header className="flex items-stretch border-b">
        <div className="flex min-w-0 flex-1 items-stretch overflow-x-auto">
          {openFiles.map((file) => (
            <EditorTab
              key={file.id}
              file={file}
              isActive={file.id === activeId}
              onSelect={() => setActiveId(file.id)}
              onClose={() => closeFile(file.id)}
            />
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-1 border-l px-2">
          <Menu>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Editor actions"
            >
              <MoreHorizontalIcon />
            </Button>
            <Popover placement="bottom end">
              <MenuContent>
                <MenuItem textValue="Split editor">
                  <PanelLeftIcon />
                  Split editor
                </MenuItem>
                <MenuItem
                  textValue="Close others"
                  onAction={() => {
                    if (activeId) setOpenIds([activeId])
                  }}
                >
                  Close other tabs
                </MenuItem>
                <Separator />
                <MenuItem
                  variant="danger"
                  textValue="Close all"
                  onAction={() => {
                    setOpenIds([])
                    setActiveId(null)
                  }}
                >
                  Close all tabs
                </MenuItem>
              </MenuContent>
            </Popover>
          </Menu>
          <Tooltip>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Open in new window"
            >
              <ExternalLinkIcon />
            </Button>
            <TooltipContent>Open in new window</TooltipContent>
          </Tooltip>
          <Tooltip>
            <Button
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Expand editor"
            >
              <MaximizeIcon />
            </Button>
            <TooltipContent>Expand</TooltipContent>
          </Tooltip>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 flex-col gap-2 border-r p-3 md:flex">
          <SearchField
            aria-label="Filter files"
            value={query}
            onChange={setQuery}
            placeholder="Filter files…"
          />
          {query.trim() ? (
            <QuickOpen query={query.trim()} onOpen={openFile} />
          ) : (
            <FileTree activeId={activeId} onOpen={openFile} />
          )}
        </aside>

        {active ? (
          <CodePane file={active} />
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileCodeIcon />
                </EmptyMedia>
                <EmptyTitle>No editor open</EmptyTitle>
                <EmptyDescription>
                  Pick a file from the tree, or press <Kbd>⌘P</Kbd> to jump to
                  one by name.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        )}
      </div>
    </div>
  )
}
