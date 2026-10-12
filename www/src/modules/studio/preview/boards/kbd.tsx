"use client"

import { SearchIcon } from "@/registry/icons"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Kbd, KbdGroup } from "@/registry/ui/kbd"
import { TextField } from "@/registry/ui/text-field"

import { Board, BoardSection, Specimen } from "./board"

const KEYS = ["⌘", "⇧", "⌥", "⌃", "Esc", "Tab", "↵"]

const SHORTCUTS = [
  { label: "Command menu", keys: ["⌘", "K"] },
  { label: "New issue", keys: ["C"] },
  { label: "Toggle sidebar", keys: ["⌘", "/"] },
  { label: "Copy link", keys: ["⌘", "⇧", "C"] },
]

function Keys({ keys }: { keys: string[] }) {
  return (
    <KbdGroup>
      {keys.map((key) => (
        <Kbd key={key}>{key}</Kbd>
      ))}
    </KbdGroup>
  )
}

export default function KbdBoard() {
  return (
    <Board id="kbd">
      <BoardSection
        title="In context"
        className="items-stretch gap-x-16 gap-y-8"
      >
        <div className="flex w-full max-w-64 flex-col gap-8">
          <Specimen label="Keys">
            <div className="flex min-h-9 flex-wrap items-center justify-center gap-2">
              {KEYS.map((key) => (
                <Kbd key={key}>{key}</Kbd>
              ))}
            </div>
          </Specimen>
          <Specimen label="In a field">
            <TextField aria-label="Search" className="w-full">
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <Input placeholder="Search…" />
                <InputGroupAddon>
                  <Keys keys={["⌘", "K"]} />
                </InputGroupAddon>
              </InputGroup>
            </TextField>
          </Specimen>
        </div>
        <Specimen label="Shortcuts" className="w-full max-w-64 justify-between">
          <ul className="flex w-full flex-col gap-3 text-sm">
            {SHORTCUTS.map((shortcut) => (
              <li
                key={shortcut.label}
                className="flex h-5 items-center justify-between gap-4"
              >
                {shortcut.label}
                <Keys keys={shortcut.keys} />
              </li>
            ))}
          </ul>
        </Specimen>
      </BoardSection>
    </Board>
  )
}
