"use client"

import { FolderIcon, MoonIcon, PlusIcon, SettingsIcon } from "@/registry/icons"
import { useStyles as useCommandStyles } from "@/registry/ui/command/styles"
import { Kbd } from "@/registry/ui/kbd"
import { useStyles as useListStyles } from "@/registry/ui/list-box/styles"
import { useStyles as useModalStyles } from "@/registry/ui/modal/styles"
import { SearchField } from "@/registry/ui/search-field"
import { Separator } from "@/registry/ui/separator"

import { Board, BoardSection } from "./board"
import { KEYED, ROW, STAGE } from "./menus-parts"

interface Entry {
  icon: React.ReactNode
  label: string
  kbd?: string
}

const SUGGESTIONS: Entry[] = [
  { icon: <PlusIcon />, label: "New issue", kbd: "⌘N" },
  { icon: <SettingsIcon />, label: "Open settings", kbd: "⌘," },
  { icon: <MoonIcon />, label: "Switch theme" },
]

const PROJECTS: Entry[] = [
  { icon: <FolderIcon />, label: "Acme Web" },
  { icon: <FolderIcon />, label: "Mobile app" },
]

const ISSUES = [
  ["ACME-142", "Onboarding checklist", "Oct 14"],
  ["ACME-141", "Empty states for projects", "Oct 13"],
  ["ACME-139", "Billing page redesign", "Oct 11"],
  ["ACME-136", "Invite flow copy", "Oct 10"],
  ["ACME-133", "Dark mode charts", "Oct 8"],
  ["ACME-131", "Keyboard shortcuts sheet", "Oct 7"],
  ["ACME-128", "Search results ranking", "Oct 5"],
  ["ACME-124", "Avatar upload crop", "Oct 3"],
  ["ACME-121", "Audit log export", "Oct 1"],
  ["ACME-117", "SSO settings", "Sep 29"],
]

/** The app the palette opens over, under the modal's backdrop. */
function Issues() {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center border-b px-6 py-3 text-sm font-medium max-sm:px-4">
        Issues
      </div>
      {ISSUES.map(([id, title, date]) => (
        <div
          key={id}
          className="flex shrink-0 items-center gap-4 border-b px-6 py-3 text-sm max-sm:px-4"
        >
          <span className="w-20 shrink-0 text-fg-muted tabular-nums max-sm:hidden">
            {id}
          </span>
          <span className="truncate">{title}</span>
          <span className="ml-auto shrink-0 text-xs text-fg-muted">{date}</span>
        </div>
      ))}
    </div>
  )
}

function CommandSpecimen() {
  const { modal, backdrop } = useModalStyles()()
  const command = useCommandStyles()
  const { root, item, itemLabel, section, sectionTitle } = useListStyles()()
  const group = (title: string, entries: Entry[], keyed?: number) => (
    <section data-listbox-section="" className={section()}>
      <header data-listbox-section-header="" className={sectionTitle()}>
        {title}
      </header>
      {entries.map((entry, i) => (
        <div
          key={entry.label}
          data-listbox-item=""
          {...(i === keyed ? KEYED : ROW)}
          className={item()}
        >
          {entry.icon}
          <span className={itemLabel()}>{entry.label}</span>
          {entry.kbd && <Kbd>{entry.kbd}</Kbd>}
        </div>
      ))}
    </section>
  )
  return (
    <div inert className="relative flex justify-center px-4 py-12 max-sm:py-8">
      <Issues />
      <div className={backdrop()} />
      <div data-modal="" className={modal({ className: "w-full sm:max-w-lg" })}>
        <div data-command="" className={command()}>
          <SearchField aria-label="Search" placeholder="Search or jump to…" />
          <div data-listbox="" className={root()}>
            {group("Suggestions", SUGGESTIONS, 0)}
            <Separator />
            {group("Projects", PROJECTS)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CommandBoard() {
  return (
    <Board id="command">
      <BoardSection title="In context" className={STAGE}>
        <CommandSpecimen />
      </BoardSection>
    </Board>
  )
}
