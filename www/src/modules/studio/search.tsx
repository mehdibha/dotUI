"use client"

/* The panel's search — the header's search button opens a popover holding a
   command: search field on top, results under it once there's a query (the
   full index is the panel itself, so an empty query shows a prompt instead).
   Docked, the field sits at the bottom, on the keyboard, and an empty query
   lists every row under its chapter. Opens instantly on purpose: it's a frequent gesture.
   Selecting scrolls to the chapter. ⌘P, not ⌘K — the site header's docs
   search owns ⌘K everywhere, /studio included. */

import { useEffect, useMemo, useState } from "react"
import { SearchIcon, XIcon } from "lucide-react"
import { useFilter } from "react-aria-components/Autocomplete"

import { Button } from "@/registry/ui/button"
import { Command } from "@/registry/ui/command"
import { Dialog } from "@/registry/ui/dialog"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/registry/ui/list-box"
import { SearchField } from "@/registry/ui/search-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

import { SEARCH_INDEX } from "./__generated__/search-index"
import { PanelPopover, PanelPopoverTitle, useDocked, useMedia } from "./rows"
import type { Chapter } from "./state"

interface Entry {
  id: string
  chapterId: string
  /** The chapter. */
  category: string
  /** A settings row inside it; absent for the chapter itself. */
  axis?: string
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
  onOpenChapter: (id: string, axis?: string) => void
}) {
  const docked = useDocked()
  const coarse = useMedia("(pointer: coarse)")
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
      : axes(chapters).filter((a) => contains(a.axis ?? "", needle))
  }, [chapters, query, contains])
  const index = docked && !query.trim()

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

  function jump(entry: Entry) {
    setOpen(false)
    onOpenChapter(entry.chapterId, entry.axis)
  }

  function close(open: boolean) {
    setOpen(open)
    if (!open) setQuery("")
  }

  const item = (entry: Entry) => (
    <ListBoxItem
      key={entry.id}
      id={entry.id}
      textValue={entry.axis ?? entry.category}
      onAction={() => jump(entry)}
      className="flex-col items-start justify-center gap-0 pointer-coarse:min-h-11"
    >
      {entry.axis && !index && (
        <span className="truncate text-xs text-fg-muted">{entry.category}</span>
      )}
      <span className="truncate">
        <Highlight text={entry.axis ?? entry.category} query={query} />
      </span>
    </ListBoxItem>
  )

  const trigger = (
    <Button
      size="sm"
      variant="quiet"
      isIconOnly
      aria-label="Search"
      className="pointer-coarse:data-icon-only:size-9"
    >
      <SearchIcon />
    </Button>
  )

  return (
    <Dialog isOpen={isOpen} onOpenChange={close}>
      {coarse ? (
        trigger
      ) : (
        <Tooltip delay={300}>
          {trigger}
          <TooltipContent>Search ⌘P</TooltipContent>
        </Tooltip>
      )}
      {/* Docked, a fixed height: results never push the field around. */}
      <PanelPopoverTitle.Provider value="Search">
        <PanelPopover placement="bottom end" className="max-lg:h-72">
          <Command
            aria-label="Search"
            className="w-56 max-lg:min-h-0 max-lg:w-auto max-lg:flex-1 max-lg:flex-col-reverse"
          >
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
              className="max-h-64 overscroll-contain max-lg:max-h-none max-lg:min-h-0 max-lg:flex-1"
              items={index ? undefined : items}
              dependencies={[query]}
              renderEmptyState={() => (
                <div className="px-3 py-6 text-center text-sm text-fg-muted">
                  {query.trim() ? "No results" : "Type to search"}
                </div>
              )}
            >
              {index
                ? chapters.map((chapter) => (
                    <ListBoxSection key={chapter.id} id={chapter.id}>
                      <ListBoxSectionHeader>
                        {chapter.label}
                      </ListBoxSectionHeader>
                      {axes([chapter]).map(item)}
                    </ListBoxSection>
                  ))
                : item}
            </ListBox>
          </Command>
        </PanelPopover>
      </PanelPopoverTitle.Provider>
    </Dialog>
  )
}
