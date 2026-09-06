"use client"

/* The panel's inline search — the header's search button swaps to a combobox
   bar over the header, suggestions anchored below it. No open/close animation
   on purpose: it's a frequent gesture and instant feels faster. Selecting
   drills into the chapter. ⌘P, not ⌘K — the site header's docs search owns ⌘K
   everywhere, /create included. */

import { useEffect, useRef, useState } from "react"
import { SearchIcon, XIcon } from "lucide-react"
import * as AutocompletePrimitive from "react-aria-components/Autocomplete"

import { Button } from "@/registry/ui/button"
import { Input } from "@/registry/ui/input"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { SearchField } from "@/registry/ui/search-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

import type { IndexChapter } from "./groups"

/** Renders the trigger button in place; the bar and suggestions card position
 *  against the panel header (the nearest positioned ancestor). */
export function PanelSearch({
  chapters,
  onOpenChapter,
}: {
  chapters: IndexChapter[]
  onOpenChapter: (id: string) => void
}) {
  const [isOpen, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { contains } = AutocompletePrimitive.useFilter({
    sensitivity: "base",
    ignorePunctuation: true,
  })

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

  // Click/tap anywhere outside dismisses — without stealing focus back.
  useEffect(() => {
    if (!isOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown, true)
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true)
  }, [isOpen])

  // Keyboard-initiated closes hand focus back to the trigger.
  function close() {
    setOpen(false)
    buttonRef.current?.focus()
  }

  function jump(id: string) {
    close()
    onOpenChapter(id)
  }

  return (
    <>
      <Tooltip delay={300}>
        <Button
          ref={buttonRef}
          size="sm"
          variant="quiet"
          isIconOnly
          aria-label="Search settings"
          onPress={() => setOpen(true)}
        >
          <SearchIcon />
        </Button>
        <TooltipContent>Search settings ⌘P</TooltipContent>
      </Tooltip>
      {isOpen && (
        <div
          ref={wrapperRef}
          className="contents"
          onKeyDown={(event) => {
            // SearchField preventDefaults Escape while it has text (to clear);
            // an unprevented Escape means the input was already empty — close.
            if (event.key === "Escape" && !event.defaultPrevented) close()
          }}
          onBlur={(event) => {
            // Tab-away closes; a null relatedTarget (scrollbar clicks) doesn't.
            if (
              event.relatedTarget &&
              !event.currentTarget.contains(event.relatedTarget)
            )
              setOpen(false)
          }}
        >
          <AutocompletePrimitive.Autocomplete filter={contains}>
            {/* The bar — takes over the header while searching. */}
            <div className="absolute inset-0 z-10 flex items-center gap-2 rounded-t-xl bg-card pr-2 pl-3">
              <SearchIcon className="size-4 shrink-0 text-fg-muted" />
              <SearchField
                autoFocus
                aria-label="Search settings"
                className="flex min-w-0 flex-1 flex-row items-center"
              >
                <Input
                  placeholder="Search settings…"
                  className="h-full w-full border-0 bg-transparent px-0 shadow-none focus:ring-0"
                />
              </SearchField>
              {/* Outside the SearchField on purpose — RAC would wire it as a
                  clear button; this one closes the search entirely. */}
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label="Close search"
                onPress={close}
              >
                <XIcon />
              </Button>
            </div>
            {/* The suggestions card — solid bg: backdrop-blur can't sample
                past the header's own backdrop-filter. */}
            <div className="absolute inset-x-2 top-full z-10 mt-2 overflow-hidden rounded-lg border border-border/45 bg-card shadow-[0_4px_16px_-4px_rgb(0_0_0/0.2),0_2px_6px_-2px_rgb(0_0_0/0.12)]">
              <ListBox
                aria-label="Settings"
                className="max-h-80 overflow-y-auto p-1"
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
            </div>
          </AutocompletePrimitive.Autocomplete>
        </div>
      )}
    </>
  )
}
