"use client"

/* The panel's inline search — the header's search button swaps to a search
   bar over the header, and the query filters the index rows in place (the
   System Settings model): one list, no floating results. No open/close
   animation on purpose: it's a frequent gesture and instant feels faster.
   ⌘P, not ⌘K — the site header's docs search owns ⌘K everywhere, /studio
   included. */

import { useEffect, useRef } from "react"
import { SearchIcon, XIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Input } from "@/registry/ui/input"
import { SearchField } from "@/registry/ui/search-field"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

/** Renders the trigger button in place; the bar positions against the panel
 *  header (the nearest positioned ancestor). `query` is null while closed. */
export function PanelSearch({
  query,
  onQueryChange,
  onSubmit,
  onFocusResults,
}: {
  query: string | null
  onQueryChange: (query: string | null) => void
  /** Enter in the field — open the first match. */
  onSubmit: () => void
  /** ArrowDown in the field — hand focus to the first result row. */
  onFocusResults: () => void
}) {
  const isOpen = query !== null
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Global shortcut — ⌘P / Ctrl+P toggles from anywhere on the page.
  // `preventDefault` also suppresses the browser's print dialog; `repeat`
  // keeps a held chord from toggling every key-repeat tick.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return
      if (event.key === "p" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        onQueryChange(isOpen ? null : "")
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onQueryChange])

  // Keyboard-initiated closes hand focus back to the trigger.
  function close() {
    onQueryChange(null)
    buttonRef.current?.focus()
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
          onPress={() => onQueryChange("")}
        >
          <SearchIcon />
        </Button>
        <TooltipContent>Search settings ⌘P</TooltipContent>
      </Tooltip>
      {isOpen && (
        <div
          className="absolute inset-0 z-10 flex items-center gap-2 rounded-t-xl bg-card pr-2 pl-3"
          onKeyDown={(event) => {
            // SearchField preventDefaults Escape while it has text (to clear);
            // an unprevented Escape means the input was already empty — close.
            if (event.key === "Escape" && !event.defaultPrevented) close()
            if (event.key === "Enter") onSubmit()
            if (event.key === "ArrowDown") {
              event.preventDefault()
              onFocusResults()
            }
          }}
        >
          <SearchIcon className="size-4 shrink-0 text-fg-muted" />
          <SearchField
            autoFocus
            aria-label="Search settings"
            value={query}
            onChange={onQueryChange}
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
      )}
    </>
  )
}

export function matches(text: string, query: string) {
  return text.toLowerCase().includes(query.trim().toLowerCase())
}

/** The label with the query's characters emphasized. */
export function Highlight({ text, query }: { text: string; query: string }) {
  const needle = query.trim()
  const start = needle ? text.toLowerCase().indexOf(needle.toLowerCase()) : -1
  if (start < 0) return text
  const end = start + needle.length
  return (
    <>
      {text.slice(0, start)}
      <mark className="bg-transparent font-semibold text-fg">
        {text.slice(start, end)}
      </mark>
      {text.slice(end)}
    </>
  )
}
