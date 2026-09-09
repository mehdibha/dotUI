"use client"

/* The panel's search — the header's search button opens a popover holding a
   command: search field on top, results under it once there's a query (the
   full index is the panel itself, so an empty query shows a prompt instead).
   Opens instantly on purpose: it's a frequent gesture. Selecting drills into
   the chapter. ⌘P, not ⌘K — the site header's docs search owns ⌘K
   everywhere, /studio included. */

import { useEffect, useMemo, useState } from "react"
import { SearchIcon, XIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Command } from "@/registry/ui/command"
import { Dialog } from "@/registry/ui/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/ui/empty"
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
  label: string
  /** Where the hit lives — the chapter, and the member for composites. */
  context?: string
}

/** One entry per chapter, per composite member, and per settings row. */
function entries(chapters: IndexChapter[]): Entry[] {
  return chapters.flatMap((chapter) => {
    const composite = chapter.members.length > 1
    return [
      { id: chapter.id, chapterId: chapter.id, label: chapter.label },
      ...chapter.members.flatMap((member) => {
        // The host member shares the composite's label — no "Buttons › Buttons".
        const nested = composite && member.label !== chapter.label
        const context = nested
          ? `${chapter.label} › ${member.label}`
          : chapter.label
        const own = nested
          ? [
              {
                id: `${chapter.id}/${member.id}`,
                chapterId: chapter.id,
                label: member.label,
                context: chapter.label,
              },
            ]
          : []
        const rows = (SEARCH_INDEX[member.id] ?? []).map((label) => ({
          id: `${chapter.id}/${member.id}/${label}`,
          chapterId: chapter.id,
          label,
          context,
        }))
        return [...own, ...rows]
      }),
    ]
  })
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
  const items = useMemo(() => entries(chapters), [chapters])

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
        <Button
          size="sm"
          variant="quiet"
          isIconOnly
          aria-label="Search settings"
        >
          <SearchIcon />
        </Button>
        <TooltipContent>Search settings ⌘P</TooltipContent>
      </Tooltip>
      <Popover placement="bottom end" className={INSTANT_POPOVER}>
        <Command aria-label="Search settings" className="w-56">
          {/* onChange chains with the Autocomplete's own — it only observes. */}
          <SearchField
            autoFocus
            aria-label="Search settings"
            onChange={setQuery}
          >
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <Input placeholder="Search settings…" />
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
            items={query.trim() ? items : []}
            renderEmptyState={() =>
              query.trim() ? (
                <Empty className="p-4">
                  <EmptyHeader>
                    <EmptyTitle>No matching settings</EmptyTitle>
                    <EmptyDescription>Try another word.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <Empty className="p-4">
                  <EmptyMedia variant="icon">
                    <SearchIcon />
                  </EmptyMedia>
                  <EmptyHeader>
                    <EmptyTitle>Search settings</EmptyTitle>
                    <EmptyDescription>
                      Find a chapter by name, or by a setting inside it.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )
            }
          >
            {(entry) => (
              <ListBoxItem
                id={entry.id}
                textValue={entry.label}
                onAction={() => jump(entry.chapterId)}
              >
                <span className="truncate">
                  <Highlight text={entry.label} query={query} />
                </span>
                {entry.context && (
                  <span className="ml-auto truncate pl-3 text-xs text-fg-muted">
                    {entry.context}
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
