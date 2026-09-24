"use client"

/* The panel's search — the header's search button opens a popover holding a
   command: search field on top, results under it once there's a query (the
   full index is the panel itself, so an empty query shows a prompt instead).
   Opens instantly on purpose: it's a frequent gesture. Selecting scrolls to
   the chapter. ⌘P, not ⌘K — the site header's docs search owns ⌘K
   everywhere, /studio included. */

import { useEffect, useMemo, useState } from "react"
import { SearchIcon, XIcon } from "lucide-react"
import { useFilter } from "react-aria-components/Autocomplete"

import { Button } from "@/registry/ui/button"
import { Command } from "@/registry/ui/command"
import { Dialog } from "@/registry/ui/dialog"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { SearchField } from "@/registry/ui/search-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

import { SEARCH_INDEX } from "./__generated__/search-index"
import { PanelPopover } from "./rows"
import type { Chapter } from "./state"

interface Entry {
  id: string
  chapterId: string
  /** The chapter. */
  category: string
  /** A settings row inside it; absent for the chapter itself. */
  axis?: string
}

/* Words people search for that a row's label doesn't say, keyed by
   `chapter/row`. */
const ALIASES: Record<string, string[]> = {
  "color/Brand": ["accent", "primary color", "hex", "logo"],
  "color/Neutral": ["gray", "grey", "background"],
  "color/Semantics": ["success", "warning", "danger", "error", "status"],
  "color/Vividness": ["saturation", "chroma"],
  "color/Primary": ["accent", "fill", "button color"],
  "typography/Heading": ["font", "typeface"],
  "typography/Body": ["font", "typeface", "text"],
  "typography/Mono": ["font", "code"],
  "shape/Radius": ["corner", "rounded", "roundness", "border radius"],
  "shape/Character": ["corner", "rounded", "pill", "sharp"],
  "space/Density": ["spacing", "padding", "size", "compact", "comfortable"],
  "space/Unit": ["spacing", "grid"],
  "surfaces/Style": ["border", "outline", "card"],
  "surfaces/Depth": ["shadow", "elevation"],
  "surfaces/Page": ["background", "tint"],
  "surfaces/Glass": ["blur", "translucent", "frosted", "transparent"],
  "browser/Highlight": ["text selection"],
  "states/Control focus": ["focus ring", "outline"],
  "states/Field focus": ["focus ring", "outline"],
  "motion/Easing": ["animation", "spring", "curve"],
  "motion/Speed": ["animation", "duration"],
  "motion/Overlays": ["animation", "entrance", "transition"],
  "motion/State changes": ["animation", "hover", "transition"],
}

function categories(chapters: Chapter[]): Entry[] {
  return chapters.map((chapter) => ({
    id: chapter.id,
    chapterId: chapter.id,
    category: chapter.label,
  }))
}

/** Every settings row, under its chapter. */
function axes(chapters: Chapter[]): Entry[] {
  return chapters.flatMap((chapter) =>
    (SEARCH_INDEX[chapter.id] ?? []).map((axis) => ({
      id: `${chapter.id}/${axis}`,
      chapterId: chapter.id,
      category: chapter.label,
      axis,
    })),
  )
}

/** The label with the query's characters picked out in accent. */
function Highlight({ text, query }: { text: string; query: string }) {
  const needle = query.trim()
  const start = needle ? text.toLowerCase().indexOf(needle.toLowerCase()) : -1
  if (start < 0) return text
  const end = start + needle.length
  return (
    <>
      {text.slice(0, start)}
      <mark className="bg-transparent text-accent">
        {text.slice(start, end)}
      </mark>
      {text.slice(end)}
    </>
  )
}

export function PanelSearch({
  chapters,
  onOpenChapter,
}: {
  chapters: Chapter[]
  onOpenChapter: (id: string) => void
}) {
  const [isOpen, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const { contains } = useFilter({
    sensitivity: "base",
    ignorePunctuation: true,
  })
  // Chapters first: a query that names one lists chapters only. Rows surface
  // only when no chapter matches — searching "color" means the Color chapter,
  // not every row called Color. Filtered here, not
  // left to the Autocomplete, so the list is right even if the field remounts.
  const items = useMemo(() => {
    const needle = query.trim()
    if (!needle) return []
    const cats = categories(chapters).filter((c) =>
      contains(c.category, needle),
    )
    return cats.length > 0
      ? cats
      : axes(chapters).filter(
          (a) =>
            contains(a.axis ?? "", needle) ||
            (ALIASES[a.id] ?? []).some((alias) => contains(alias, needle)),
        )
  }, [chapters, query, contains])

  // Global shortcut — ⌘P / Ctrl+P toggles from anywhere on the page.
  // `preventDefault` also suppresses the browser's print dialog; `repeat`
  // keeps a held chord from toggling every key-repeat tick.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      if (event.key === "p" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((open) => !open)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function jump(id: string) {
    setOpen(false)
    onOpenChapter(id)
  }

  function close(open: boolean) {
    setOpen(open)
    if (!open) setQuery("")
  }

  return (
    <Dialog isOpen={isOpen} onOpenChange={close}>
      <Tooltip delay={300}>
        <Button size="sm" variant="quiet" isIconOnly aria-label="Search">
          <SearchIcon />
        </Button>
        <TooltipContent>Search ⌘P</TooltipContent>
      </Tooltip>
      <PanelPopover placement="bottom end">
        <Command aria-label="Search" className="w-56">
          {/* Both chain with the Autocomplete's own field props. */}
          <SearchField
            autoFocus
            aria-label="Search"
            value={query}
            onChange={setQuery}
          >
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <Input placeholder="Search…" />
              <InputGroupAddon className="[--addon-button-inset:--spacing(1.5)]">
                <Button variant="quiet" isIconOnly>
                  <XIcon aria-hidden="true" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </SearchField>
          {/* An empty query hands the listbox no items, so the empty state
              doubles as the prompt. */}
          <ListBox
            aria-label="Settings"
            className="max-h-64 overscroll-contain"
            items={items}
            dependencies={[query]}
            renderEmptyState={() => (
              <div className="px-3 py-6 text-center text-sm text-fg-muted">
                {query.trim() ? "No results" : "Type to search"}
              </div>
            )}
          >
            {(entry) => (
              <ListBoxItem
                id={entry.id}
                // The Command filters again on this; aliases keep their hits.
                textValue={[
                  entry.axis ?? entry.category,
                  ...(ALIASES[entry.id] ?? []),
                ].join(" ")}
                onAction={() => jump(entry.chapterId)}
                className="flex-col items-start gap-0"
              >
                {entry.axis ? (
                  <>
                    <span className="truncate text-xs text-fg-muted">
                      {entry.category}
                    </span>
                    <span className="truncate">
                      <Highlight text={entry.axis} query={query} />
                    </span>
                  </>
                ) : (
                  <span className="truncate">
                    <Highlight text={entry.category} query={query} />
                  </span>
                )}
              </ListBoxItem>
            )}
          </ListBox>
        </Command>
      </PanelPopover>
    </Dialog>
  )
}
