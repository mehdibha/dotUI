"use client"

/* The panel's search — the header's search button opens a popover holding a
   command: search field on top, the chapter list under it. Opens instantly on
   purpose: it's a frequent gesture. Selecting drills into the chapter. ⌘P, not
   ⌘K — the site header's docs search owns ⌘K everywhere, /studio included. */

import { useEffect, useState } from "react"
import { SearchIcon, XIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Command } from "@/registry/ui/command"
import { Dialog } from "@/registry/ui/dialog"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

import type { IndexChapter } from "./groups"
import { INSTANT_POPOVER } from "./rows"

export function PanelSearch({
  chapters,
  onOpenChapter,
}: {
  chapters: IndexChapter[]
  onOpenChapter: (id: string) => void
}) {
  const [isOpen, setOpen] = useState(false)

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

  return (
    <Dialog isOpen={isOpen} onOpenChange={setOpen}>
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
          <SearchField autoFocus aria-label="Search settings">
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
          <ListBox
            aria-label="Settings"
            className="max-h-64 overscroll-contain"
            renderEmptyState={() => (
              <div className="px-3 py-6 text-center text-sm text-fg-muted">
                No matching settings
              </div>
            )}
          >
            {chapters.map((chapter) => (
              <ListBoxItem
                key={chapter.id}
                id={chapter.id}
                // Members make a composite findable by what it absorbed —
                // "toggle" or "segmented" both land on Buttons.
                textValue={[
                  chapter.label,
                  ...chapter.members.map((member) => member.label),
                ].join(" ")}
                onAction={() => jump(chapter.id)}
              >
                <span className="truncate">{chapter.label}</span>
              </ListBoxItem>
            ))}
          </ListBox>
        </Command>
      </Popover>
    </Dialog>
  )
}
