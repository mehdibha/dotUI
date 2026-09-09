"use client"

/* The panel's search — the header's search button opens a popover holding a
   command: search field on top, results under it once there's a query (the
   full index is the panel itself, so an empty query shows a prompt instead).
   Opens instantly on purpose: it's a frequent gesture. Selecting drills into
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
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

import { SEARCH_INDEX } from "./__generated__/search-index"
import type { IndexChapter } from "./groups"
import { INSTANT_POPOVER } from "./rows"

interface Entry {
  id: string
  chapterId: string
  /** The category — the chapter, or "Chapter › Member" for composites. */
  category: string
  /** A settings row inside it; absent for the category itself. */
  axis?: string
}

/** The categories: every chapter, plus each composite's non-host members. */
function categories(chapters: IndexChapter[]): Entry[] {
  return chapters.flatMap((chapter) => [
    { id: chapter.id, chapterId: chapter.id, category: chapter.label },
    ...chapter.members
      .filter((m) => chapter.members.length > 1 && m.label !== chapter.label)
      .map((m) => ({
        id: `${chapter.id}/${m.id}`,
        chapterId: chapter.id,
        category: `${chapter.label} › ${m.label}`,
      })),
  ])
}

/** Every settings row, under its category. */
function axes(chapters: IndexChapter[]): Entry[] {
  return chapters.flatMap((chapter) =>
    chapter.members.flatMap((m) => {
      const nested = chapter.members.length > 1 && m.label !== chapter.label
      const category = nested ? `${chapter.label} › ${m.label}` : chapter.label
      return (SEARCH_INDEX[m.id] ?? []).map((axis) => ({
        id: `${chapter.id}/${m.id}/${axis}`,
        chapterId: chapter.id,
        category,
        axis,
      }))
    }),
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
  chapters: IndexChapter[]
  onOpenChapter: (id: string) => void
}) {
  const [isOpen, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const { contains } = useFilter({
    sensitivity: "base",
    ignorePunctuation: true,
  })
  // Categories first: a query that names one lists categories only. Nested
  // axes surface only when nothing at that level matches — searching "color"
  // means the Color chapter, not every row called Color. Filtered here, not
  // left to the Autocomplete, so the list is right even if the field remounts.
  const items = useMemo(() => {
    const needle = query.trim()
    if (!needle) return []
    const cats = categories(chapters).filter((c) =>
      contains(c.category, needle),
    )
    return cats.length > 0
      ? cats
      : axes(chapters).filter((a) => contains(a.axis ?? "", needle))
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
      <Popover placement="bottom end" className={INSTANT_POPOVER}>
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
                textValue={entry.axis ?? entry.category}
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
      </Popover>
    </Dialog>
  )
}
